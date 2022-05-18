const execSync = require('child_process').execSync

const reload = () => {
    try {
        execSync('pulseaudio -L "module-sles-source" -D');
    } catch (err) {
        console.log(err);
        execSync('pulseaudio -k');
        execSync('pulseaudio -L "module-sles-source" -D');
    }
}

module.exports = {reload}