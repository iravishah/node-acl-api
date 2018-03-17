const mongoose    = require('mongoose');
const db          = mongoose.connection;

module.exports = {
    connect : function(cb){

    	const uriStr = `mongodb://${config.mongo.username}:${config.mongo.password}@${config.mongo.host}:${config.mongo.port}/${config.mongo.database}`
    	console.log(uriStr);
        mongoose.connect(uriStr, function(err){
            if(typeof(cb) === "function"){
                cb(err);
            }
            if(err){
                console.error('Error in Mongo DB connection', err);
            }
        });
        db.on('connecting', function() {
            console.log('connecting to Mongo DB...');
        });

        db.on('error', function(error) {
            console.error('Error in Mongo DB connection: ' + error);
            //mongoose.disconnect();
        });
        db.on('connected', function() {
            console.log('Mongo DB connected!');
        });
        db.once('open', function() {
            console.log('Mongo DB connection opened!');
        });
        db.on('reconnected', function () {
            console.log('Mongo DB reconnected!');
        });
        db.on('disconnected', function() {
            console.error('Mongo DB disconnected!');
            //mongoose.connect(uriStr, opts);
        });


        return mongoose;
    }
};
