const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');

const MUSIC_IDENTIFY_URL = 'https://music-identify.p.rapidapi.com/identify';

const key = '{MUSIC IDENTIFY API KEY}';

const formData = filename => {
    const formData = new FormData();
    formData.append('file', fs.readFileSync(filename), filename);
    return formData;
};

const options = (key, form) => ({
    headers: {
        'x-rapidapi-host': 'music-identify.p.rapidapi.com',
        'x-rapidapi-key': key,
        ...form.getHeaders()
    },
});

const identifySong = async (filename) => {
    console.log('Looking for a song');
    const form = formData(filename);
    const response = await axios.post(MUSIC_IDENTIFY_URL, form.getBuffer(), options(key, form));

    return response.data;
};

module.exports = {identifySong}