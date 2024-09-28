//WEBSOCKET

let ws = new WebSocket("wss://human-echoes-f0fe8c05475c.herokuapp.com:443");

let controlledByTD = document.querySelector(".controlledByTD");

let controlTD = document.querySelector(".controllTD");

let button = document.getElementById("myButton");

let buttonClickCount = 0;

controlTD.addEventListener("input", (event) => {
  ws.send(JSON.stringify({ "slider1:": controlTD.value / 100 }));
});

button.addEventListener("click", handleClick);

ws.addEventListener("open", (event) => {
  console.log("websocket opened");
});

ws.addEventListener("message", (message) => {
  if (message.data == "ping") {
    ws.send("pong");
    return;
  }

  let data = JSON.parse(message.data);
  if ("slider1" in data) {
    let val = data["slider1"];
    controlledByTD.value = val * 100;
  }

  console.log(data);
});

ws.addEventListener("error", (error) => {
  console.error("websocket closed");
});

ws.addEventListener("close", (event) => {
  console.log("websocket closed");
});

// JavaScript function to be executed when the button is clicked
function handleClick() {
  // Increment button click count
  buttonClickCount++;

  if (buttonClickCount >= 5) {
    buttonClickCount = 0;
  }
  // Display the count (you can replace this with any action you desire)
  alert("Button clicked " + buttonClickCount + " times");

  ws.send(JSON.stringify({ "buttonClickCount:": buttonClickCount }));
}

// CANDYCRUSH GAME
/* candycrush initialize */

var candies = ["geocoin", "geo1", "geo2", "geo3"];
var board = [];
var rows = 9;
var columns = 9;
var score = 0;

var currTile;
var otherTile;

window.onload = function () {
  startGame();

  //1/10th of a second
    gameInterval = window.setInterval(function () {
    crushCandy();
    slideCandy();
    generateCandy();
    checkGameEnd();
  }, 100);
};

function randomCandy() {
  return candies[Math.floor(Math.random() * candies.length)]; //0 - 5.99
}

function startGame() {
  for (let r = 0; r < rows; r++) {
    let row = [];
    for (let c = 0; c < columns; c++) {
      // <img id="0-0" src="./images/Red.png">
      let tile = document.createElement("img");
      tile.id = r.toString() + "-" + c.toString();
      tile.src = "./images/" + randomCandy() + ".png";

      //DRAG FUNCTIONALITY
      tile.addEventListener("dragstart", dragStart); //click on a candy, initialize drag process
      tile.addEventListener("dragover", dragOver); //clicking on candy, moving mouse to drag the candy
      tile.addEventListener("dragenter", dragEnter); //dragging candy onto another candy
      tile.addEventListener("dragleave", dragLeave); //leave candy over another candy
      tile.addEventListener("drop", dragDrop); //dropping a candy over another candy
      tile.addEventListener("dragend", dragEnd); //after drag process completed, we swap candies

      // Add touch event listeners for mobile
      tile.addEventListener("touchstart", dragStart);
      tile.addEventListener("touchmove", dragOver);
      tile.addEventListener("touchend", dragEnd);

      document.getElementById("board").append(tile);
      row.push(tile);
    }
    board.push(row);
  }

  console.log(board);
}

function dragStart() {
  //this refers to tile that was clicked on for dragging
  currTile = this;
}

function dragOver(e) {
  e.preventDefault();
}

function dragEnter(e) {
  e.preventDefault();
}

function dragLeave() {}

function dragDrop() {
  //this refers to the target tile that was dropped on
  otherTile = this;
}

function dragEnd() {
  if (currTile.src.includes("blank") || otherTile.src.includes("blank")) {
    return;
  }

  let currCoords = currTile.id.split("-"); // id="0-0" -> ["0", "0"]
  let r = parseInt(currCoords[0]);
  let c = parseInt(currCoords[1]);

  let otherCoords = otherTile.id.split("-");
  let r2 = parseInt(otherCoords[0]);
  let c2 = parseInt(otherCoords[1]);

  let moveLeft = c2 == c - 1 && r == r2;
  let moveRight = c2 == c + 1 && r == r2;

  let moveUp = r2 == r - 1 && c == c2;
  let moveDown = r2 == r + 1 && c == c2;

  let isAdjacent = moveLeft || moveRight || moveUp || moveDown;

  if (isAdjacent) {
    let currImg = currTile.src;
    let otherImg = otherTile.src;
    currTile.src = otherImg;
    otherTile.src = currImg;

    let validMove = checkValid();
    if (!validMove) {
      let currImg = currTile.src;
      let otherImg = otherTile.src;
      currTile.src = otherImg;
      otherTile.src = currImg;
    }
  }
}

