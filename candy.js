//WEBSOCKET

let ws = new WebSocket("wss://human-echoes-f0fe8c05475c.herokuapp.com:443");

//let controlledByTD = document.querySelector(".controlledByTD");

//let controlTD = document.querySelector(".controllTD");






ws.addEventListener("open", (event) => {
  console.log("websocket opened");
});

ws.addEventListener("message", (message) => {
  if (message.data == "ping") {
    ws.send("pong");
    return;
  }

  //  let data = JSON.parse(message.data);
  //  if ("slider1" in data) {
  //    let val = data["slider1"];
  //    controlledByTD.value = val * 100;
  //  }

  //  console.log(data);
});

ws.addEventListener("error", (error) => {
  console.error("websocket closed");
});

ws.addEventListener("close", (event) => {
  console.log("websocket closed");
});

// Restart game when button is clicked
document.getElementById("restartButton").addEventListener("click", function() {
  resetGame(); // Call the function to reset the game
});

// CANDYCRUSH GAME
/* candycrush initialize */

var candies = ["geocoin", "geo1", "geo2", "geo3"];
var board = [];
var rows = 9;
var columns = 9;
var score = 0;

var currTile;
var otherTile;

var gameInterval;

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

let startX, startY;

function handleTouchStart(e) {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
  currTile = this;
}

function handleTouchMove(e) {
  e.preventDefault();
  const moveX = e.touches[0].clientX;
  const moveY = e.touches[0].clientY;

  const diffX = moveX - startX;
  const diffY = moveY - startY;

  if (Math.abs(diffX) > Math.abs(diffY)) {
    // Horizontal swipe
    if (diffX > 0) {
      otherTile = document.getElementById(
        currTile.id.split("-")[0] +
          "-" +
          (parseInt(currTile.id.split("-")[1]) + 1)
      );
    } else {
      otherTile = document.getElementById(
        currTile.id.split("-")[0] +
          "-" +
          (parseInt(currTile.id.split("-")[1]) - 1)
      );
    }
  } else {
    // Vertical swipe
    if (diffY > 0) {
      otherTile = document.getElementById(
        parseInt(currTile.id.split("-")[0]) +
          1 +
          "-" +
          currTile.id.split("-")[1]
      );
    } else {
      otherTile = document.getElementById(
        parseInt(currTile.id.split("-")[0]) -
          1 +
          "-" +
          currTile.id.split("-")[1]
      );
    }
  }

  dragEnd(); // Complete the swap
}

function startGame() {
  for (let r = 0; r < rows; r++) {
    let row = [];
    for (let c = 0; c < columns; c++) {
      let tile = document.createElement("img");
      tile.id = r.toString() + "-" + c.toString();
      tile.src = "./images/" + randomCandy() + ".png";

      // Existing event listeners
      tile.addEventListener("dragstart", dragStart);
      tile.addEventListener("dragover", dragOver);
      tile.addEventListener("dragenter", dragEnter);
      tile.addEventListener("drop", dragDrop);
      tile.addEventListener("dragend", dragEnd);

      // Add touch event listeners for mobile
      tile.addEventListener("touchstart", handleTouchStart);
      tile.addEventListener("touchmove", handleTouchMove);
      tile.addEventListener("touchend", dragEnd);

      document.getElementById("board").append(tile);
      row.push(tile);
    }
    board.push(row);
  }
}

//Touch function on Mobile

//Drag Option on the Desktop

function dragStart(e) {
  currTile = this;
}

function dragOver(e) {
  e.preventDefault(); // Allows the drag to happen on mobile
}

function dragEnter(e) {
  e.preventDefault(); // Allows the drag to happen on mobile
}

function dragDrop(e) {
  otherTile = this;
}

function dragLeave() {}

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
          ws.send(JSON.stringify({ Coins: 1.0 }));
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
          ws.send(JSON.stringify({ Coins: 1.0 }));

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
  if (fireCount >= 20) {
    clearInterval(gameInterval); // Stop the game loop
    ws.send(JSON.stringify({ Gameover: 1.0 }));
    alert("Game Over! You destroyed your playground.");

    // Ask the user if they want to play again
    if (confirm("Do you want to play again?")) {
      if (confirm("Will you change your approach?")) {
        if (confirm("Will we change our patterns?")) {
          resetGame(); // Restart the game
        }
      }
    }
  }
}

function resetGame() {
  // Clear the board array and remove all existing tiles from the DOM
  board = [];
  document.getElementById("board").innerHTML = "";

  // Reset the score and update the display
  score = 0;
  document.getElementById("score").innerText = score;

  // Restart the game
  startGame();

  // Restart the game interval
  gameInterval = window.setInterval(function () {
    crushCandy();
    slideCandy();
    generateCandy();
    checkGameEnd(); // Check if the game should end
  }, 100);
}
