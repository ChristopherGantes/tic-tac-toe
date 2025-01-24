function createPlayer(name, marker) {
  let score = 0;
  const getScore = () => score;
  const incrementScore = () => score++;
  return { name, marker, getScore, incrementScore };
}

const game = (function () {
  let playerOne;
  let playerTwo;
  let currentMarker;
  let turn = 1;

  let board = [new Array(3), new Array(3), new Array(3)];

  function resetGameBoard() {
    board = [new Array(3), new Array(3), new Array(3)];
  }

  function initiatePlayers(player1, player2) {
    playerOne = player1;
    playerTwo = player2;
    currentMarker = player1.marker;
  }

  function changeTurn() {
    turn++;
    if (turn % 2 === 1) {
      currentMarker = playerOne.marker;
    } else {
      currentMarker = playerTwo.marker;
    }
  }

  function getPlayerOne() {
    return playerOne;
  }

  function getPlayerTwo() {
    return playerTwo;
  }

  function getMarker() {
    return currentMarker;
  }

  function setTile(row, column) {
    if (row > 2 || row < 0 || column > 2 || column < 0) return;
    board[row][column] = currentMarker;
  }

  function logBoard() {
    console.log(
      `${board[0][0]} ${board[0][1]} ${board[0][2]}
      \n${board[1][0]} ${board[1][1]} ${board[1][2]}
      \n${board[2][0]} ${board[2][1]} ${board[2][2]}`
    );
  }

  function checkBoard() {
    for (let i = 0; i < board.length; i++) {
      // Check Row
      if (
        board[i][0] === board[i][1] &&
        board[i][1] === board[i][2] &&
        board[i][0] != null
      ) {
        console.log("row " + i);
        return board[i][0];
      }

      // Check Column
      if (
        board[0][i] === board[1][i] &&
        board[1][i] === board[2][i] &&
        board[0][i] != null
      ) {
        console.log("column " + i);
        return board[0][i];
      }
    }

    if (
      board[0][0] === board[1][1] &&
      board[1][1] === board[2][2] &&
      board[0][0] != null
    ) {
      console.log("top-left-diagonal");
      return board[0][0];
    }

    if (
      board[2][0] === board[1][1] &&
      board[1][1] === board[0][2] &&
      board[2][0] != null
    ) {
      console.log("bottom-left-diagonal");
      return board[2][0];
    }

    return "";
  }
  return {
    getPlayerOne,
    getPlayerTwo,
    getMarker,
    initiatePlayers,
    resetGameBoard,
    changeTurn,
    setTile,
    logBoard,
    checkBoard,
  };
})();

const displayController = (function () {
  function createTileCell(row, column) {
    const tileCell = document.createElement("div");
    tileCell.setAttribute("class", "grid-cell");
    tileCell.setAttribute("data-row", `${row}`);
    tileCell.setAttribute("data-column", `${column}`);
    tileCell.setAttribute("id", `${row * 3 + column}`);

    return tileCell;
  }

  function createBoardGrid() {
    const boardGrid = document.createElement("div");
    boardGrid.setAttribute("id", "ttt-grid");
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const tileCell = createTileCell(i, j);
        boardGrid.appendChild(tileCell);
      }
    }

    return boardGrid;
  }

  function resetBoardDisplay() {
    const container = document.querySelector("#container");
    container.replaceChildren();
    const boardGrid = createBoardGrid();
    container.appendChild(boardGrid);

    return boardGrid;
  }

  function checkGame() {
    const alertDisplay = document.querySelector("#alerts");
    const playerOneScore = document.querySelector("#player-one-score");
    const playerTwoScore = document.querySelector("#player-two-score");
    const result = game.checkBoard();
    if (result !== "") {
      if (result === "X") {
        alertDisplay.textContent = `${game.getPlayerOne().name} wins`;
        game.getPlayerOne().incrementScore();
      } else {
        alertDisplay.textContent = `${game.getPlayerTwo().name} wins`;
        game.getPlayerTwo().incrementScore();
      }
      playerTwoScore.textContent = `${game.getPlayerTwo().getScore()}`;
      playerOneScore.textContent = `${game.getPlayerOne().getScore()}`;
      return true;
    }

    game.logBoard();
    return false;
  }

  function activateDisplay() {
    const boardGrid = document.querySelector("#ttt-grid");
    boardGrid.addEventListener("click", (event) => {
      if (event.target.id === "ttt-grid") return;
      if (event.target.getAttribute("class") === "grid-cell X") return;
      if (event.target.getAttribute("class") === "grid-cell O") return;
      
      const cellRow = Number(event.target.dataset.row);
      const cellColumn = Number(event.target.dataset.column);

      event.target.textContent = `${game.getMarker()}`;
      if (game.getMarker() === "X") event.target.classList.add("X");
      if (game.getMarker() === "O") event.target.classList.add("O");

      game.setTile(cellRow, cellColumn, game.getMarker());
      game.changeTurn();

      if (checkGame()) {
        game.resetGameBoard();
      }
    });
  }

  return { createBoardGrid, resetBoardDisplay, activateDisplay };
})();

displayController.resetBoardDisplay();

const restartButton = document.querySelector("#restart-button");
restartButton.addEventListener("click", () => {
  displayController.resetBoardDisplay();
  game.resetGameBoard();
});

const startButton = document.querySelector("#start-button");
startButton.addEventListener("click", () => {
  const playerOneNameInput = document.querySelector("#player-one-name");
  const playerTwoNameInput = document.querySelector("#player-two-name");

  if (game.playerOne == null || game.playerTwo == null) {
    if (playerOneNameInput.value === "" || playerTwoNameInput.value === "") {
      console.log("either name blank");
      playerOneNameInput.setAttribute(
        "style",
        "background-color:red; color:white"
      );
      playerTwoNameInput.setAttribute(
        "style",
        "background-color:red; color:white;"
      );
      return;
    }

    if (playerOneNameInput.value !== "" && playerTwoNameInput.value !== "") {
      playerOneNameInput.removeAttribute("style");
      playerTwoNameInput.removeAttribute("style");
      const playerOne = createPlayer(playerOneNameInput.value, "X");
      const playerTwo = createPlayer(playerTwoNameInput.value, "O");

      game.initiatePlayers(playerOne, playerTwo);
      displayController.resetBoardDisplay();
      displayController.activateDisplay();
      console.log("game started");
    }
  }

  game.resetGameBoard();
});