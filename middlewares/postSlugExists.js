const posts = require('../db.json');
module.exports = (req, res, next) => {
    const { slug } = req.params;
    const sluggedPost = posts.find(p => p.slug === slug);

    if (!sluggedPost) {
        return res.status(404).send(`Non esiste un post con slug: "${slug}"`)
    }
    req.postDaEliminare = sluggedPost;
    next();
}