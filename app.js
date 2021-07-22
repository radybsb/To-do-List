const { render } = require("ejs");
const express = require("express");
const date = require(__dirname + "/date.js");

const app = express();

const items = [];
const workItems = [];

app.set("view engine", "ejs");

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/", (req, res) => {

  day = date.getDate();
  res.render("list", {
    title: day,
    listTitle: "Daily List",
    newListItems: items,
  });
});

app.post("/", (req, res) => {
  const item = req.body.newItem;

  if(req.body.list === "Work"){
    workItems.push(item);
    res.redirect("/work");

  }else{
    items.push(item);
    res.redirect("/");
  } 
  
});

app.get("/work", (req, res) => {
  res.render("list", {
    title: day,
    listTitle: "Work List",
    newListItems: workItems,
  });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
})