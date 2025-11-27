// Initial values for player, names are empty, scores start at 0
let playerOneScore = 0
let playerTwoScore = 0
let playerOneName 
let playerTwoName

// A class to keep track of a player name and symbol
class Player{
    constructor(name, symbol, score){
        this.name = name
        this.symbol = symbol
        this.score = score
    }
}

const player1 = new Player(playerOneName, "X", playerOneScore)
const player2 = new Player(playerTwoName, "O", playerTwoScore)

// Handles collecting player names from the form and starts the game when both names are provided
function startGame(){
    const startBtn = document.querySelector(".start-game-btn")
    const form = document.querySelector("form")
    const overlay = document.querySelector(".form-overlay")
    let pOneScore = document.createElement("div")
    let pTwoScore = document.createElement("div")

    startBtn.addEventListener("click", (e) => {
        e.preventDefault()

        playerOneName = document.querySelector("#player-one-name").value
        playerTwoName = document.querySelector("#player-two-name").value
        
        
        if (playerOneName && playerTwoName) {
            const playerInfo = document.querySelector(".player-info")
            let pOneName = document.createElement("div")
            let pTwoName = document.createElement("div")
            pOneName.classList.add("p-one-name")
            pTwoName.classList.add("p-two-name")
            pOneScore.classList.add("p-one-score")
            pTwoScore.classList.add("p-two-score")

            pOneName.textContent = playerOneName
            pTwoName.textContent = playerTwoName
            pOneScore.textContent = player1.score
            pTwoScore.textContent = player2.score

            playerInfo.appendChild(pOneName)
            playerInfo.appendChild(pTwoName)
            playerInfo.appendChild(pOneScore)
            playerInfo.appendChild(pTwoScore)


            form.style.display = "none"
            overlay.style.display = "none"

            player1.name = playerOneName
            player2.name = playerTwoName
            
            displayController.renderBoard()

        }else {
            return
        }
        
        
    })
    pOneScore.textContent = player1.score
    pTwoScore.textContent = player2.score

}
startGame()

// Tic Tac Toe gameboard storage
class GameBoard {
    constructor() {
        this.board = [["","",""], ["","",""], ["","",""]] 
    }  

    makeMove(row, col, playerSymbol) {
        this.board[row][col] = playerSymbol
    }

    checkWinner(){
        const b = this.board

        for (let i = 0; i < b.length; i++) {
            // Check Row
            if (b[i][0] !== "" && b[i][0] === b[i][1] && b[i][1] === b[i][2]) {
                return b[i][0]
            }
            // Check column
            if (b[0][i] !== "" && b[0][i] === b[1][i] && b[1][i] === b[2][i]) {
                return b[0][i]
            }
        }
        // Check diagonals
        if (b[0][0] !== "" && b[0][0] === b[1][1] && b[1][1] === b[2][2]) {
            return b[0][0]
        }
        if (b[0][2] !== "" && b[0][2] === b[1][1] && b[1][1] === b[2][0]) {
            return b[0][2]
        }
        // No winner
        return null
    }

    checkTie(){
        for (const row of this.board) {
            for (const cell of row) {
                if (cell === "") {
                    return false
                }
            }
        }

        return true
    }
}

const gameBoard = new GameBoard()

// A class to manage the game flow
class controller {
    constructor(gameBoard, player1, player2) {
        this.gameBoard = gameBoard
        this.player1 = player1
        this.player2 = player2
        this.currentPlayer = player1

    }

    playRound(row, col){
        if (this.gameBoard.board[row][col] !== "") {
            return
        }
        
        this.gameBoard.makeMove(row, col, this.currentPlayer.symbol)

        const crown = document.createElement("img")
        crown.classList.add("crown-png")
        crown.src = "Icon/Crown.png"

        const result = this.gameBoard.checkWinner()
        const tie = this.gameBoard.checkTie()
        const announceResult = document.createElement("div")
        announceResult.classList.add("announce-result")

        if(result){
            this.currentPlayer.score += 1

            document.querySelector(".p-one-score").textContent = player1.score
            document.querySelector(".p-two-score").textContent = player2.score
            if (!tie) {
                announceResult.textContent = `${this.currentPlayer.name} wins this round! 🎉`
                document.body.appendChild(announceResult)
                setTimeout(() => {
                    announceResult.remove()
                }, 2000)
            }

            if (player1.score > player2.score) {
                crown.style.gridColumn = "1 / 2"
                crown.style.gridRow = "1 / 2"
                document.querySelector(".crown-png")?.remove()
                document.querySelector(".player-info").appendChild(crown)
            }
            else if (player1.score < player2.score) {
                crown.style.gridColumn = "3 / 4"
                crown.style.gridRow = "1 / 2"
                document.querySelector(".crown-png")?.remove()
                document.querySelector(".player-info").appendChild(crown)
            }else {
                document.querySelector(".crown-png")?.remove()
            }
            return `${result} Wins!`
        }
        if (tie){
            announceResult.textContent = "It's a tie!"
            document.body.appendChild(announceResult)
            setTimeout(() => {
                    announceResult.remove()
                }, 2000)
            return "It's a tie"
        }
        
        this.currentPlayer = this.currentPlayer === this.player1 ? this.player2 : this.player1

    }
}

const game = new controller(gameBoard, player1, player2)

// Handles rendering the game board and updating it after each move
const displayController = (function(){

    const container = document.querySelector(".container")

    const renderBoard = function (){
        container.innerHTML = ""
        const board = gameBoard.board
        
        for (let i = 0; i < board.length; i++) {

            const row = board[i]
        
            for (let j = 0; j < row.length; j++) {
                let divBox = document.createElement("div")
                const symbol = row[j]
                divBox.classList.add("div-box")
                divBox.textContent = symbol
                container.appendChild(divBox)
                divBox.dataset.row = i
                divBox.dataset.col = j
            }
        }
        const divs = document.querySelectorAll(".div-box")
        divs.forEach((box) => {
            box.addEventListener("click",  () => {
                const result = gameBoard.checkWinner()
                const tie = gameBoard.checkTie()
                
                if (box.textContent === "" && result === null && tie === false) {
                    game.playRound(box.dataset.row, box.dataset.col)
                    displayController.renderBoard()
                }
            })
        })
        
    }
    
    return {renderBoard}
})()

// Initializes event listeners for restarting the game
gameReset = function() {
    const playAgainBtn = document.querySelector(".play-again-btn")
    const NewMatchBtn = document.querySelector(".new-match-btn")

    playAgainBtn.addEventListener("click", () => {
        gameBoard.board = [["","",""], ["","",""], ["","",""]]
        displayController.renderBoard()
    })

    NewMatchBtn.addEventListener("click", () => {
        location.reload()
    })
}()