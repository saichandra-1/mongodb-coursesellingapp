function userMiddleware(req, res, next) {
    const jwt=require("jsonwebtoken");
    const token = req.headers.authorization; // bearer token
    const words = token.split(" "); // ["Bearer", "token"]
    const jwtToken = words[1]; // token
    const jwtPassword=require("../config");
    try {
        const decodedValue = jwt.verify(jwtToken, jwtPassword);
        if (decodedValue.email) {
            next();
        } else {
            res.status(403).json({
                msg: "You are not authenticated"
            })
        }
    } catch(e) {
        res.json({
            msg: "Incorrect inputs"
        })
    }

}

module.exports = userMiddleware;