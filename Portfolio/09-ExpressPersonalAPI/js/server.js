const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../html'));
let names = [];

app.get('/', (req, res) => {
   res.render('index.html', { error:null, names});
});
app.get('/greet', (req, res, next) => {
    const { name, index } = req.query;
    if (name) {
        names.push(name);
    }
    if (index !== undefined) {
        const idx = parseInt(index);
        if (idx < 0 || idx >= names.length) {
            const err = new Error('Index fuera de rango');
            return next(err);
        }
        res.render('wazzup', { name });
    }
    res.render('index', { error: null, names });
});
app.put('/greet/:name', (req, res) => {
    const { name } = req.params;
    names.push(name);
    res.json(names);
});
app.use((err, req, res, next) => { 
    res.status(400).render('index', { error: err.message, names });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`)); 