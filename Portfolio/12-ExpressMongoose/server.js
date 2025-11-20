const express = require("express");
const app = express();
const mongoose = require("mongoose");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.engine("ejs", require("ejs").renderFile);
app.set("view engine", "ejs");

const mongoUrl = "mongodb://127.0.0.1:27017/f1";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

// Definition of a schema
const teamSchema = new mongoose.Schema({
  id: Number,
  name: String,
  nationality: String,
  url: String,
});
teamSchema.set("strictQuery", true);

const driverSchema = new mongoose.Schema({
  num: Number,
  code: String,
  forename: String,
  surname: String,
  dob: Date,
  nationality: String,
  url: String,
  team: teamSchema,
});
driverSchema.set("strictQuery", true);

const Team = mongoose.model("Team", teamSchema);
const Driver = mongoose.model("Driver", driverSchema);

let countries = [
  { code: "ENG", label: "England" },
  { code: "SPA", label: "Spain" },
  { code: "GER", label: "Germany" },
  { code: "FRA", label: "France" },
  { code: "MEX", label: "Mexico" },
  { code: "AUS", label: "Australia" },
  { code: "FIN", label: "Finland" },
  { code: "NET", label: "Netherlands" },
  { code: "CAN", label: "Canada" },
  { code: "MON", label: "Monaco" },
  { code: "THA", label: "Thailand" },
  { code: "JAP", label: "Japan" },
  { code: "CHI", label: "China" },
  { code: "USA", label: "USA" },
  { code: "DEN", label: "Denmark" },
];


// Helper: parse CSV
const fs = require('fs');
const path = require('path');
const csvPath = path.join(__dirname, 'public/data/f1_2023.csv');
const parseCsv = (csv) => {
  const lines = csv.trim().split('\n');
  const headers = lines[0].split(',');
  return lines.slice(1).map(line => {
    const obj = {};
    line.split(',').forEach((val, i) => {
      obj[headers[i]] = val;
    });
    return obj;
  });
};

// Middleware: load CSV to DB if empty
async function loadCsvIfNeeded(req, res, next) {
  const count = await Driver.countDocuments();
  if (count === 0) {
    const csv = fs.readFileSync(csvPath, 'utf8');
    const rows = parseCsv(csv);
    for (const row of rows) {
      // Find or create team
      let team = null;
      if (row.current_team && row.current_team !== 'N/A') {
        team = await Team.findOneAndUpdate(
          { name: row.current_team },
          { name: row.current_team },
          { upsert: true, new: true }
        );
      }
      await Driver.create({
        num: row.number,
        code: row.code,
        forename: row.forename,
        surname: row.surname,
        dob: new Date(row.dob.split('/').reverse().join('-')),
        nationality: row.nationality,
        url: row.url,
        team: team
      });
    }
  }
  next();
}

// Helper: get nations and teams for selects
async function getFormData() {
  const teams = (await Team.find()).map(t => ({ value: t.name, label: t.name }));
  const nations = [...new Set((await Driver.find()).map(d => d.nationality))].map(n => ({ value: n, label: n }));
  return { teams, nations };
}

// Home route: show form and list
app.get("/", loadCsvIfNeeded, async (req, res) => {
  const drivers = await Driver.find();
  const { teams, nations } = await getFormData();
  res.render("index", { drivers, teams, nations, driver: null, editId: null });
});

// Add driver
app.get("/driver", async (req, res) => {
  const { num, code, name, lname, dob, url, nation, team } = req.query;
  let teamObj = team ? await Team.findOne({ name: team }) : null;
  if (!teamObj && team) teamObj = await Team.create({ name: team });
  await Driver.create({
    num, code, forename: name, surname: lname, dob, url, nationality: nation, team: teamObj
  });
  res.redirect("/");
});

// Edit driver (show form)
app.get("/driver/edit/:id", loadCsvIfNeeded, async (req, res) => {
  const drivers = await Driver.find();
  const driver = await Driver.findById(req.params.id);
  const { teams, nations } = await getFormData();
  res.render("index", { drivers, teams, nations, driver, editId: req.params.id });
});

// Edit driver (save)
app.post("/driver/edit/:id", async (req, res) => {
  const { num, code, name, lname, dob, url, nation, team } = req.body;
  let teamObj = team ? await Team.findOne({ name: team }) : null;
  if (!teamObj && team) teamObj = await Team.create({ name: team });
  await Driver.findByIdAndUpdate(req.params.id, {
    num, code, forename: name, surname: lname, dob, url, nationality: nation, team: teamObj
  });
  res.redirect("/");
});

// Delete driver
app.post("/driver/delete/:id", async (req, res) => {
  await Driver.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

// Toggle: list by drivers or teams
app.get("/toggle", loadCsvIfNeeded, async (req, res) => {
  const { view } = req.query;
  if (view === 'teams') {
    const teams = await Team.find();
    res.render("teams", { teams });
  } else {
    res.redirect("/");
  }
});

app.listen(3000, (err) => {
  console.log("Listening on port 3000");
});
