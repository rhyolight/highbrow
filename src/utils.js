/**
 * @ignore Just a counter loop, including iterator.
 */
const times = n => f => {
    let iter = i => {
        if (i === n) return
        f (i)
        iter (i + 1)
    }
    return iter (0)
}

module.exports = {times}
