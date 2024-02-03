const express = require("express");
const app = express();
const router = express.Router();
const mongoose = require("mongoose");
const Question = require("./model/question");
const methodOverride = require("method-override");
const MONGO_URL = "mongodb://127.0.0.1:27017/Questions";
const path = require("path");


const bodyParser = require("body-parser");


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


main()
  .then(() => {
    console.log(" connected with DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}
app.use(express.static(path.join(__dirname, "/public")));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.send("root is working");
});


//read
app.get("/questions", async (req, res) => {
  const allQuestions = await Question.find({});
  res.render("show.ejs", { allQuestions });
  //   console.log(allQuestions);
});


//create
router.get("/newQuestion", (req, res) => {
  res.render("new.ejs");
});

app.post("/newQuestion", async (req, res) => {
  try {
    const { question, answer, type } = req.body;
    const newQuestion = new Question({ question, answer, type });
    await newQuestion.save();
    //console.log(newQuestion)
    res.redirect("/questions");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating question");
  }
});


//update
router.get("/questions/:id/edit", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    res.render("edit.ejs", { question });
  } catch (error) {
    console.error( error);
    res.status(500).send("Error fetching question for editing");
  }
});

router.post("/questions/:id/edit", async (req, res) => {
  try {
    const { question, answer, type } = req.body;
    await Question.findByIdAndUpdate(req.params.id, { question, answer, type });
    res.redirect("/questions");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating question");
  }
});


//delete
app.use(methodOverride("_method"));
app.delete("/questions/:id", async (req, res) => {
  try {
    const { id } = req.params;
        await Question.findByIdAndDelete(id);  
    res.redirect("/questions");
  } catch (error) { 
    console.error(error);
    res.status(500).send("Error deleting question");
  }
});

app.use("/", router);

app.listen(3000, () => {
  console.log("Server started");
});
