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

const deletePostImage = (fileName) => {
    const filePath = path.join(__dirname, '../public/imgs/posts', fileName);
    fs.unlinkSync(filePath);
}

// index
const index = (req, res) => {
    res.format({
        html: () => {
            fs.readFile(path.join(__dirname, '../views/index.html'), 'utf8', (err, html) => {
                if (err) {
                    res.status(500).send('Errore nel caricamento della pagina richiesta.');
                    return;
                }

                let postsHtml = '';
                posts.forEach(post => {
                    let tagsHtml = '';
                    post.tags.forEach(tag => {
                        tagsHtml += `<span class="tag">#${tag.toLowerCase().replace(' ', '-')} </span>`;
                    });

                    postsHtml += `
                        <article>
                            <a href="/posts/${post.slug}"><h2>${post.title}</h2></a>
                            <img width="500" src="/imgs/posts/${post.image}" alt="${post.title}">
                            <p>${post.content}</p>
                            <h4>Tags:</h4>
                            ${tagsHtml}
                            <hr>
                        </article>
                    `;
                });

                html = html.replace('{{POSTS}}', postsHtml);
                res.send(html);
            });
            // let html = '<main>';
            // posts.forEach((post) => {
            //     html += `
            //     <article>
            //         <a href="/posts/${post.slug}"><h2>${post.title}</h2></a>
            //         <img width="500" src="/imgs/posts/${post.image}" alt="${post.title}">
            //         <p>${post.content}</p>
            //         <h4>Tags:</h4>
            //         `;
            //     post.tags.forEach(tag => {
            //         html += `<span class="tag">#${tag.toLowerCase().replaceAll(' ', '-')} </span>`;
            //     });
            //     html += `
            //     </article>
            //     </a>
            //     <hr>`;
            // });
            // html += '</main>';
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

    if (!title || title.replaceAll('/', '').trim().length === 0 || !content || !tags || !Array.isArray(tags) || tags.length === 0) {
        if (req.file) {
            deletePostImage(req.file.filename);
        }

        return res.status(400).send('Dati mancanti.');
    } else if (!req.file || !req.file.mimetype.includes('image')) {
        deletePostImage(req.file.filename);
        return res.status(400).send('Immagine mancante o non valida.');
    }

    const slug = createSlug(title);

    const newPost = {
        title,
        content,
        tags,
        image: req.file.filename,
        slug
    }

    // Aggiorno la lista dei post sul db
    updatePosts([...posts, newPost]);

    res.format({
        html: () => {
            res.redirect(`/posts/${slug}`);
        },
        default: () => {
            res.json(newPost);
        },
    })

    console.log(newPost);
    res.end();
}

// delete
const destroy = (req, res) => {
    const { postDaEliminare } = req;
    // elimino la foto del post
    deletePostImage(postDaEliminare.image);

    // elimino il post dalla lista dei post
    updatePosts(posts.filter(post => post.slug !== postDaEliminare.slug));


    res.format({
        html: () => {
            res.redirect(`/posts`);
        },
        default: () => {
            res.send(`Post ${postDaEliminare.title} eliminato con successo!`);
        },
    })
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
    destroy,
    download
}