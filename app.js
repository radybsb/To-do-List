const { render } = require("ejs");
const express = require("express");
const mongoose = require('mongoose');
const date = require(__dirname + "/date.js");
const _ = require("lodash");

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/toDoListDB', {useNewUrlParser: true, useUnifiedTopology: true});

// Make Mongoose use `findOneAndUpdate()
mongoose.set('useFindAndModify', false);


// getting the current date ins a const

const day = date.getDate();

// Setting the items database

const itemsSchema = {
  name: String
};

const Item = mongoose.model('Item', itemsSchema);


// Setting the lists database

const listSchema = {
  name: String,
  items: [itemsSchema]
}

const List = mongoose.model("List", listSchema);


// Main page request
app.get("/", (req, res) => {
  Item.find({}, (err, mongoItems) => {
    List.find({}, (err, lists) => {
      res.render("list", {
        title: day,
        listTitle: "Daily List",
        newListItems: mongoItems,
        listsArray: lists,
      });
    });
  });
});

// Adding a new item into a list
app.post("/", (req, res) => {
  const item = req.body.newItem;
  const listName = req.body.list;

  const newInput = new Item({name: item});

  if(listName === "Daily List") {
    newInput.save();
    res.redirect("/");
  } else {
    List.findOne({name: listName}, (err, docs) => {
      docs.items.push(newInput);
      docs.save();
      res.redirect("/lists/" + listName);
    });
  }
});

// Delete item from a list
app.post("/delete", (req, res) => {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if(listName === "Daily List"){
    Item.findByIdAndDelete(checkedItemId, (err) => {});
    res.redirect("/");
  } else {

    List.findOneAndUpdate({name: listName}, 
      {$pull: {items: {_id: checkedItemId}}},
      (err, results) => {});

    res.redirect("/lists/" + listName);
  }
});


// Add a new list
app.post("/new", (req, res) => {
  const newListAdded = req.body.newList;
  res.redirect("/lists/" + newListAdded);
});

// Delete a list
app.post("/delete-list", (req, res) => {
  const listDeleted = req.body.delete;
  List.findOneAndDelete({name: listDeleted}, (err, doc) => {});
  res.redirect("/");
});


// Getting the list's page
app.get("/lists/:listName", (req, res) => {
  const listName = _.capitalize(req.params.listName);

  List.findOne({name: listName}, (err, docs) => {
    
    if(!err) {
      if(docs != null) {
        List.find({}, (err, lists) => {
          res.render("list", {
            title: day,
            listTitle: listName,
            newListItems: docs.items,
            listsArray: lists,
          });
        });

      } else {
        const newList = new List({
          name: listName,
          items: []
        });
        newList.save();

        setTimeout(() => {
          res.redirect("/lists/" + listName);
        }, 100);
      }
    }   
  });
});


// about page
app.get("/about", (req, res) => {
  res.render("about");
});

// listen
app.listen(3000, () => {
  console.log("Server started on port 3000");
})