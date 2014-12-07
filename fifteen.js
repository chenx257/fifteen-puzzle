//    CSE154 Web Programming
//    Instructor: Allison Obourn
//    TA Section AO: Joshua Rasmusse
//    Student: Zhihong Cheng
//    My homework assignment #8
//      
//  javascript for a 15 puzzle game
//  Extra feature:
//  1. End of Game Notification
//  2. Game Timer

"use strict";

(function() {
    // remember the empty puzzle position as module global variable
    var emptyX = 300;
    var emptyY = 300;
    // set a module global variable for shuffleTimes
    var shuffleTimes = 1000;
    // checked point: if not shuffled, does not count as winning the game
    var isShuffled = false;
    // remember start time and count move number, also remember the best result: 
    // shortest time and fewest move
    var startTime = 0;
    var moveNumber = 0;
    var fewestMove = null;
    var fastest = null;

    window.onload = function() {
        // function call to create 15 puzzles
        createPuzzle();
        // attach event listenners to each puzzles
        var puzzles = document.querySelectorAll(".puzzle");
        for (var i = 0; i < puzzles.length; i++) {
            // link move function to "click" event
            puzzles[i].onclick = move;
            // link highLight funciton to "mouseover" event
            puzzles[i].onmouseover = highLight;
            // link backToNormal function to "mouseout" event
            puzzles[i].onmouseout = backToNormal;
        }
        // attach shuffle function to "shuffle" button
        var shufflebutton = document.querySelector("#shufflebutton");
        shufflebutton.onclick = shuffle;
    };
    // function to create puzzles
    function createPuzzle() {
        var puzzlearea = document.getElementById("puzzlearea");
        puzzlearea.innerHTML = "";
        // create 15 puzzles
        var sortedPuzzlePosition = sortedPuzzle();
        for (var i = 0; i < 15; i++) {
            // create element "div" and assign className "puzzle"
            var puzzle = document.createElement("div");
            puzzle.className = "puzzle";
            // set the X and Y position of each puzzle
            var puzzle_positionY = sortedPuzzlePosition[i][1];
            var puzzle_positionX = sortedPuzzlePosition[i][0];
            // set the puzzle location
            puzzle.style.top = puzzle_positionY + "px";
            puzzle.style.left = puzzle_positionX + "px";
            // assign the i as its value shown on the puzzle
            puzzle.innerHTML = i + 1;
            // assign the background image
            puzzle.style.backgroundImage = "url(background.jpg)";
            // calculate the offset X and Y for its background image, and set the image position
            var bg_positionX = -puzzle_positionX;
            var bg_positionY = -puzzle_positionY;
            puzzle.style.backgroundPosition = bg_positionX + "px " + bg_positionY + "px";
            // inject the puzzle element to html
            puzzlearea.appendChild(puzzle);
        }
    }
    // move a puzzle if it is movable
    function move() {
        if (isMovable(this)) {
            moveNumber++;
            swapWithEmpty(this);
        }

    }
    // swap the puzzle to the empty space
    function swapWithEmpty(item) {
        // get the position of the element to be moved
        var positionX = parseInt(window.getComputedStyle(item).left);
        var positionY = parseInt(window.getComputedStyle(item).top);
        // put the puzzle to the empty space
        item.style.position = "absolute";
        item.style.left = emptyX + "px";
        item.style.top = emptyY + "px";
        // update the empty position
        emptyX = positionX;
        emptyY = positionY;
        // when the empty puzzle is at the right place, call winOrLose to check other puzzles
        if (emptyX === 300 && emptyY === 300 && isShuffled) {
            winOrLose();
        }
    }
    // check whether the puzzles are in a sorted order
    function winOrLose() {
        var isSorted = true;
        // get the position of sorted puzzles
        var sortedPuzzlePosition = sortedPuzzle();
        var puzzles = document.querySelectorAll(".puzzle");
        for (var j = 0; j < puzzles.length; j++) {
            // get the current positions of each puzzle
            var actualPositionX = parseInt(window.getComputedStyle(puzzles[j]).left);
            var actualPositionY = parseInt(window.getComputedStyle(puzzles[j]).top);
            // get the puzzle number, adjust to 0-based array
            var puzzleNumber = parseInt(puzzles[j].innerHTML) - 1;
            // get the x and y value if the puzzle is in the sorted order
            var thisPuzzleX = sortedPuzzlePosition[puzzleNumber][0];
            var thisPuzzleY = sortedPuzzlePosition[puzzleNumber][1];
            // if the puzzle is not in the order, set isSorted to be false
            if (actualPositionX !== thisPuzzleX || actualPositionY !== thisPuzzleY) {
                isSorted = false;
            }
        }
        // if all puzzle is in the sorted order
        if (isSorted) {
            // propare for congratulations
            var message = document.getElementById("output");
            message.innerHTML = "";
            // get the time point the user solved the puzzle
            var endTime = new Date();
            // calculate the time (seconds) used to solve the puzzle game
            var timeUsed = (endTime - startTime) / 1000;
            // update the best play with shortest time and fewest move
            if (fastest === null || timeUsed < fastest) {
                fastest = timeUsed;
            }
            if (fewestMove === null || moveNumber < fewestMove) {
                fewestMove = moveNumber;
            }
            // setup the message to congrate the player with record (time and move)
            var congrat = document.createElement("p");
            congrat.innerHTML = "Congratulations! You finally made it!";
            message.appendChild(congrat);
            var gameStats = document.createElement("p");
            gameStats.innerHTML = "You spent " + timeUsed + " seconds (best " + fastest +
                    ") and " + moveNumber + " moves (best " + fewestMove + ")";
            message.appendChild(gameStats);

        }
    }
    // function to get an array which hold x and y for each puzzle in the sorted order
    function sortedPuzzle() {
        var output = [];
        for (var i = 1; i <= 15; i++) {
            // calculate row and column from the puzzle number
            var row = Math.ceil(i / 4);
            var column = i % 4 === 0 ? 4 : i % 4;
            // calculate the x and y position of each puzzle from its row/column number
            var puzzle_positionY = (row - 1) * 100;
            var puzzle_positionX = (column - 1) * 100;
            // assign the x and y to each puzzle in the array
            output[i - 1] = [puzzle_positionX, puzzle_positionY];
        }
        return output;
    }
    // check whether the element is movalbe, it can be moved if it neighbors around the empty space
    function isMovable(item) {
        // get the element's position
        var positionX = parseInt(window.getComputedStyle(item).left);
        var positionY = parseInt(window.getComputedStyle(item).top);
        // if it is in the same row as the empty space
        if (positionX === emptyX) {
            if (positionY === (emptyY - 100) || positionY === (emptyY + 100)) {
                return true;
            }
        } else if (positionY === emptyY) { // it it is in the same column as the mepty space
            if (positionX === (emptyX - 100) || positionX === (emptyX + 100)) {
                return true;
            }
        } else {
            return false;

        }
    }
    // add a class name "highlight" to this element
    function highLight() {
        if (isMovable(this)) {
            if (!this.classList.contains("highlight")) {
                this.classList.add("highlight");
            }
        }
    }
    // remove the class name "highlight" from this element
    function backToNormal() {
        if (this.classList.contains("highlight")) {
            this.classList.remove("highlight");
        }
    }
    // shuffle the puzzle
    function shuffle() {
        for (var i = 1; i <= shuffleTimes; i++) {
            var neighbors = [];
            // get all puzzles
            var puzzles = document.querySelectorAll(".puzzle");
            // check each puzzle if it is movable, if so, put it into an collection of puzzle
            for (var j = 0; j < puzzles.length; j++) {
                if (isMovable(puzzles[j])) {
                    neighbors.push(puzzles[j]);
                }
            }
            // pick a random puzzle from the puzzle collection, and swap the picked puzzle with
            // the empty space by calling the swap function
            var randomIndex = Math.floor(Math.random() * neighbors.length);
            swapWithEmpty(neighbors[randomIndex]);
        }
        // after shuffle, remember the start time
        startTime = new Date();
        // reset the move number to 0
        moveNumber = 0;
        isShuffled = true;

    }

})();

