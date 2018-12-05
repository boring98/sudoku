//@ts-check

const fs = require('fs')
// const Buffer = require('buffer')

const resultFileNam = 'standard_result.txt'

// const ws = fs.createWriteStream('./standard_result.txt')

const original_problem = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
]

// const original_problem = [
//     [0, 0, 3, 0, 9, 0, 0, 8, 0],
//     [0, 7, 5, 0, 2, 0, 0, 0, 0],
//     [4, 0, 6, 0, 0, 5, 0, 0, 0],
//     [0, 1, 9, 0, 0, 0, 0, 0, 4],
//     [0, 6, 0, 1, 0, 4, 0, 2, 0],
//     [2, 0, 0, 0, 0, 0, 7, 1, 0],
//     [0, 0, 0, 6, 0, 0, 8, 0, 7],
//     [0, 0, 0, 0, 8, 0, 1, 5, 0],
//     [0, 3, 0, 0, 4, 0, 6, 0, 0],
// ]

// const original_problem = [
//     [0, 0, 6, 0, 4, 0, 0, 1, 0],
//     [0, 2, 3, 0, 7, 0, 0, 0, 0],
//     [9, 0, 4, 0, 0, 2, 0, 0, 0],
//     [0, 1, 8, 0, 0, 0, 0, 0, 6],
//     [0, 3, 0, 1, 0, 7, 0, 9, 0],
//     [7, 0, 0, 0, 0, 0, 5, 3, 0],
//     [0, 0, 0, 3, 0, 0, 2, 0, 5],
//     [0, 0, 0, 0, 2, 0, 8, 7, 0],
//     [0, 4, 0, 0, 5, 0, 1, 0, 0],
// ]

// const original_problem = [
//     [8, 7, 6, 5, 4, 3, 9, 1, 2],
//     [1, 2, 3, 8, 7, 9, 6, 5, 4],
//     [9, 5, 4, 6, 1, 2, 3, 8, 7],
//     [4, 1, 8, 9, 3, 5, 7, 2, 6],
//     [2, 3, 5, 1, 6, 7, 4, 9, 8],
//     [7, 6, 9, 2, 8, 4, 5, 3, 1],
//     [6, 8, 7, 3, 9, 1, 2, 4, 5],
//     [5, 9, 1, 4, 2, 6, 8, 7, 3],
//     [3, 4, 2, 7, 5, 8, 1, 6, 9],
// ]

class Region {
    constructor(index) {
        this.index = index
    }

    *[Symbol.iterator]() {
        if (this.index >= 0 && this.index < 9) {
            for (let i = 0; i < 9; i++) {
                yield [this.index, i]
            }
        } else if (this.index >= 9 && this.index < 18) {
            for (let i = 0; i < 9; i++) {
                yield [i, this.index - 9]
            }
        } else if (this.index >= 18 && this.index < 27) {
            for (let i = (Math.floor(this.index / 3) - 6) * 3; i < (Math.floor(this.index / 3) - 6) * 3 + 3; i++) {
                for (let j = (this.index % 3) * 3; j < (this.index % 3) * 3 + 3; j++) {
                    yield [i, j]
                }
            }
        }
    }
}