function crushCandy() {
  //crushFive();
  //crushFour();
  crushThree();
  document.getElementById("score").innerText = score;
   // Adjust the background color progressively
    /*adjustBackgroundColor();*/
}

function crushThree() {
  //check rows
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns - 2; c++) {
      let candy1 = board[r][c];
      let candy2 = board[r][c + 1];
      let candy3 = board[r][c + 2];
      if (
        candy1.src == candy2.src &&
        candy2.src == candy3.src &&
        !candy1.src.includes("fire")
      ) {
        if (
          candy1.src.includes("geocoin") ||
          candy2.src.includes("geocoin") ||
          candy3.src.includes("geocoin")
        ) {
          score += 30;
          // Only score points if it's a Coin
          candy1.src = "./images/fire.png";
          candy2.src = "./images/fire.png";
          candy3.src = "./images/fire.png";
        } else {
          // Only score points if it's a Coin
          candy1.src = "./images/root.png";
          candy2.src = "./images/root.png";
          candy3.src = "./images/root.png";
        }
      }
    }
  }

  //check columns
  for (let c = 0; c < columns; c++) {
    for (let r = 0; r < rows - 2; r++) {
      let candy1 = board[r][c];
      let candy2 = board[r + 1][c];
      let candy3 = board[r + 2][c];
      if (
        candy1.src == candy2.src &&
        candy2.src == candy3.src &&
        !candy1.src.includes("fire")
      ) {
        if (
          candy1.src.includes("geocoin") ||
          candy2.src.includes("geocoin") ||
          candy3.src.includes("geocoin")
        ) {
          // Only score points if it's a Coin
          candy1.src = "./images/fire.png";
          candy2.src = "./images/fire.png";
          candy3.src = "./images/fire.png";
          
          score += 30;
          
        } else {
          // Only score points if it's a Coin
          candy1.src = "./images/root.png";
          candy2.src = "./images/root.png";
          candy3.src = "./images/root.png";
        }
      }
    }
  }
}

function checkValid() {
  //check rows
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns - 2; c++) {
      let candy1 = board[r][c];
      let candy2 = board[r][c + 1];
      let candy3 = board[r][c + 2];
      if (
        candy1.src == candy2.src &&
        candy2.src == candy3.src &&
        !candy1.src.includes("fire")
      ) {
        return true;
      }
    }
  }

  //check columns
  for (let c = 0; c < columns; c++) {
    for (let r = 0; r < rows - 2; r++) {
      let candy1 = board[r][c];
      let candy2 = board[r + 1][c];
      let candy3 = board[r + 2][c];
      if (
        candy1.src == candy2.src &&
        candy2.src == candy3.src &&
        !candy1.src.includes("fire")
      ) {
        return true;
      }
    }
  }

  return false;
}

function slideCandy() {
  for (let c = 0; c < columns; c++) {
    let ind = rows - 1;
    for (let r = columns - 1; r >= 0; r--) {
      if (!board[r][c].src.includes("root")) {
        board[ind][c].src = board[r][c].src;
        ind -= 1;
      }
    }

    for (let r = ind; r >= 0; r--) {
      board[r][c].src = "./images/root.png";
    }
  }
}

function generateCandy() {
  for (let c = 0; c < columns; c++) {
    if (board[0][c].src.includes("root")) {
      board[0][c].src = "./images/" + randomCandy() + ".png";
    }
  }
}

function checkGameEnd() {
    let fireCount = 0;
    let totalTiles = rows * columns; // Total number of tiles on the board

    // Loop through all tiles to count how many have fire.png
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c].src.includes("fire.png")) {
                fireCount++;
            }
        }
    }

    // Check if at least a third of the tiles are fire.png
    if (fireCount >= 15) {
        alert("Game Over! A third of the tiles have turned to fire.");
        clearInterval(gameInterval);
    }
}