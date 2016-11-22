console.reset = function () {
  return process.stdout.write('\033c');
}

'use strict'

const assert = require('assert')

const ALIVE = 'x'
const DEAD = 'o'

const cellValues = {
    true: ALIVE,
    false: DEAD
}

const testGrid = [ 'xxx', 'xox', 'oox' ]
const deadGrid = [ 'ooo', 'ooo', 'ooo' ]
const blinkerGrid = [ 'ooo', 'xxx', 'ooo' ]

const neighbourOffsets = [[1,0], [1,1], [0,1], [-1,1], [-1,0], [-1,-1], [0,-1], [1,-1]]

const getNeighbourCoordinatesForCell = ([row,col]) => {
    return neighbourOffsets.map(([rowOffset, colOffset]) => {
        return [row+rowOffset, col+colOffset]
    })
}

const actual = getNeighbourCoordinatesForCell([1,1])
const expected = [ [ 2, 1 ], [ 2, 2 ], [ 1, 2 ], [ 0, 2 ], [ 0, 1 ], [ 0, 0 ], [ 1, 0 ], [ 2, 0 ] ]

assert.deepEqual(actual, expected)

const getValue = (grid, [row,col]) => {
    return grid[row] && grid[row][col]
}

const isAlive = (val) => val === ALIVE

const getAliveNeighbourCount = (cell, grid) =>
    getNeighbourCoordinatesForCell(cell)
        .map(coord => getValue(grid, coord))
        .filter(isAlive)
        .length

assert.equal(getAliveNeighbourCount([1,1], testGrid), 6)
assert.equal(getAliveNeighbourCount([0,0], testGrid), 2)

const deadOrAlive = ([row, col], grid) => {
    const aliveCount = getAliveNeighbourCount([row, col], grid)
    const cellValue = getValue(grid, [row, col])

    if (cellValue === ALIVE) {
        return aliveCount === 2 || aliveCount === 3
    } else {
        return aliveCount === 3
    }
}

assert.equal(deadOrAlive([1,1], testGrid), false)
assert.equal(deadOrAlive([2,1], testGrid), true)

const calculateNextGrid = (grid) => {
    return grid.map((cellRow, row) => {
        return cellRow.split('')
            .map((cell, col) => {
                return cellValues[deadOrAlive([row, col], grid)]
            })
            .join('')
    })

}

assert.deepEqual(calculateNextGrid(testGrid), [ 'xox', 'xox', 'oxo' ])

const isGameOver = (grid) => {
    return grid.join('').indexOf(ALIVE) === -1
}

assert.deepEqual(isGameOver(deadGrid), true)

const printGrid = (grid) => {
    console.reset();
    console.log(grid.join('\n'))
}

const breed = (grid) => {
    setTimeout(() => {
        const nextGrid = calculateNextGrid(grid)
        printGrid(nextGrid)
        if (!isGameOver(grid)) {
            breed(nextGrid)
        }
    }, 200)
}

breed(blinkerGrid)