class Sudo {
    constructor(tableMap, type = 0) {
        if (tableMap.length != 9) {
            // console.error('must be 9 lines')
            throw new Error('must be 9 lines')
        }
        const validValueSet = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
        for (const line of tableMap) {
            if (line.length != 9) {
                throw new Error('must be 9 columns for each line')
            }
            for (const elem of line) {
                if (!validValueSet.has(parseInt(elem))) {
                    throw new Error('value must between 1 and 9')
                }
            }
        }
        this.tableMap = tableMap
        this.type = type
        this.possibleSet = Array.from({ length: 9 }, (v, k) => { return Array.from({ length: 9 }, (vv, kk) => { return new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]) }) })
    }

    getValueByPoint(x, y) {
        return this.tableMap[x][y]
    }

    /**
     * return 0: finish and is a correct answer
     * return 1: not finished, but reasonable till now
     * return -1: wrong status can not be solved
     */
    getStatus() {
        let res = 0
        for (const region of this.getRegionIterator()) {
            const resSet = new Set()
            for (const [x, y] of region) {
                if (this.tableMap[x][y] == 0) {
                    res = 1
                    continue
                }
                if (resSet.has(this.tableMap[x][y])) {
                    return -1
                }
                resSet.add(this.tableMap[x][y])
            }
        }
        return res
    }

    solve() {
        let status = this.getStatus()
        if (status == Sudo.Status.Wrong) {
            throw new Error('The original problem is conflict!')
        }
        if (status == Sudo.Status.Correct) {
            return 0
        }
        while (true) {
            this.update()
            if (this.getStatus() == Sudo.Status.Correct) {
                return 0
            } else if (this.getStatus() == Sudo.Status.Unfinished) {
                // this.chooseOnePointAndTry()
                this.update()
            }
        }
    }

    // chooseOnePointAndTry() {
    //     for (const [x, y, value] of getOnePossiblePointValue()) {
    //         this.tableMap[x][y] = value
    //         this.update()
    //         if (this.getStatus() == Sudo.Status.Correct) {
    //             return 0
    //         } else if (this.getStatus() == Sudo.Status.Unfinished) {
    //             this.chooseOnePointAndTry()
    //         }
    //     }
    // }

    update() {
        let decidedPointSet = new Set(Array.from(this.getPointIterator()).filter(([x, y, value]) => { return value != 0 }))
        do {
            this.updatePossibleSet(decidedPointSet)
            decidedPointSet = this.getDecidedPointValueSet()

        } while (decidedPointSet.size > 0);
    }

    updatePossibleSet(decidedPointSet) {
        for (const [x, y, value] of decidedPointSet) {
            this.tableMap[x][y] = value
            this.possibleSet[x][y].clear()
            for (const regionIndex of this.getRegionIndexArrWherePointIn(x, y)) {
                for (const [i, j] of (new Region(regionIndex))) {
                    this.possibleSet[i][j].delete(value)
                }
            }
        }
    }

    getDecidedPointValueSet() {
        const resSet = new Set()
        // point decided
        for (const [x, y, value] of this.getPointIterator()) {
            if (this.possibleSet[x][y].size == 1) {
                resSet.add([x, y, this.possibleSet[x][y].values().next().value])
            }
        }

        // region decided
        for (const region of this.getRegionIterator()) {
            const hash = new Map()
            const tmpSet = new Set()
            for (const [i, j] of region) {
                for (const value of this.possibleSet[i][j]) {
                    if (!hash.has(value)) {
                        hash.set(value, [i, j, value])
                        tmpSet.add(value)
                    } else {
                        tmpSet.delete(value)
                    }
                }
            }
            for (const value of tmpSet) {
                resSet.add(hash.get(value))
            }
        }
        return resSet
    }

    getRegionIndexArrWherePointIn(x, y) {
        return [x, 9 + y, 18 + Math.floor(x / 3) * 3 + Math.floor(y / 3)]
    }

    *[Symbol.iterator]() {
        return this.getPointIterator()
    }

    *getPointIterator() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                yield [i, j, this.tableMap[i][j]]
            }
        }
    }

    *getRegionIterator() {
        for (const iter of Array.from({ length: 27 }, (v, k) => { return new Region(k) })) {
            yield iter
        }
    }
}

Sudo.Status = {
    Correct: 0,
    Unfinished: 1,
    Wrong: -1
}

// console.log('Question is:')
// console.log(original_problem)
// const sudo = new Sudo(original_problem)
// sudo.update()
// console.log('Answer is:')
// console.log(original_problem)

// let res = ''
// switch (sudo.getStatus()) {
//     case Sudo.Status.Correct:
//         res = 'Correct'
//         break;
//     case Sudo.Status.Unfinished:
//         res = 'Unfinished'
//         break;
//     case Sudo.Status.Wrong:
//         res = 'Wrong'
//         break;

//     default:
//         break;
// }
// console.log(`The answer is ${res}`)


