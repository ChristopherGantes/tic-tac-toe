function createPlayer(name, marker) {
  let score = 0;
  const getScore = () => score;
  const incrementScore = () => score++;
  const resetScore = () => (score = 0);
  return { name, marker, resetScore, getScore, incrementScore };
}

const game = (function () {
  let playerOne;
  let playerTwo;
  let currentPlayer;
  let turn = 1;

  let board = [
    new Array(3).fill(null),
    new Array(3).fill(null),
    new Array(3).fill(null),
  ];

  function initiatePlayers(nameOne, nameTwo) {
    playerOne = createPlayer(nameOne, "X");
    playerTwo = createPlayer(nameTwo, "O");
    currentPlayer = playerOne;
  }

  function getPlayerOne() {
    return playerOne;
  }

  function getPlayerTwo() {
    return playerTwo;
  }

  function getCurrentPlayer() {
    return currentPlayer;
  }

  function getMarker() {
    return currentPlayer.marker;
  }

  function resetGameBoard() {
    board = [
      new Array(3).fill(null),
      new Array(3).fill(null),
      new Array(3).fill(null),
    ];
  }

  function getGameScore() {
    return [playerOne.getScore(), playerTwo.getScore()];
  }

  function resetGameScore() {
    playerOne.resetScore();
    playerTwo.resetScore();
  }

  function changeTurn() {
    turn++;
    if (turn % 2 === 1) {
      currentPlayer = playerOne;
    } else {
      currentPlayer = playerTwo;
    }
  }

  function resetTurn() {
    turn = 0;
  }

  function setTile(row, column, marker) {
    if (row > 2 || row < 0 || column > 2 || column < 0) return;
    board[row][column] = marker;
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

    if (
      board[0].includes(null) ||
      board[1].includes(null) ||
      board[2].includes(null)
    ) {
      return "NOTHING";
    }

    return "TIE";
  }

  function handleTurn(row, column) {
    setTile(row, column, currentPlayer.marker);
    const result = checkBoard();
    if (result === "X") {
      playerOne.incrementScore();
      resetGameBoard();
    } else if (result === "O") {
      playerTwo.incrementScore();
      resetGameBoard();
    } else if (result === "TIE") {
      resetGameBoard();
    }
    changeTurn();
    return result;
  }

  function logBoard() {
    console.log(
      `${board[0][0]} ${board[0][1]} ${board[0][2]}
      \n${board[1][0]} ${board[1][1]} ${board[1][2]}
      \n${board[2][0]} ${board[2][1]} ${board[2][2]}`
    );
  }

  return {
    initiatePlayers,
    getPlayerOne,
    getPlayerTwo,
    getCurrentPlayer,
    getMarker,
    getGameScore,
    resetGameScore,
    resetGameBoard,
    changeTurn,
    resetTurn,
    setTile,
    checkBoard,
    handleTurn,
    logBoard,
  };
})();

const displayController = (function () {
  const playerOneNameInput = document.querySelector("#player-one-name");
  const playerTwoNameInput = document.querySelector("#player-two-name");
  const playerOneScore = document.querySelector("#player-one-score");
  const playerTwoScore = document.querySelector("#player-two-score");

  const startButton = document.querySelector("#start-button");
  const restartButton = document.querySelector("#restart-button");

  const alertDisplay = document.querySelector("#alerts");
  const container = document.querySelector("#container");
  const boardGrid = document.querySelector("#ttt-grid");

  function createTileCell(row, column) {
    const tileCell = document.createElement("div");
    tileCell.setAttribute("class", "grid-cell");
    tileCell.setAttribute("data-row", `${row}`);
    tileCell.setAttribute("data-column", `${column}`);
    tileCell.setAttribute("id", `${row * 3 + column}`);
    return tileCell;
  }

  function createBoardGrid() {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const tileCell = createTileCell(i, j);
        boardGrid.appendChild(tileCell);
      }
    }
  }

  function resetBoardDisplay() {
    boardGrid.replaceChildren();
    createBoardGrid();
  }

  function clearAlerts() {
    alertDisplay.textContent = "";
  }

  function handleNameInputs() {
    if (game.getPlayerOne() == null || game.getPlayerTwo() == null) {
      if (playerOneNameInput.value === "" || playerTwoNameInput.value === "") {
        console.log("either name blank");
        alertDisplay.textContent = "Enter Player Name/s";
        playerOneNameInput.setAttribute(
          "style",
          "border: 1px solid red;"
        );
        playerTwoNameInput.setAttribute(
          "style",
          "border: 1px solid red;"
        );
        return false;
      }

      if (playerOneNameInput.value !== "" && playerTwoNameInput.value !== "") {
        playerOneNameInput.removeAttribute("style");
        playerTwoNameInput.removeAttribute("style");

        game.initiatePlayers(
          playerOneNameInput.value,
          playerTwoNameInput.value
        );
      }
    }
    clearAlerts();
    return true;
  }

  function clearNameInputs() {
    playerOneNameInput.value = "";
    playerTwoNameInput.value = "";
  }

  function updateScore() {
    [playerOneScore.textContent, playerTwoScore.textContent] =
      game.getGameScore();
  }

  function updateDisplay() {
    updateScore();
    alertDisplay.textContent = `${game.getCurrentPlayer().name}'s Turn`;
  }

  function activateDisplay() {
    let turnResult;
    boardGrid.addEventListener("click", (event) => {
      if (turnResult === "X" || turnResult === "O" || turnResult === "TIE")
        return;
      if (event.target.id === "ttt-grid") return;
      if (event.target.getAttribute("class") === "grid-cell X") return;
      if (event.target.getAttribute("class") === "grid-cell O") return;

      const cellRow = Number(event.target.dataset.row);
      const cellColumn = Number(event.target.dataset.column);

      event.target.textContent = `${game.getMarker()}`;
      if (game.getMarker() === "X") event.target.classList.add("X");
      if (game.getMarker() === "O") event.target.classList.add("O");

      turnResult = game.handleTurn(cellRow, cellColumn);
      updateDisplay();

      if (turnResult === "X" || turnResult === "O" || turnResult === "TIE") {
        if (turnResult === "X") {
          alertDisplay.textContent = `${game.getPlayerOne().name} wins`;
        } else if (turnResult === "O") {
          alertDisplay.textContent = `${game.getPlayerTwo().name} wins`;
        } else {
          alertDisplay.textContent = "TIE";
        }
      }
    });
  }

  function handleStart() {
    startButton.addEventListener("click", () => {
      if (handleNameInputs()) {
        resetBoardDisplay();
        activateDisplay();
        updateDisplay();
      }
    });
  }

  function handleRestart() {
    restartButton.addEventListener("click", () => {
      clearAlerts();
      resetBoardDisplay();
      clearAlerts();
      game.resetGameScore();
      updateDisplay();
    });
  }

  function run() {
    clearNameInputs();
    createBoardGrid();
    handleStart();
    handleRestart();
  }

  return { run };
})();

displayController.run();
