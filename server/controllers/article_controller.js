const { Follow, Article, Favorite } = require("../models/model");
const formidable = require("formidable");
const fs = require("fs");

// # 게시물 등록
exports.create = async (req, res, next) => {
    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields, files) => {
        try {
            const loginUser = req.user;

            if (err) {
                return next(err);
            }

            const images = files.images instanceof Array ? files.images : new Array(files.images);

            // 이미지가 업로드되지 않았을 때
            if (!images[0].originalFilename) {
                const err = new Error("Image must be specified");
                err.status = 400;
                return next(err);
            };

            // 이미지를 data/articles 경로에 저장한다.
            const photos = images.map(photo => {
                const oldPath = photo.filepath;
                const ext = photo.originalFilename.split(".")[1]
                const newName = photo.newFilename + "." + ext;
                const newPath = `${__dirname}/../data/articles/${newName}`;
                fs.renameSync(oldPath, newPath);
                // or fs.copyFileSync(oldPath, newPath);

                return newName;
            })

            // DB query
            const article = new Article({
                description: fields.description,
                photos,
                user: loginUser._id
            });
            await article.save();

            res.json(article);

        } catch (error) {
            next(error)
        }
    });
}

// # 전체 게시물 가져오기
exports.article_list = async (req, res, next) => {
    try {

        // DB query
        const articles = await Article.find()
            .sort([["created", "descending"]]) // 작성일 기준으로 내림차순으로 나열
            .populate("user") // id와 일치하는 data들을 찾아서 연결해준다.
            .skip(req.query.skip)
            .limit(req.query.limit);

            res.json(articles);

    }   catch (error) {
        next(error)
    }
}

// # 특정한 게시물 가져오기
exports.article = async (req, res, next) => {
    try {
        const loginUser = req.user;

        // url로 전달된 parameter로부터 id를 구한다.
        const id = req.params.id;
        // DB query
        const article = await Article
            .findById(id)
            .populate("user")
            .lean();

        // id에 일치하는 게시물이 없을 경우 -> customError
        if (!article) {
            const err = new Error("Article not found");
            err.status = 404; // 404: Not Found
            return next(err);
        }

        // article data에 isFavorite이라는 속성을 추가
        // isFavorite: loginUser가 좋아하는 게시물이면 true, 아니면 false
        const favorite = await Favorite
            .findOne({ user: loginUser._id, article: article._id });
        article.isFavorite = !!favorite; // ex) 게시물의 좋아요 -> true or false만을 전송
        // article.isFavorite = favorite ? true : false;

        res.json(article);

    } catch (error) {
        next(error)
    } 
}

// # 게시물 삭제하기
exports.delete = async (req, res, next) => {
    try {
        
        // 요청 url에 담긴 id의 값
        const id = req.params.id;
        // DB qurey
        const article = await Article
            .findById(id);

        // id에 일치하는 게시물이 없을 때
        if (!article) {
            const err = new Error("Article not found")
            err.status = 404;
            return next(err);
        }

        // DB query
        await article.delete();

        res.end();

    } catch (error) {
        next(error)
    }
}

// # 게시물 좋아요
exports.favorite = async (req, res, next) => {
    try {
        const loginUser = req.user;
        const id = req.params.id;

        const article = await Article.findById(id);

        const favorite = await Favorite
            .findOne({ user: loginUser._id, article: article._id })

        // 이미 좋아요를 누른 게시물일 때
        if (favorite) {
            const err = new Error("Already favorite article");
            err.status = 400;
            return next(err)
        }

        // DB query
        const newFavorite = new Favorite({
            user: loginUser._id,
            article: article._id
        })
        await newFavorite.save();

        // 게시물의 좋아요 수 (favoriteCount)를 1 증가시킨다.
        article.favoriteCount++;
        await article.save();

        res.end();

    } catch (error) {
        next(error)
    }
}

// 좋아요 취소
exports.unfavorite = async (req, res, next) => {
    try {
        const loginUser = req.user;
        const id = req.params.id

        const article = await Article.findById(id)

        const favorite = await Favorite
            .findOne({ user: loginUser._id, article: article._id });

        // 좋아요한 게시물이 아닐 때
        if (!favorite) {
            const err = new Error("No article to unfavorite");
            err.status = 400;
            return next(err);
        }

        // favorite data를 삭제한다.
        await favorite.delete();

        // 게시물의 좋아요 수를 1 감소시킨다.
        article.favoriteCount--;
        await article.save();

        res.end();

    } catch (error) {
        next(error)
    }
}

// # feed 가져오기
exports.feed = async (req, res, next) => {
    try {
        const loginUser = req.user;

        const follows = await Follow.find({ follower: loginUser._id });
        const users = [...follows.map(follow => follow.following), loginUser._id];

        // User가 follow하는 User or User 자신의 게시물
        const articles = await Article
            .find({ user: {$in: users}})
            .sort([["created", "descending"]])
            .populate("user")
            .skip(req.query.skip)
            .limit(req.query.limit)
            .lean();

        // article data에 isFavorite 속성을 추가한다.
        for (let article of articles) {
            const favorite = await Favorite
                .findOne({ user: loginUser._id, article: article._id });

            article.isFavorite = !!favorite;
        }

        res.json(articles)
    
    } catch (error) {
        next(error)
    }
}