const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

let posts = [];
let name;

app.get("/", (req, res) => {
  name = '';
  res.render("index");
});

app.get("/test", (req, res) => {
  name = req.query.name || "friend";
  res.render("test", { name, method: req.method });
});

app.get("/login", (req, res) => {
  name = req.query.name || "friend";
  res.redirect("/test");
});

app.post("/login", (req, res) => {
  name = req.body.name || "friend";
  res.redirect("/test");
});

app.get("/home", (req, res) => {
  if (!name) return res.redirect("/");
  res.render("home", { name, posts });
});

app.post("/home", (req, res) => {
  const { title, content } = req.body;
  if (title && content) {
    posts.push({ id: Date.now(), title, content });
  }
  res.redirect("/home");
});

app.get("/post/:id", (req, res) => {
  const post = posts.find(p => p.id == req.params.id);
  if (!post) return res.redirect("/home");
  res.render("post", { post });
});

app.post("/post/edit/:id", (req, res) => {
  const post = posts.find(p => p.id == req.params.id);
  if (post) {
    post.title = req.body.title;
    post.content = req.body.content;
  }
  res.redirect("/home");
});

app.post("/post/delete/:id", (req, res) => {
  posts = posts.filter(p => p.id != req.params.id);
  res.redirect("/home");
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
