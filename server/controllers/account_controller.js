const { User } = require("../models/model");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const formidable = require("formidable");
const fs = require("fs");
const { json } = require("express");

// # login
exports.login = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});

        // user가 존재하지 않을 경우(user not found)
        if (!user) {
            const err = new Error("User not found");
            err.status = 401;
            return next(err);
        }
        
        // 클라이언트로부터 전달받은 비밀번호를
        // user의 salt로 암호화한다. -> 단방향 암호화
        const hashedPassword = crypto
            .pbkdf2Sync(password, user.salt, 310000, 32, "sha256")
            .toString("hex")
        
        // 비밀번호 비교
        if (user.password !== hashedPassword) {
            const err = new Error("Password not match");
            err.status = 401;
            return next(err);
        }

        // # token 발급
        // token에 username을 암호화하여 저장한다.
        // Secret key를 가지고 토큰을 암호화한다.
        const token = jwt.sign({ username: user.username }, process.env.SECRET);

        res.json({ user, token })
    } catch (error) {
        next(error)
    }
}


// # 회원가입
exports.register = [
    // callback 1: user data 유효성 검사
    async (req, res, next) => { // req = request
        // 클라이언트의 data는 req.body에 담긴다.
        const {username, email, password} = req.body;

        // validate username (username 중복 검사)
        {
            // database에 query(쿼리)를 전송한다.
            const user = await User.findOne({ username });

            // # custom Error
            if (user) {
                const err = new Error("이미 가입된 유저이름입니다.");
                err.status = 400;
                return next(err);
            }
        }

        // validate email (email 중복 검사)
        {
            const user = await User.findOne({ email });

            if (user) {
                const err = new Error("이미 가입된 이메일입니다.");
                err.status = 400;
                return next(err);
            }
        }

        // 다음 callback으로 이동한다.
        next();
    },
    // callback 2: user data 저장
    async (req, res, next) => {
        try {
            const {username, email, password} = req.body;

            // # 비밀번호 암호화
            // salt: userdata와 함께 저장되는 유니크한 값이다.
            // 비밀번호 암호화와 복호화에 사용된다.
            const salt = crypto.randomBytes(16).toString("hex");
            const hashedPassword = crypto
                .pbkdf2Sync(password, salt, 310000, 32, "sha256")
                .toString("hex")
            
            // # userdata를 DB에 저장한다.
            const user = new User({
                username,
                email,
                password: hashedPassword,
                salt
            })
            await user.save();

            // 클라이언트에게 userdata를 전송한다.
            res.json(user)

        }   catch (error) {
            next(error)
        }
    },
]

// # Profile Bio Upload
exports.edit = async (req, res, next) => {
    try {
        // req.user를 loginUser 유저변수에 담는다.
        const loginUser = req.user;
        // req.body로부터 user의 자기소개(bio)를 얻는다.
        const bio = req.body.bio;

        // Update query
        const user = await User.findById(loginUser._id);
        user.bio = bio;
        await user.save();

        res.json(user.bio);
    } catch (error) {
        next(error)
    }
}

// # Profile image Upload
exports.upload_image = async (req, res, next) => {
    // formidable: file이 있는 form을 다룰 때 사용되는 module
    const form = formidable({});

    form.parse(req, async (err, fields, files) => {
        try {
            if (err) {
                return next(err);
            }

            const loginUser = req.user;

            // image에 random한 name을 생성한 뒤 data/users 경로에 저장한다.
            const image = files.image;
            const oldPath = image.filepath;
            const ext = image.originalFilename.split(".")[1];
            const newName = image.newFilename + "." + ext;
            const newPath = `${__dirname}/../data/users/${newName}`;
            fs.renameSync(oldPath, newPath);
            // OR
            // cross device link not permitted라는 error일 경우
            // fs.copyFileSync(oldPath, newPath);

            // DB에 image의 name을 저장한다.
            const user = await User.findById(loginUser._id);
            user.image = newName;
            await user.save();

            res.json(newName);

        } catch (error) {
            next(error)
        }
    })
}

// # Profile Image Delete
exports.delete_image = async (req, res, next) => {
    try {
        const loginUser = req.user;
        
        // User Image null로 Update
        const user = await User.findById(loginUser._id);
        user.image = null;
        await user.save();

        // server가 응답을 종료한다.
        res.end(); // res: response

    } catch (error) {
        next(error)
    }
}