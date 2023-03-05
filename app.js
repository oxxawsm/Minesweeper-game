export const TILE_STATUSES = {
    HIDDEN: "hidden",
    MINE: "mine",
    NUMBER: "number",
    MARKED: "marked",
}
  
export function createGame(gameSize, numberOfMines) {
    const game = []
    const minePositions = getMinePositions(gameSize, numberOfMines)

    for (let x = 0; x < gameSize; x++) {
      const row = []
      for (let y = 0; y < gameSize; y++) {
        const element = document.createElement("div")
        element.dataset.status = TILE_STATUSES.HIDDEN
  
        const tile = {
          element,
          x,
          y,
          mine: minePositions.some(positionMatch.bind(null, {x, y})),
          get status() {
            return this.element.dataset.status
          },
          set status(value) {
            this.element.dataset.status = value
          },
        }
  
        row.push(tile)
      }
      game.push(row)
    }
  
    return game
}

export function markTile(tile) {
  if (
    tile.status !== TILE_STATUSES.HIDDEN && tile.status !== TILE_STATUSES.MARKED
  ) {
      return
  }
  if (tile.status === TILE_STATUSES.MARKED) {
    tile.status = TILE_STATUSES.HIDDEN
  } else {
    tile.status = TILE_STATUSES.MARKED
  }
}

export function revealTile(game, tile) {
  if (tile.status !== TILE_STATUSES.HIDDEN) {
    return
  }
  if (tile.mine) {
    tile.status = TILE_STATUSES.MINE
    return
  }

  tile.status = TILE_STATUSES.NUMBER
  const neighborTiles = nearTiles(game, tile)
  const mines = neighborTiles.filter(t => t.mine)
  if (mines.length === 0) {
    neighborTiles.forEach(revealTile.bind(null, game))
  } else {
    tile.element.textContent = mines.length
  }
}

export function checkWin(game) {
  return game.every(row => {
    return row.every(tile => {
        return tile.status === TILE_STATUSES.NUMBER 
        || (tile.mine 
        && (tile.status === TILE_STATUSES.HIDDEN
        || tile.status === TILE_STATUSES.MARKED))
    })
})
}

export function checkLose(game) {
  return game.some(row => {
    return row.some(tile => {
      return tile.status === TILE_STATUSES.MINE
    })
  })
}

function getMinePositions(gameSize, numberOfMines) {
    const positions = []
    while (positions.length < numberOfMines) {
        const position = {
            x: randomNumber(gameSize),
            y: randomNumber(gameSize)
        }

        if (!positions.some(positionMatch.bind(null, position))) {
            positions.push(position)
        }
    }
    return positions
}

function positionMatch(a, b) {
    return a.x === b.x && a.y === b.y
}

function randomNumber(size) {
    return Math.floor(Math.random() * size)
}

function nearTiles(game, {x, y}) {
  const tiles = []

  for (let xOffset = -1; xOffset <= 1; xOffset++) {
    for (let yOffset = -1; yOffset <= 1; yOffset++) {
      const tile = game[x + xOffset]?.[y + yOffset]
      if (tile) tiles.push(tile)
    }
  }

  return tiles
}