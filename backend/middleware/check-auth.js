const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        // token is expected from the header in standard format: "Beared [token]"
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, "a_long_secret_string_for_token_validation");
        next();
    } catch (error) {
        res.status(401).json({
            message: "Auth failed: bad or missing authorization token",
            error: error
        });
    }
}