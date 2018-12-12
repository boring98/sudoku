module.exports = class Region {
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