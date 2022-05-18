const MongoClient = require('mongodb').MongoClient

const mongoConnectionString = '{MONGODB CONNECTION STRING}'

const mongoRepository = async () => {
    const client = await MongoClient.connect(mongoConnectionString, {useNewUrlParser: true, useUnifiedTopology: true});

    const insertSong = async (data) => {
        console.log(`Inserting song: ${data.artist} - ${data.title} to db`);
        const songsCollection = client.db('scaleup').collection('songs');
        await songsCollection.insertOne({...data, date: new Date()});
    };

    const heartbeat = async () => {
        console.log('Heartbeat...');
        await client.db('scaleup').collection('heartbeat').insertOne({date: new Date()});
    }

    return {insertSong, heartbeat};
}

module.exports = mongoRepository