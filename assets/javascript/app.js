var dropDownPick;
var dropDownAmount = "";
var dropDownName = "";
var Right = 0;
var Wrong = 0;
var counter;
var Timer;
var questLeft;
var index = -1;
function startTheClock() {

    clearInterval(Timer);
    var timeleft = 2;
    $("#timerDiv").html("");
    Timer = setInterval(function () {
        timeleft--;
        $("#timerDiv p").html(timeleft);
        if (timeleft === 0){
            Wrong++;
            console.log(Wrong);
            console.log(questLeft);
            questLeft--;
            clearInterval(Timer);
            $("#statDiv").html(`<div class="card" style = "width: 90%">
                            <div class="card-body">
                            <h3 class="card-title">Stats</h3>
                            <p class="card-text">Right: ${Right}<br>
                                                 Wrong: ${Wrong}<br>
                                                 Questions Left: ${questLeft - 1}</p>`)

        }
    }, 1000);
}


$.ajax({
    url: "http://opentdb.com/api_category.php",
    method: "GET"
}).then(function (response) {
    for (var i = 0; i < response.trivia_categories.length; i++) {
        var id = response.trivia_categories[i].id;
        var cat = response.trivia_categories[i].name;
        $("#categoryDropDown").append("<div class= 'dropdown-item dropCat' id ='" + id + " " + name + "'>" + cat + "</div>")
    }
    $(document).on("click", ".dropdown-item.dropCat", function () {
        dropDownPick = this.id;
        dropDownName = this.textContent;


        $("#navbarDropdownCat").html(dropDownName);


        if ((dropDownAmount !== "") &&
            (dropDownName !== "")) {
            $("#goBtn").css({
                "visibility": "visible"
            });
        }
    })
    $(".dropdown-item.dropQuest").click(function () {
        dropDownAmount = this.id;
        $("#navbarDropdownQuest").html(`${dropDownAmount} Questions`);

        if ((dropDownAmount !== "") &&
            (dropDownName !== "")) {
            $("#goBtn").css({
                "visibility": "visible"
            });
        }
    })

    $("#goBtn").click(function () {
        $.ajax({
            url: `https://opentdb.com/api.php?amount=${dropDownAmount}&category=${dropDownPick}`,
            method: "GET"
        }).then(function (response) {
            //questLeft based on how many questions selected.
            questLeft = parseInt(dropDownAmount);
            console.log(questLeft);
            getNextQuestion();
            $(".jumbotron").slideUp("slow");
            $("#goBtn").fadeOut(2600);

            function getNextQuestion() {
                startTheClock();
                index++;

                var randAnswers = [];
                var answers = [];
                //adds incorrect answers to answers array
                for (var i = 0; i < response.results[index].incorrect_answers.length; i++) {
                    answers.push(response.results[index].incorrect_answers[i]);
                }

                //adds correct answer to answers array
                answers.push(response.results[index].correct_answer);
                //randomizes the answers into randAnswers array
                while (answers.length !== 0) {
                    for (var j = 0; j < answers.length; j++) {
                        randNum = Math.floor(Math.random() * answers.length)
                        randAnswers.push(answers[randNum]);
                        answers.splice(randNum, 1);
                    }
                }
                //create a questions div with the corresponding answers.
                $("#QuestDiv").html(`<div class= "card" style="width: 90%">
                        <div class="card-body">
                        <h3 class="card-title">Question # ${parseInt(dropDownAmount) - questLeft}</h3>
                        <p class="card-text">${response.results[index].question}
                        <p>`)
                // places possible answers on div   
                for (var i = 0; i < randAnswers.length; i++) {
                    $("#QuestDiv .card-text").append(
                        `<div class="form-check">
                                    <input class="form-check-input"                 type="radio" name="AnswerSelections" id="${randAnswers[i]}" + value="option${i}">
                            <label class="form-check-label" for="AnswerSelection${i}">
                            ${randAnswers[i]}
                            </label>
                        </div>`)
                }
                //create a div with the stats
                $("#statDiv").html(`<div class="card" style = "width: 90%>
                        <div class="card-body">
                        <h3 class="card-title">Stats</h3>
                        <p class="card-text">Right: ${Right}<br>
                                            Wrong: ${Wrong}<br>
                                            Questions Left: ${questLeft - 1}</p>`)
                //create a div with a timer that starts automatically based on the amount of questions
                $("#timerDiv").html(`<div class="card" style = "width: 90%>
                    <div class="card-body">
                    <h3 class="card-title">Beat the Clock!</h3>
                    <p class="card-text"></p>`)

                //on"click" if true, log that, if false, log that and replace that div with the next question.
                $(".form-check-input").click(function () {
                    if (this.id === response.results[index].correct_answer) {
                        Right++;

                        $("#statDiv").html(`<div class="card" style = "width: 90%">
                        <div class="card-body">
                        <h3 class="card-title">Stats</h3>
                        <p class="card-text">Right: ${Right}<br>
                                             Wrong: ${Wrong}<br>
                                             Questions Left: ${questLeft - 1}</p>`)
                        questLeft--;
                        if (questLeft !== 0) {
                            getNextQuestion();
                        } else {
                            $("#statDiv").slideUp();
                            $("#QuestDiv").slideUp();
                            $("#timerDiv").slideUp();
                            $(".jumbotron").slideDown();
                            $("#navbarDropdownCat").html("Pick a Category");
                            dropDownPick = "";
                            $(document).on("click", ".dropdown-item.dropCat", function () {
                                dropDownPick = this.id;
                                dropDownName = this.textContent;


                                $("#navbarDropdownCat").html(dropDownName);

                                console.log(dropDownPick);
                                console.log(dropDownAmount);
                                console.log(dropDownName);
                                if ((dropDownAmount !== "") &&
                                    (dropDownName !== "")) {
                                    $("#goBtn").css({
                                        "visibility": "visible"
                                    });
                                }
                            })
                            $("#navbarDropdownQuest").html(`Choose Question Amount`);
                            dropDownAmount = "";
                            $(".dropdown-item.dropQuest").click(function () {
                                dropDownAmount = this.id;
                                $("#navbarDropdownQuest").html(`${dropDownAmount} Questions`);
                                console.log(dropDownPick);
                                console.log(dropDownAmount);
                                console.log(dropDownName);
                                if ((dropDownAmount !== "") &&
                                    (dropDownName !== "")) {
                                    $("#goBtn").css({
                                        "visibility": "visible"
                                    });
                                }
                            })


                        }
                    } else {
                        Wrong++;

                        $("#statDiv").html(`<div class="card" style = "width: 90%">
                            <div class="card-body">
                            <h3 class="card-title">Stats</h3>
                            <p class="card-text">Right: ${Right}<br>
                                                 Wrong: ${Wrong}<br>
                                                 Questions Left: ${questLeft - 1}</p>`)
                        questLeft--;
                        if (questLeft !== 0) {
                            getNextQuestion();
                        } else {
                            $("#statDiv").slideUp();
                            $("#QuestDiv").slideUp();
                            $("#timerDiv").slideUp();
                            $(".jumbotron").slideDown();
                            $("#navbarDropdownCat").html("Pick a Category");
                            dropDownPick = "";
                            $(document).on("click", ".dropdown-item.dropCat", function () {
                                dropDownPick = this.id;
                                dropDownName = this.textContent;


                                $("#navbarDropdownCat").html(dropDownName);


                                if ((dropDownAmount !== "") &&
                                    (dropDownName !== "")) {
                                    $("#goBtn").fadeIn(2600);
                                }
                            })
                            $("#navbarDropdownQuest").html(`Choose Question Amount`);
                            dropDownAmount = "";
                            $(".dropdown-item.dropQuest").click(function () {
                                dropDownAmount = this.id;
                                $("#navbarDropdownQuest").html(`${dropDownAmount} Questions`);

                                if ((dropDownAmount !== "") &&
                                    (dropDownName !== "")) {
                                    $("#goBtn").fadeIn(2600);
                                }
                            })

                        }
                    }

                })
            }


        })
    })

})