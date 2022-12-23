const {Comment, FavoriteComment} = require("../models/model");

// # comment 작성
exports.create = async (req, res, next) => {
    try {
        const loginUser = req.user;
        const id = req.params.id;
        // 댓글내용
        const content = req.body.content;

        // DB query
        const comment = new Comment({
            article: id,
            content: content,
            user: loginUser._id
        })

        await comment.save();

        res.json(await comment.populate("user"));

    } catch (error) {
        next(error)
    }
}

// # comment 가져오기
exports.comment_list = async (req, res, next) => {
    try {
        const loginUser = req.user;
        const id = req.params.id;

        // Query
        const comments = await Comment
            .find({article: id})
            .populate("user")
            .sort([["created", "descending"]])
            .limit(req.query.limit)
            .skip(req.query.skip)
            .lean();

        // comment data에 isFavorite 속성을 추가한다.
        for (let comment of comments) {
            const favoriteComment = await FavoriteComment
                .findOne({user: loginUser._id, comment: comment._id});
            
            comment.isFavorite = favoriteComment ? true : false;
        }

        res.json(comments);

    } catch (error) {
        next(error)
    }
}

// # comment delete
exports.delete = async (req, res, next) => {
    try {
        const loginUser = req.user;
        const id = req.params.id;

        // Query
        const comment = await Comment.findById(id);

        // 삭제를 요청한 유저와 댓글 작성자가 일치하지 않을 경우
        if (loginUser._id.toString() !== comment.user.toString()) {
            const err = new Error("User not match")
            err.status = 400;
            return next(err);
        }

        // Query
        await comment.delete();

        res.end();

    } catch (error) {
        next(error)
    }
}

// # Comment 좋아요
exports.favorite = async (req, res, next) => {
    try {
        const loginUser = req.user;
        const id = req.params.id;

        // Query
        const comment = await Comment.findById(id);
        const favoriteComment = await FavoriteComment
            .findOne({ user: loginUser._id, comment: comment._id});
        
        // 이미 좋아요를 누른 댓글일 때
        if (favoriteComment) {
            const err = new Error("Already favorite comment");
            err.status = 400;
            return next(err)
        }

        // 새로운 favoriteComment data를 저장한다.
        const newFavoriteComment = new FavoriteComment({
            user: loginUser._id,
            comment: comment._id
        })
        await newFavoriteComment.save();

        // 댓글의 좋아요 수를 1 증가시킨다.
        comment.favoriteCount++;
        await comment.save();

        res.end();

    } catch (error) {
        next(error)
    }
}

// # Comment 좋아요 취소
exports.unfavorite = async (req, res, next) => {
    try {
        const loginUser = req.user;
        const id = req.params.id;

        // Query
        const comment = await Comment.findById(id)
        const favoriteComment = await FavoriteComment
            .findOne({ user: loginUser._id, comment: comment._id});

        // 좋아요를 누른 게시물이 아닌 경우
        if (!favoriteComment) {
            const err = new Error("No comment to unfavorite");
            err.status = 400;
            return next(err)
        }

        // favoriteComment data를 삭제한다.
        await favoriteComment.delete();

        // 댓글의 좋아요 수를 1 감소시킨다.
        comment.favoriteCount--;
        await comment.save();

        res.end();

    } catch (error) {
        next(error)
    }
}