//@ts-check
class Region1 {
    constructor(index) {
        this.index = index
        this.count = 0
    }
    *[Symbol.iterator]() {
        if (this.index < 9) {
            while (this.count < 9) {
                yield [this.index, this.count++]
            }
        } else if (this.index >= 9 && this.index < 18) {
            while (this.count < 9) {
                yield [this.count++, this.index - 9]
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

// const kk = new Region(8)
// for (const iter of kk) {
//     console.log(iter)
// }
// const r = new Region(16)
// for (const iter of r) {
//     console.log(iter)
// }
// const www = new Region(26)
// for (const iter of www) {
//     console.log(iter)
// }
// for (const iter of www) {
//     console.log(iter)
// }

// const s = new Set([2])
// console.log(s.values().next().value)

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

const text = `
+-------+-------+-------+       k
| . . . | . . . | . . . |     h   l move cursor
| . 6 . | 8 . 7 | . 1 . |       j
Rules:                     | . 8 2 | 6 . 1 | 5 7 . |      1-9  place digit
+-------+-------+-------+      0 .  clear digit
Fill the grid so that     | 7 . . | 2 . 3 | . . 1 |       c   clear board
every column, row and     | . . 6 | 7 . 4 | 8 . . |       f   fix squares
3x3 box contains each     | 3 . . | 1 . 9 | . . 5 |       n   new board
of the digits 1 to 9.     +-------+-------+-------+       q   quit game
| . 9 1 | 5 . 2 | 3 4 . |       s   save
| . 7 . | 3 . 6 | . 2 . |       r   restart
| . . . | . . . | . . . |       u   undo last move
+-------+-------+-------+       v   solve

`
// console.log(convertText2Problem(text))

// const s = new Set([1])
// console.log(s)

const Crypto = require('./Crypto')
const crypto = require('crypto');

function md5sum(password) {
    const md5 = crypto.createHash('md5');
    return md5.update(password).digest('hex');
}

const org = '147258'
const cry = new Crypto('aes-128-ecb', '0755821308331234')
// const en = cry.encrypt(org)
const de = cry.decrypt('Zok+Ff7+YiPY5vHb+ZAAQYqBj3SkZ+giM07kOin9HaSQKRa1rDrOHJnYhNiYnUv6he3L/kNQXORJkRilEz+JTuVJkM5SAmLEXZdZh6oOH+UkxJB/AEgzg+SZs/QhKIYb4F+HrZ9xjBQpH35/Nyub4g==')
console.log(de)
// console.log(md5sum('1620899823271936upload_f9646da4c78d6e0c3eeccefb07909022.jpg'))
// Zok+Ff7+YiPY5vHb+ZAAQWxNcxjzC+FQKgFaTdsqtfz1LoQM/teOxcLpqYcPactdxQy6k+5sXheoPbHucU5LMY1BBu2y4Zjk5YwpaWusmzymueQKCVXm1B72eSDmdxnMJ01q3QdpdH3h/A6mrUHekQ==
// Zok+Ff7+YiPY5vHb+ZAAQRhnyzuHa7Ky2fYRk6pEPBSHDrfqZv+HCcLiFPjZirqmsL2nVWiwdEuwqpxRsBjOZOurMTXBQshuKbHSdabhMRs=
// Zok+Ff7+YiPY5vHb+ZAAQXH9jy+AkqTmOKPO4KcUjOaWhe+EoDhnjbvWO3PKc3MJ8Nhe0YZ/YMq62WDAp/rL8+urMTXBQshuKbHSdabhMRs=
// F4pO6wMhEDZYOfbLtVMCXw==
// F4pO6wMhEDZYOfbLtVMCXw==