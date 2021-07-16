const express = require("express");

const app = express();

var items = [];

app.set("view engine", "ejs");

app.use(express.urlencoded({extended: true}));


app.get("/", (req, res) => {

  var today = new Date();
  var day = "";

  var options = { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  };

  var day = today.toLocaleDateString("en-US", options);

  res.render("list", {
    kindOfDay: day,
    newListItem: items,
  });
});


app.post("/", (req, res) => {
  var item = req.body.newItem;
  items.push(item);
})

app.listen(3000, () => {
  console.log("Server started on port 3000");
})