class MaybeMap {
    constructor() {
        this.tableMap = [
            [], [], [], [], [], [], [], [], [],
        ]
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                this.tableMap[i].push(new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]))
            }
        }
    }
    update(point) {
        if (point.value == 0) {
            return
        }
        this.tableMap[point.x][point.y] = new Set([])
        for (let i = 0; i < 9; i++) {
            this.tableMap[i][point.y].delete(point.value)
        }
        for (let j = 0; j < 9; j++) {
            this.tableMap[point.x][j].delete(point.value)
        }
        const xBegin = getRegionBeginPoint(point.x)
        const yBegin = getRegionBeginPoint(point.y)
        for (let i = xBegin; i < xBegin + 3; i++) {
            for (let j = yBegin; j < yBegin + 3; j++) {
                this.tableMap[i][j].delete(point.value)
            }
        }
    }
    getSurely() {
        const res = new Set(this.getSinglePointSurely())
        for (const surelyPoint of this.getRegionSurely()) {
            res.add(surelyPoint)
        }
        return res
    }
    getSinglePointSurely() {
        const res = new Set()
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.tableMap[i][j].size == 1) {
                    res.add({
                        x: i,
                        y: j,
                        value: [...this.tableMap[i][j]][0]
                    })
                }
            }
        }
        return res
    }
    getTableMap() {
        return this.tableMap
    }
    getRegionSurely() {
        const resSet = new Set()
        // x-axias
        for (let i = 0; i < 9; i++) {
            const hash = new Map()
            const tmpSet = new Set()
            for (let j = 0; j < 9; j++) {
                for (const value of this.tableMap[i][j]) {
                    if (!hash.has(value)) {
                        hash.set(value, { x: i, y: j, value: value })
                        tmpSet.add(value)
                    } else {
                        tmpSet.delete(value)
                    }
                }
            }
            for (const value of tmpSet) {
                resSet.add(hash.get(value))
            }
        }
        // y-axias
        for (let j = 0; j < 9; j++) {
            const hash = new Map()
            const tmpSet = new Set()
            for (let i = 0; i < 9; i++) {
                for (const value of this.tableMap[i][j]) {
                    if (!hash.has(value)) {
                        hash.set(value, { x: i, y: j, value: value })
                        tmpSet.add(value)
                    } else {
                        tmpSet.delete(value)
                    }
                }
            }
            for (const value of tmpSet) {
                resSet.add(hash.get(value))
            }
        }
        // 3*3
        for (let index_x = 0; index_x < 3; index_x++) {
            for (let index_y = 0; index_y < 3; index_y++) {
                const hash = new Map()
                const tmpSet = new Set()
                for (let i = index_x * 3; i < index_x * 3 + 3; i++) {
                    for (let j = index_y * 3; j < index_y * 3 + 3; j++) {
                        for (const value of this.tableMap[i][j]) {
                            if (!hash.has(value)) {
                                hash.set(value, { x: i, y: j, value: value })
                                tmpSet.add(value)
                            } else {
                                tmpSet.delete(value)
                            }
                        }
                    }
                }
                for (const value of tmpSet) {
                    resSet.add(hash.get(value))
                }
            }
        }
        return resSet
    }
}

function solve_sudoku(problem) {
    const maybe = new MaybeMap();
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            maybe.update({ x: i, y: j, value: original_problem[i][j] })
        }
    }
    // console.log('-------------', maybe.getTableMap())
    let surely = maybe.getSurely()
    while (surely.size > 0) {
        console.log('-------------')
        console.log(surely)
        for (const surelyPoint of surely) {
            original_problem[surelyPoint.x][surelyPoint.y] = surelyPoint.value
            maybe.update(surelyPoint)
        }
        // console.log('-------------', maybe.getTableMap())
        surely = maybe.getSurely()
    }
    console.log('-------------')
    console.log(maybe.getTableMap())
    if (isProblemSolved(original_problem)) {
        console.log("Problem solved")
        isAnswerCorrect(original_problem) ? console.log('Answer correct') : console.log('Answer wrong')
    } else {
        console.log("Problem NOT solved.")
        console.log(original_problem)
        console.log("Let's try some case:")
        maybe.tableMap[0][3] = new Set([7])
        maybe.tableMap[1][0] = new Set([8])
        let surely = maybe.getSurely()
        while (surely.size > 0) {
            console.log('-------------')
            console.log(surely)
            for (const surelyPoint of surely) {
                original_problem[surelyPoint.x][surelyPoint.y] = surelyPoint.value
                maybe.update(surelyPoint)
            }
            // console.log('-------------', maybe.getTableMap())
            surely = maybe.getSurely()
        }
        console.log('-------------')
        console.log(maybe.getTableMap())
        isAnswerCorrect(original_problem) ? console.log('Answer correct') : console.log('Answer wrong')
    }
    return original_problem
}

