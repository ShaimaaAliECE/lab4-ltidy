//get the express package
const express = require('express');
//create the express app instance
const app = express();

//get file
let questions = require('./src/questions.json'); 

const port = 80; 
const server = `http://localhost:${port}`;
app.listen(port, ()=> console.log(`Server started. Running at: ${server}`));



//get frontend
app.use(express.static('./src/frontend'));

//get questions
app.get('/questions', (req, res) => {
    res.json(questions);
});


//get feedback for the question
app.get("/feedback", (req, res) => {
    let msg = "Incorrect" + req.query.id;
    let questionID = 0;
    for (question of questions){
        if(req.query.id == questionID && req.query.value == question.answerIndex) {
            msg = "Correct" + req.query.id;
        }
        questionID++;
    }
    res.send(msg);
});