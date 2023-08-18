export function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function createKey(currentkeys = []) {
    var l = "abcdefghijklmnopqurstuvwyz"
    var key = [...l].map(a => l[Math.floor(Math.random() * l.length)]).join("")
    return !currentkeys.includes(key) ? key : createKey(currentkeys)
}