function isProblemSolved(original_problem) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (original_problem[i][j] == 0) {
                return false
            }
        }
    }
    return true
}

function isAnswerCorrect(original_problem) {
    // x-axias
    for (let i = 0; i < 9; i++) {
        const resSet = new Set()
        for (let j = 0; j < 9; j++) {
            if (original_problem[i][j] <= 0 || original_problem[i][j] > 9) {
                return false
            }
            if (resSet.has(original_problem[i][j])) {
                return false
            }
            resSet.add(original_problem[i][j])
        }
    }
    // y-axias
    for (let j = 0; j < 9; j++) {
        const resSet = new Set()
        for (let i = 0; i < 9; i++) {
            if (original_problem[i][j] <= 0 || original_problem[i][j] > 9) {
                return false
            }
            if (resSet.has(original_problem[i][j])) {
                return false
            }
            resSet.add(original_problem[i][j])
        }
    }
    // 3*3
    for (let region_i = 0; region_i < 3; region_i++) {
        for (let region_j = 0; region_j < 3; region_j++) {
            const resSet = new Set()
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    const v = original_problem[region_i * 3 + i][region_j * 3 + j]
                    if (v <= 0 || v > 9) {
                        return false
                    }
                    if (resSet.has(v)) {
                        return false
                    }
                    resSet.add(v)
                }
            }
        }
    }
    return true
}

function getRegionBeginPoint(x) {
    // 012->0:3 
    // 345->3:6
    if (x >= 0 && x < 3) {
        return 0
    } else if (x >= 3 && x < 6) {
        return 3
    } else if (x >= 6 && x < 9) {
        return 6
    } else {
        throw new Error('wrong index')
    }
}

// console.log(original_problem)

// const answer = solve_sudoku(original_problem)

// console.log(answer)

function update(table, point) {
    const retTable = deepcopy(table)
    const possibleValueArryOfOnePoint = []
    if (point) {
        retTable[point.x][point.y] = point.value
    }
    const sudo = new Sudo(retTable)
    sudo.update()
    const status = sudo.getStatus()
    if (status != 1) {
        return { table: retTable, possibleValueArryOfOnePoint: [], status: status }
    }
    let min = 9
    let x = 0
    let y = 0
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const size = sudo.possibleSet[i][j].size
            if (size == 0) {
                continue
            }
            if (size < min) {
                min = size
                x = i
                y = j
            }
        }
    }
    if (min != 9) {
        for (const value of sudo.possibleSet[x][y]) {
            possibleValueArryOfOnePoint.push({ x: x, y: y, value: value })
        }
    }
    return { table: retTable, possibleValueArryOfOnePoint: possibleValueArryOfOnePoint, status: 1 }
}

// /**
//  * @return 0: finish and is a correct answer; 1: not finished, but reasonable till now; -1: wrong status can not be solved;
//  * @param {[]} table 
//  */
// function getStatus(table) {
//     return 0
// }

function tryOne(table, possibleValueArryOfOnePoint) {
    console.log('current table is: ')
    console.log(table)
    console.log('possibleValueArryOfOnePoint is: ')
    console.log(possibleValueArryOfOnePoint)
    let res
    for (const point of possibleValueArryOfOnePoint) {
        res = update(table, point)
        if (res.status == 0) {
            return { answer: res.table, status: 0 }
        } else if (res.status == -1) {
            continue
        } else if (res.status == 1) {
            const tmpRes = tryOne(res.table, res.possibleValueArryOfOnePoint)
            if (tmpRes.status == 0) {
                return tmpRes
            }
        }
    }
    return { status: -1 }
}

