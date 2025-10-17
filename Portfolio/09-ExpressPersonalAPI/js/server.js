const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../html')));

let tasks = [];
let names = [];

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../html/index.html'));
});
app.post('/task', (req, res) => {
  const { task } = req.body;
  if (task) tasks.push(task.trim());
  res.redirect('/');
});
app.get('/task', (req, res) => {
  res.json({ tasks });
});
app.get('/task/delete/:index', (req, res) => {
  const i = parseInt(req.params.index);
  if (!isNaN(i)) tasks.splice(i, 1);
  res.redirect('/');
});
app.get('/greet', (req, res) => {
  const { name } = req.query;
  if (name) names.push(name.trim());
  res.redirect(`/wazzup.html?name=${encodeURIComponent(name)}`);
});
app.get('/names', (req, res) => {
  res.json({ names });
});
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));