const path = require('path');
const fs = require('fs');
let posts = require('../db.json');

const createSlug = (title) => {
    // Imposto uno slug base dal titolo del post rimuovendo eventuali spazi e trasformandolo in minuscolo
    const baseSlug = title.replaceAll(' ', '-').toLowerCase();

    // Recupero tutti gli slug presenti nel db
    const slugList = posts.map((post) => post.slug);

    let counter = 1;

    let slug = baseSlug;

    // Controllo se lo slug esiste già
    while (slugList.includes(slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }
    return slug;
}

const updatePosts = (nuoviPost) => {
    const filePath = path.join(__dirname, '../db.json');

    fs.writeFileSync(filePath, JSON.stringify(nuoviPost));
    posts = nuoviPost;
}

// index
const index = (req, res) => {
    res.format({
        html: () => {
            let html = '<main>';
            posts.forEach((post) => {
                html += `
                <article>
                    <a href="/posts/${post.slug}"><h2>${post.title}</h2></a>
                    <img width="500" src="/imgs/posts/${post.image}" alt="${post.title}">
                    <p>${post.content}</p>
                    <h4>Tags:</h4>
                    `;
                post.tags.forEach(tag => {
                    html += `<span class="tag">#${tag.toLowerCase().replaceAll(' ', '-')} </span>`;
                });
                html += `
                </article>
                </a>
                <hr>`;
            });
            html += '</main>';
            res.send(html);
        },
        json: () => {
            res.json({
                data: posts,
                count: posts.length,
                description: 'Lista dei post'
            });
        }
    })
}

// show
const show = (req, res) => {
    const slugPost = req.params.slug;
    const postRichiesto = posts.find(post => post.slug === slugPost);

    if (postRichiesto) {
        res.format({
            html: () => {
                let html = `<main>`;
                html += `
                <article>
                <h2>${postRichiesto.title}</h2>
                <img width="500" src="/imgs/posts/${postRichiesto.image}" alt="${postRichiesto.title}">
                <p>${postRichiesto.content}</p>
                <h4>Tags:</h4>`;
                postRichiesto.tags.forEach(tag => {
                    html += `<span class="tag">#${tag.toLowerCase().replaceAll(' ', '-')} </span>`;
                });
                html += `
                    </article>
                    <hr>`;
                html += '</main>';
                res.send(html);
            },
            json: () => {
                res.json({
                    ...postRichiesto,
                    description: 'Post richiesto',
                    image_url: `${req.protocol}://${req.headers.host}/imgs/posts/${postRichiesto.image}`,
                    image_download_url: `${req.protocol}://${req.headers.host}/posts/${postRichiesto.slug}/download`
                });
            }
        })
    } else {
        res.status(404).json({
            error: 'Post non trovato'
        });
    }
}

// create
const create = (req, res) => {
    const { title, content, tags } = req.body;

    if (!title || !content || !tags) {
        return res.status(400).send('Dati mancanti.');
    }

    const slug = createSlug(title);

    const newPost = {
        title,
        content,
        tags,
        slug
    }

    // Aggiorno la lista dei post sul db
    updatePosts([...posts, newPost]);

    // res.format({
    //     html: () => {
    //         res.redirect(`/posts/${slug}`);
    //     },
    //     default: () => {
    //         res.json(newPost);
    //     },
    // })
    console.log(newPost);
    res.end();
}

// download immagine
const download = (req, res) => {
    const slugPost = req.params.slug;
    const postRichiesto = posts.find(post => post.slug === slugPost);
    const filePath = path.join(__dirname, `../public/imgs/posts/${postRichiesto.image}`);
    res.download(filePath);
}

module.exports = {
    index,
    show,
    create,
    download
}