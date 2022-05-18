module.exports = async (fn, isSuccessFn) => {
    let done = false;
    let result;
    for (let i = 0; i < 3 && !done; i++) {
        try {
            result = await fn();
            done = isSuccessFn(result);
        } catch (err) {
            console.log(`Error: ${err}`);
        }
        if (!done) {
            console.log('Could not find song, retrying...')
        }
    }
    if (!done) {
        console.log('Retries failed. Identifying a song failed');
    }
    return result;
};