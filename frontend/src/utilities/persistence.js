export function shouldFetch(lastFetched) {
    const now = Date.now();
    const then = new Date(lastFetched).valueOf();
    const aDay = 1000 * 60 * 60 * 24;

    return now - aDay > then;
}