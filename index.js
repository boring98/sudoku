//@ts-check

const fs = require('fs')
const Region = require('./Region')
const Sudo = require('./Sudo')

const resultFileNam = 'standard_result.txt'

// const ws = fs.createWriteStream('./standard_result.txt')

// const original_problem = [
//     [1, 2, 3, 4, 5, 6, 7, 8, 9],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
// ]
const original_problem = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9], [4, 5, 6, 7, 8, 9, 1, 2, 3], [7, 8, 9, 1, 2, 3, 4, 5, 6], [2, 3, 1, 6, 9, 4, 8, 7, 5], [5, 6, 4, 8, 1, 7, 3, 9, 2], [9, 7, 8, 2, 3, 5, 6, 1, 4], [6, 4, 2, 5, 7, 1, 9, 3, 8], [8, 9, 7, 3, 6, 2, 5, 4, 1], [3, 1, 5, 9, 4, 8, 2, 6, 7]
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

function findAllSolutionsWithoutRecursion() {
    const logPoint = 10000
    let sum = 0
    let timeInterval = Date.now()
    // fs.appendFileSync(resultFileNam, '[\n')

    const orignial_problem = [
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
    const sudo = new Sudo(orignial_problem)
    sudo.update()
    // console.log(sudo.possibleSet)
    const problem = sudo.tableMap

    const stack = [{ possibleSet: sudo.possibleSet[1][0], point: [1, 0] }]
    while (stack.length != 0) {
        const elem = stack[stack.length - 1]
        const [x, y] = elem.point
        if (elem.possibleSet.size == 0) {
            problem[x][y] = 0
            stack.pop()
            continue
        }
        const value = [...elem.possibleSet][0]
        elem.possibleSet.delete(value)
        // const problem = deepcopy(elem.problem)
        problem[x][y] = value
        if (x == 8 && y == 8) {
            // console.log(sum)
            sum++
            if (sum % logPoint == 0) {
                console.log(`count: ${sum}`)
                console.log(`time cost(ms/${logPoint}): ${Date.now() - timeInterval}`)
                console.log(problem)
                timeInterval = Date.now()
            }
            // fs.appendFileSync(resultFileNam, JSON.stringify(problem) + ',\n')
            problem[x][y] = 0
            stack.pop()
            continue
        }
        const [next_x, next_y] = getNextPoint(x, y)
        const possibleSet = getPossibleValueByPoint(problem, next_x, next_y)
        if (possibleSet.size == 0) {
            continue
        }
        stack.push({ possibleSet: possibleSet, point: [next_x, next_y] })
    }
}

function findAllSolutionsWithoutRecursionBak() {
    let sum = 0
    let floorSum = 0
    let timeInterval = Date.now()
    // fs.appendFileSync(resultFileNam, '[\n')

    const orignial_problem = [
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
    const sudo = new Sudo(orignial_problem)
    sudo.update()
    // console.log(sudo.possibleSet)

    const stack = [{ problem: sudo.tableMap, possibleSet: sudo.possibleSet[1][0], point: [1, 0] }]
    while (stack.length != 0) {
        const elem = stack[stack.length - 1]
        // console.log(elem)
        const [x, y] = elem.point
        if (elem.possibleSet.size == 0) {
            stack.pop()
            continue
        }
        const value = [...elem.possibleSet][0]
        elem.possibleSet.delete(value)
        const problem = deepcopy(elem.problem)
        problem[x][y] = value
        if (x == 8 && y == 8) {
            // console.log(problem)
            sum++
            if (Math.floor(sum / 10000) != floorSum) {
                floorSum = Math.floor(sum / 10000)
                console.log(`count: ${sum}`)
                console.log(`time cost(ms): ${Date.now() - timeInterval}`)
                console.log(problem)
                timeInterval = Date.now()
            }
            // fs.appendFileSync(resultFileNam, JSON.stringify(problem) + ',\n')
            stack.pop()
            continue
        }
        // const sudo = new Sudo(problem)
        // sudo.update()
        const [next_x, next_y] = getNextPoint(x, y)
        const possibleSet = getPossibleValueByPoint(problem, next_x, next_y)
        // const possibleSet = sudo.possibleSet[next_x][next_y]
        if (possibleSet.size == 0) {
            continue
        }
        stack.push({ problem: problem, possibleSet: possibleSet, point: [next_x, next_y] })
    }
    // fs.appendFileSync(resultFileNam, ']\n')
}

function getPossibleValueByPoint(problem, x, y) {
    if (problem[x][y] != 0) {
        return new Set([problem[x][y]])
    }
    const s = new Set(Array.from({ length: 9 }, (v, k) => { return k + 1 }))
    for (const regionIndex of getRegionIndexArrWherePointIn(x, y)) {
        for (const [i, j] of new Region(regionIndex)) {
            if ((regionIndex < 9 && j > y) || (regionIndex >= 9 && regionIndex < 18 && i > x) || (regionIndex >= 18 && (i > x || (i == x && j > y)) )){
                break
            }
            s.delete(problem[i][j])
        }
    }
    return s
}

function getNextPoint(x, y) {
    return y < 8 ? [x, y + 1] : [x + 1, 0]
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

function getRegionIndexArrWherePointIn(x, y) {
    return [x, 9 + y, 18 + Math.floor(x / 3) * 3 + Math.floor(y / 3)]
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
    // const answer = findAllSolutionsForStandard(original_problem)
    const answer = solve(original_problem)
    console.log('Answer is:')
    console.log(answer)
}

function startText(text) {
    const problem = convertText2Problem(text)
    start(problem)
}

findAllSolutionsWithoutRecursion()
// start(original_problem)
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
