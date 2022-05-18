const CronJob = require('cron').CronJob;
const mongodbRepository = require('./mongoRepository');
const pulseaudio = require('./pulseaudio');
const recorder = require('./recorder');
const musicIdentify = require('./musicIdentify');
const retry = require('./retry');

const TEMP_FILE_NAME = 'test.mp3';

(async () => {
    console.log('Starting app!');
    const repository = await mongodbRepository();

    const recognizeSong = async () => {
        pulseaudio.reload();

        const response = await retry(
            async () => {
                await recorder.recordMp3Sample(TEMP_FILE_NAME)
                return await musicIdentify.identifySong(TEMP_FILE_NAME)
            },
            (resp) => resp.identified
        );

        if (response && response.identified) {
            await repository.insertSong(response.data)
        } else {
            console.log('Could not identify the song. Skipping.')
        }
    };

    const songRecognitionJob = new CronJob('*/5 7-16 * * 1-5',
        async () => {
            console.log('=========================');
            try {
                await recognizeSong();
            } catch (err) {
                console.log('Error ' + err);
            }
        });

    const heartbeatJob = new CronJob('*/10 * * * *',
        async () => {
            try {
                await repository.heartbeat();
            } catch (err) {
                console.log('Error ' + err);
            }
        });

    songRecognitionJob.start();
    heartbeatJob.start();
})();
