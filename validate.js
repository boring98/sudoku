const fs = require('fs')
const readline = require('readline')
const Sudo = require('./Sudo')

module.exports = function validateAnswersFromFile(fileName, callback) {
    let myError = null
    let lineNumber = 0
    const rl = readline.createInterface({
        input: fs.createReadStream(fileName)
    })

    rl.on('line', (line) => {
        try {
            lineNumber++
            const problem = JSON.parse(line.slice(0, line.length - 1))
            // console.log(problem)
            const sudo = new Sudo(problem)
            if (sudo.getStatus() != Sudo.Status.Correct) {
                throw new Error(`Validate failed at line ${lineNumber}`)
            }
        } catch (err) {
            myError = err
            rl.close()
        }
    })

    rl.on('close', () => {
        return callback(myError)
    })
}
