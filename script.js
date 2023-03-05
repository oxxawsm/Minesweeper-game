import { TILE_STATUSES, createGame, markTile, revealTile, checkWin, checkLose } from "./app.js"
  
const GAME_SIZE = 16
const NUMBER_OF_MINES = 40

const game = createGame(GAME_SIZE, NUMBER_OF_MINES)
const gameElement = document.querySelector('.game')
const minesLeftCounter = document.querySelector('[data-mines-counter]')
const button = document.querySelector('.smile')
const timer = document.querySelector('.timer')

let time
function startWatch() {
    if (time) clearInterval(time)
    let sec = 0
    timer.innerHTML = sec
    time = setInterval(function(){
        sec++
        timer.innerHTML = sec
    }, 1000)
    }
startWatch()

function stopWatch() {
    if (time) clearInterval(time)
}

game.forEach(row => {
    row.forEach(tile => {
        gameElement.append(tile.element)
        tile.element.addEventListener('click', () => {
            revealTile(game, tile)
            setFace()
            checkGameEnd()
        })
        tile.element.addEventListener('contextmenu', e => {
            e.preventDefault()
            markTile(tile)
            listMinesLeft()
        })
    })
})

button.addEventListener('click', () => {
    button.classList.add('click')
    setTimeout(function() {
        button.classList.remove('click')
    }, 300)
    location.reload()
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
        button.classList.add('emoji-win'); 
        stopWatch()
    }

    if (lose) {
        game.forEach(row => {
            row.forEach(tile => {
                if (tile.TILE_STATUSES === TILE_STATUSES.MARKED) markTile(tile)
                if (tile.mine) revealTile(game, tile)
            })
        })
        button.classList.add('emoji-lose'); 
        stopWatch()
    }
}

function stopProp(e) {
    e.stopImmediatePropagation()
}

function setFace() {
    gameElement.addEventListener('click', (event) => {
        button.classList.add('click-tile')
        setTimeout(function() {
            button.classList.remove('click-tile')
        }, 300)
    })
}

// let fromTime = new Date().getMinutes()
// let seconds = 0
// timer.addEventListener('seconds', () => seconds = new Date().getMinutes())
// watch()

// function watch() {
//     let time = new Date().getMinutes()
//     if (seconds) {
//         fromTime += time - seconds/60
//         seconds = time
//     }
//     timer.innerHTML = (time - fromTime)
//     requestAnimationFrame(watch)
// }



