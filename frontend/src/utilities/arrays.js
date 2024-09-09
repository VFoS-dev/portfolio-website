export function randomIndex(array) {
    if (!array.length) return

    return array[Math.floor(Math.random() * array.length)]
}