module.exports = cors_config = (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET,PUT,POST,DELETE,PATCH,OPTIONS"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control"
    );
    if ("OPTIONS" == req.method) {
        res.status(200).send();
    } else {
        next();
    }
}