require('dotenv').config();
const express = require('express');
const errorsFormatter = require('./middlewares/errorsFormatter.js');
const port = process.env.PORT || 3000;

const app = express();
const postsRouter = require("./routers/posts.js");

// Asset statico per la cartella public
app.use(express.static('public'));

// Post router
app.use("/posts", postsRouter);

// redirect 
app.get("/", (req, res) => {
    res.redirect("/posts");
});

app.use(errorsFormatter);

// Server in ascolto
app.listen(port, () => {
    console.log(`Server in ascolto su http://localhost:${port}`);
});