const validate = require('./validate')
validate('./result.txt', (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log('validate OK')
    }
})