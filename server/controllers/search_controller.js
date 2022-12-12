const { User } = require("../models/model");

exports.username = async (req, res, next) => {
    try {
        // req.query
        // url에 ?key=value의 형태로 담는다.
        const username = req.query.username;
        // username으로 '시작'하는 patt(패턴)
        const patt = new RegExp("^" + username);

        // Query
        const users = await User.find({
            username: {$regex: patt}
        });

        res.json(users);

    } catch(error) {
        next(error)
    }
}