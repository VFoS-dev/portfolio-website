function env(check, fallback) {
    if (!process.env[check]) {
        console.warn(`⚠️  Environment variable "${check}" was not found, using fallback: "${fallback}"`)
        return fallback;
    }
    return process.env[check]
}

module.exports = {
    env
}