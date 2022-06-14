exports = async function (request, response) {
    const filter = {date: {$gt: new Date(new Date().getTime() - 15 * 60000)}};
    const projection = {artist: 1, title: 1, _id: 0};

    const songsCollection = context.services.get("mongodb-atlas")
        .db("scaleup")
        .collection("songs");

    const docs = await songsCollection
        .find(filter, projection)
        .sort({date: -1})
        .limit(1)
        .toArray();

    const [latestSong] = docs;
    response.setBody(latestSong);
};