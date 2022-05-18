const fs = require('fs');
const lpcmRecorder = require('node-record-lpcm16')
const ffmpeg = require('fluent-ffmpeg');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const WAV_FILENAME = 'test.wav'

module.exports = (() => {

    const recordSample = async (filename) => {
        console.log('Starting the recording');
        fs.openSync(filename, 'w')
        const file = fs.createWriteStream(filename, {encoding: 'binary'});
        const recording = lpcmRecorder.record();

        recording.stream().pipe(file);
        await sleep(10000);
        recording.stop();
    };

    const convertToMp3 = async (input, output) => {
        return new Promise((resolve, reject) => {
            console.log('Converting wav to mp3');
            ffmpeg(input)
                .toFormat('mp3')
                .on('end', resolve)
                .on('error', (err) => {
                    console.log('Processing failed!');
                    return reject(new Error(err));
                })
                .save(output);
        })
    };

    const recordMp3Sample = async (filename) => {
        await recordSample(WAV_FILENAME);
        await convertToMp3(WAV_FILENAME, filename);
    }

    return {recordMp3Sample};

})();