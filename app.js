require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Asset statico per la cartella public
app.use(express.static('public'));

// Post router
const postsRouter = require("./routers/posts.js");
app.use("/posts", postsRouter);

// redirect 
app.get("/", (req, res) => {
    res.redirect("/posts");
});

// Server in ascolto
app.listen(port, () => {
    console.log(`Server in ascolto su http://localhost:${port}`);
});