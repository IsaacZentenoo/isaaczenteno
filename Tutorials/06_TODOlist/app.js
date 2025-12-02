const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const Item = require("./models/item");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");

app.get("/", async (req, res) => {
  const items = await Item.find({ list: "Today" });
  res.render("list", { listTitle: "Today", newListItems: items });
});

app.post("/", async (req, res) => {
  const list = Array.isArray(req.body.list) ? req.body.list[0] : (req.body.list || "Today");
  const name = req.body.newItem.trim();
  if (name) {
    const item = new Item({ name, list });
    await item.save();
  }
  if (list === "Work") {
    res.redirect("/work");
  } else {
    res.redirect("/");
  }
});

app.post("/delete", async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.body.checkbox);
    res.redirect("/");
  } catch (err) {
    res.status(500).send("Error deleting item");
  }
});

app.get("/work", async (req, res) => {
  const items = await Item.find({ list: "Work" });
  res.render("list", { listTitle: "Work", newListItems: items });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
