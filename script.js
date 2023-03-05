import { TILE_STATUSES, createGame, markTile, revealTile, checkWin, checkLose } from "./app.js"
  
const GAME_SIZE = 16
const NUMBER_OF_MINES = 40

const game = createGame(GAME_SIZE, NUMBER_OF_MINES)
const gameElement = document.querySelector(".game")
const minesLeftCounter = document.querySelector('[data-mines-counter]')


// console.log(game)

game.forEach(row => {
    row.forEach(tile => {
        gameElement.append(tile.element)
        tile.element.addEventListener('click', () => {
            revealTile(game, tile)
           
            
            checkGameEnd()
        })
        tile.element.addEventListener('contextmenu', e => {
            e.preventDefault()
            markTile(tile)
            listMinesLeft()
        })
    })
})
gameElement.style.setProperty('--size', GAME_SIZE)
minesLeftCounter.textContent = NUMBER_OF_MINES

function listMinesLeft() {
    const markedTilesCount = game.reduce((count, row) => {
        return (
            count + row.filter(tile => tile.status === TILE_STATUSES.MARKED).length
        )
    }, 0)
    minesLeftCounter.textContent = NUMBER_OF_MINES - markedTilesCount
}

function checkGameEnd() {
    const win = checkWin(game)
    const lose = checkLose(game)

    if (win || lose) {
        gameElement.addEventListener('click', stopProp, {capture: true})
        gameElement.addEventListener('context', stopProp, {capture: true})
    }

    if (win) {
        emoji.setAttribute('src', './images/cool.png') 
    }

    if (lose) {
        setFace()
        game.forEach(row => {
            row.forEach(tile => {
                if (tile.TILE_STATUSES === TILE_STATUSES.MARKED) markTile(tile)
                if (tile.mine) revealTile(game, tile)
            })
        })
    }
}

function stopProp(e) {
    e.stopImmediatePropagation()
}

function setFace() {

}

