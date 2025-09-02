module.exports = (title, req) => {
    return {
        title,
        name: req.payload.name
    };
}