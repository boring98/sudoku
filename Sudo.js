//@ts-check

const Region = require('./Region')

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

module.exports = Sudo