function findAll(table, possibleValueArryOfOnePoint) {
    // console.log('current table is: ')
    // console.log(table)
    // console.log('possibleValueArryOfOnePoint is: ')
    // console.log(possibleValueArryOfOnePoint)
    const result = []
    for (const point of possibleValueArryOfOnePoint) {
        let res = update(table, point)
        if (res.status == 0) {
            console.log(res.table)
            // console.log(Buffer.from(res.table))
            fs.appendFileSync(resultFileNam, JSON.stringify(res.table) + ',\n')
            // ws.write(JSON.stringify(res.table))
            result.push(res.table)
        } else if (res.status == -1) {
            continue
        } else if (res.status == 1) {
            const tmpRes = findAll(res.table, res.possibleValueArryOfOnePoint)
            if (tmpRes.length != 0) {
                result.push(tmpRes)
            }
        }
    }
    return result
}

function solve(problem) {
    const res = update(problem)
    if (res.status == 0) {
        return res.table
    } else if (res.status == -1) {
        throw new Error('Problem can not be solved')
    } else if (res.status == 1) {
        return tryOne(res.table, res.possibleValueArryOfOnePoint)
    }
}

function findAllSolutionsForStandard(problem) {
    fs.appendFileSync(resultFileNam, '[\n')
    const res = update(problem)
    if (res.status == 0) {
        return res.table
    } else if (res.status == -1) {
        throw new Error('Problem can not be solved')
    }
    findAll(res.table, res.possibleValueArryOfOnePoint)
    fs.appendFileSync(resultFileNam, ']\n')
}

function findAllSolutions(problem) {
    const res = update(problem)
    if (res.status == 0) {
        return res.table
    } else if (res.status == -1) {
        throw new Error('Problem can not be solved')
    }
    return findAll(res.table, res.possibleValueArryOfOnePoint)
}

function convertText2Problem(t) {
    const reg = /(\|(\s[\d,\.]){3}\s){3}/g
    let ret = t.replace(/\./g, '0').match(reg)
    return ret.map(lineStr => {
        const ret = []
        for (const digital of lineStr.replace(/\s|\|/g, '')) {
            ret.push(parseInt(digital))
        }
        return ret
    })
}

function deepcopy(obj) {
    const out = [];
    for (let i = 0; i < obj.length; i++) {
        out[i] = obj[i] instanceof Array ? deepcopy(obj[i]) : obj[i]
    }
    return out;
}

function start(original_problem) {
    console.log('Question is:')
    console.log(original_problem)
    const answer = findAllSolutionsForStandard(original_problem)
    // const answer = solve(original_problem)
    console.log('Answer is:')
    console.log(answer)
}
function startText(text) {
    const problem = convertText2Problem(text)
    start(problem)
}

start(original_problem)
// startText(`



// randomly generated - fiendish

// +-------+-------+-------+       k
// | 2 1 . | . 9 6 | . . 3 |     h   l move cursor
// | . . . | 7 . . | 1 . 6 |       j
// Rules:                     | . . . | . 5 . | . . . |      1-9  place digit
// +-------+-------+-------+      0 .  clear digit
// Fill the grid so that     | . 7 . | 2 . . | . 5 . |       c   clear board
// every column, row and     | . . 4 | . . . | 9 . . |       f   fix squares
// 3x3 box contains each     | . 8 . | . . 1 | . 2 . |       n   new board
// of the digits 1 to 9.     +-------+-------+-------+       q   quit game
// | . . . | . 4 . | . . . |       s   save
// | 8 . 3 | . . 7 | . . . |       r   restart
// | 7 . . | 3 6 . | . 9 1 |       u   undo last move
// +-------+-------+-------+       v   solve
//                                 ?   request hint
// Su-Do-Ku by Michael Kennett



// `)
