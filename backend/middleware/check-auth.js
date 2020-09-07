const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        // token is expected from the header in standard format: "Beared [token]"
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, "a_long_secret_string_for_token_validation");
        req.userData = { email: decodedToken.email, userId: decodedToken.userId };
        next();
    } catch (error) {
        res.status(401).json({
            message: "Auth failed: bad or missing authorization token",
            error: error
        });
    }
}