//questions get loaded when the page opens
populateQuestions();

//fill in the questions by getting data from the JSON file
function populateQuestions() {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "/questions", true);
  xhr.send();
  //on the state change fill in questions 
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      let question_block = document.getElementById("question_block");
      let qBank = JSON.parse(xhr.responseText);
      //make empty page
      let page = "";
      //make question id
      let q_id = 0;
      //display grade 
      page += "<div id='grade'></div>";
      //wrap questions 
      page += `<form action=javascript:submitTest()>`;
      for (question of qBank) {
        // make question value
        let q_val = 0;
        //fill label in with question
        page += `<label class='question_text' id = ${q_id} value = "incorrect">${question.stem}</label>`;

        //fill option of the question
        for (option of question.options) {
          //list the options with ul and radio buttons
          page += `<ul><input type="radio" onclick='javascript:provideFeedback(${q_val}, ${q_id})' id = ${q_id}${q_val} name=${q_id} value= ${q_val}>`;
          page += `<label for="${option}">${option}</label></ul>`;
          q_val++;
        }
        q_id++;
      }
      page += `<br><input type="submit" value="submit" id="submit" >`;
      page += "</form>";
      
      question_block.innerHTML = page;
    }
  };
  // handler for errors
  xhr.error = () => {
    console.log("Error, question could not be retrieved");
  };
}

//feedback given when radio button is selected
function provideFeedback(value, id) {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "/feedback?value=" + value + "&id=" + id, true);
  xhr.send();
  //check if the question is correcrt on state change
  xhr.onreadystatechange = () => {
    //make empty alert window
    let alert_page = "";
    let id = "";
    if (xhr.readyState == 4 && xhr.status == 200) {
      if (xhr.responseText.substring(0, 7) == "Correct") {
        alert_page = "You answered correctly";
        id = xhr.responseText.substring(8, xhr.responseText.length - 1);
        document.getElementById(id).setAttribute("value", "Correct");
      } else {
        alert_page = "You answered incorrectly";
        id = xhr.responseText.substring(10, xhr.responseText.length - 1);
        document.getElementById(id).setAttribute("value", "Incorrect");
      }
      alert(alert_page);
    }
  };
  // handler for errors
  xhr.error = () => {
    console.log("Error, could not retrieve feedback");
  };
}

//submit the test to check if its correct and then display the grade
function submitTest() {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "/questions", true);
  xhr.send();
  //display the users grade on the state change
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      let qBank = JSON.parse(xhr.responseText);
      //reference the grade section
      let grade = document.getElementById("grade");
      let total = 0; // tracking number of questions
      let correct_count = 0; // tracking number of correct questions
      //iterate through the questions and check to see if they're correct
      for (question of qBank) {
        if (document.getElementById(total).getAttribute("value") == "Correct") {
          correct_count++;
        }
        //count total questions
        total++;
      }
      //display grade to the user
      grade.innerHTML =
        "You answered " +
        correct_count +
        "/" +
        total +
        " questions correctly. (" +
        100 * (correct_count / total) +
        "%)";
    }
  };
  //handler for errore
  xhr.error = () => {
    console.log("Error, could not retrieve grade");
  };
}