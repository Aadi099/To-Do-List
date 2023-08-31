const express=require("express");
const bodyParser=require("body-parser");
// const date=require(__dirname+"/date.js"); we will not use it right now 
const mongoose=require("mongoose");
const _=require("lodash");
const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public")); // we are doing this to exceess the static file which are present 

app.set('view engine','ejs');// it's just saying app to use ejs as view enging 
app.set('views', 'view'); // i have add this bec by mistake i have wrote the name of file view it's should be views

//now we will use mangooes to store this data
// var items=["Morning DSA","Take nap","AfterNoon web-d"]; // This are pre giving data 
// let workItems=[];

// this is how we connect to local host of mongodb
// mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlparser:true});
//this is how we connect to mongog atalas 
const uri="mongodb+srv://url to connect to mongodb/";
 mongoose.connect(uri, {useNewUrlParser: true, dbName: "todolistDB"});
// creating schema 
const itemsSchema=new mongoose.Schema({
  name:String
})


// creating model
const Item = mongoose.model("Item", itemsSchema);

// now let's creat items
const item1=new Item({
  name:"Welcome toTodoList"
})
const item2=new Item({
  name:"Let's start day with Gym"
})
const item3=new Item({
  name:"Time for Leetcode"
})

const defaultItems=[item1,item2,item3];

const listSchema={
  name:String,
  items:[itemsSchema]
}

const List=mongoose.model("List",listSchema);



//One way of inserting is this data in mongoose 

//PROMISES in brief(If something is wrong please correct me):
//In JS, programmers encountered a problem called "callback hell", where syntax of callbacks were cumbersome & often lead to more problems.
//So in effort to make it easy PROMISES were invented.
//to learn more about promise visit : https://javascript.info/promise-basics
//Or https://www.youtube.com/watch?v=novBIqZh4Bk
 //but the proble here is that whenver we will run our app.js than data will be save again and again so to prevent this we will check inside .find() is the data is already uploded or not if not than uplod it 
// Item.insertMany(defaultItems)
//   .then(function(){
//     console.log("Successfully saved into our DB.");
//   })
//   .catch(function(err){
//     console.log(err);
//   })

//another way of inserting data in mongoose
// Creating a function to insert default items (In this approach, we define an asynchronous function insertDefaultItems using the async keyword. Within the function, we use the await keyword to wait for the Item.insertMany operation to complete. If any error occurs, it is caught in the catch block, where the error is logged to the console. Otherwise, if the insertion is successful, the message "Items added to DB" is logged.)
// const insertDefaultItems = async () => {
//   try {
//     await Item.insertMany(defaultItems);
//     console.log('Items added to DB');
//   } catch (error) {
//     console.log(error);
//   }
// };

// // Call the function to insert the default items
// insertDefaultItems();






       app.get("/", function(req, res) {


  //now let's just ignore it for sometime so that we can easily use mangooes so we are going to commenting out  let day=date.getDate();
   //let day=date.getDate(); // we are using parthenese'()' here bec we want to active function here not inside date.js that's why we haven't use '()' in module.export=getDate; 
   //let day=date.getDay(); the date module is exporting two function this is the way to use second function 
       // now we will send data to list.ejs using res.render()

        Item.find({}).then(function(foundItems) {
          if (foundItems.length === 0) {
            Item.insertMany(defaultItems)
              .then(function() {
                console.log("Successfully saved into our DB.");
                res.redirect("/");
              })
              .catch(function(err) {
                console.log(err);
                // Handle the error accordingly
              });

              res.redirect("/");
          } else {
            res.render("list", { listTitle: "Today", newListItems: foundItems });
         }
        }).catch(function(err) {
          console.log(err);
          // Handle the error accordingly
        });
      });
      


app.post("/",function(req,res){
  // console.log(req.body); newItem: 'DSA before sleeping', list: 'Work'  so we can use list to add item to wrokItems or items depned on which page we have work 
  // we are doing everything here bec once we prees the submit button (or we can say add new item) it will take action send it to "/" method="post"(basic things as you know)
// let item=req.body.newItem;
// if(req.body.list==="Work"){
//   workItems.push(item);
//   res.redirect("/work");
// }else{
//   items.push(item);
//   res.redirect("/");
// }
// now due to this we will have to seprate list now onw normal to-dolist at localhost:3000 and one work to-do-list at localhost:3000/work


//let's add new items using mongooes => as we click + on the webpage it will trigger the post requestwe will try to capture the value which have be written by the user and try to insert in to collection of DB and redirect to homeroute
const itemName=req.body.newItem; //req.body.(whatever is the name of the input use it)
const listName=req.body.list;
const item=new Item({
  name:itemName
})
if(listName==="Today"){
  item.save(); // once the item is save in collection Items than all you have to do is to redirect to homeroute "/" and res.render ejs file
  res.redirect("/");
}else{
  List.findOne({name:listName})
  .then(function(foundList){
    foundList.items.push(item);
    foundList.save();
    res.redirect("/"+ listName);
  })
}

})

app.post("/delete", async function(req, res) {
  const checkedItem = req.body.checkbox;
  const listName=req.body.listName;
  if(listName==="Today"){
    Item.deleteOne({ _id: checkedItem })
    .then(() => {
      res.redirect("/");
    })
    .catch(err => {
      console.error("Error deleting item:", err);
      res.redirect("/");
    });
  } else {
    await List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItem } } }
    );
    res.redirect("/" + listName);
  }

});

app.get("/:customListName", function (req, res) {
  const customListName = _.capitalize(req.params.customListName);
 
  List.findOne({ name: customListName })
    .then(function (foundList) {
      if (!foundList) {
        //if not found that one 
        const list = new List({
          name: customListName,
          items: defaultItems,
        });
        list.save();
        res.redirect("/" + customListName);
      } else {
         // we will simplly render list.ejs 
        res.render("list", {    listTitle: foundList.name,newListItems: foundList.items });
      }
    })
    .catch(function (err) {
      console.log(err);
    });
});
//we will now use dynamic route 
//now let just target localhost:3000/work "/work" we are targeting the /work route 
// app.get("/work",function(req,res){
//   res.render("list",{listTitle:"Work List",newlistitem:workItems}); //now it will not send the day in Title institede of that it willl start sending Work List as a title and new array workItem to store work list
//   //but the proble is if we press the button than it will add to the "/" not on "/work" to deal with it in submit button (inside list.ejs)we will play with value we will keep value as ejs(<%= listTitle%>) so what it will do it will save item of work list we can check it by console.log()
//   //now let's add a condition to "/" to save item to workList if it's was written one localhost:3000/work than it's save to workList 
// })
// now we will make post request for "/work" list 
app.post("/work",function(req,res){
  
  let item=req.body.newItem
  workItems.push(item);
  res.redirect("/work");
})



app.listen("3000",function(){
    console.log("The port 3000 is working");
});

