const mongodb = require('mongodb');

async function connectionHandler(collectionName){
    const client = await mongodb.MongoClient.connect(
        'mongodb+srv://mana62371:fKcTFjLXPzs0AGXH@cluster0-wmvec.mongodb.net/Project?retryWrites=true',{
            useNewUrlParser: true
        });
    return client;
}

module.exports.connectionHandler = connectionHandler