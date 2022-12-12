
// 'user' Logic
exports.user = async (req, res, next) => {
    // try and catch (에러처리)
    try {
        // user data를 loginUser 변수에 담는다
        const loginUser = req.user;

        // # res.json() res: response
        // 서버의 응답
        res.json(loginUser);
    } catch (error) {
        // # next()
        // error를 error handler에 전달한다
        next(error)
    }
}