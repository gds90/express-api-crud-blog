module.exports = (err, req, res, next) => {
    const statusCode = 500;
    res.format({
        html: () => res.status(statusCode).send('Errore, qualcosa è andato storto.'),
        json: () => res.status(statusCode).json({ statusCode, error: err.message }),
    })
}