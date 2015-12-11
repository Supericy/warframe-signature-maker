var liveEvents = require('./live-events');

var findSignatureAndStats = function(userId, callback) {
	var MongoClient = require('mongodb').MongoClient;
	var dburl = 'mongodb://localhost:27017/test';

	MongoClient.connect(dburl, function(err, db) {
  		if(!err){
			var cursor = db.collection('users').find({"user_id":userId});
			cursor.toArray(function (err, result) {
				if(!err){
					if(result.length)
					{
						if(result[0].signature)
						{
							var results = result[0];
							var stats = {};
							if(results.kill){
					        		stats.kill = results.kill;
					        	}
				        	if(results.kill_grenade){
				        		stats.kill_grenade = results.kill_grenade;
				        	}
				        	if(results.kill_in_slide){
				        		stats.kill_in_slide = results.kill_in_slide;
				        	}
				        	if(results.kill_headshot){
				        		stats.kill_headshot = results.kill_headshot;
				        	}
				        	if(results.kill_melee){
				        		stats.kill_melee = results.kill_melee;
				        	}
				        	if(results.kill_headshot){
				        		stats.kill_headshot = results.kill_headshot;
				        	}
				        	if(results.defibrillator_kill){
				        		stats.defibrillator_kill = results.defibrillator_kill;
				        	}
				        	if(results.two_at_once_kill){
				        		stats.two_at_once_kill = results.two_at_once_kill;
				        	}
				        	db.close();
				        	callback(false, result[0].signature, stats);
						} else {
							db.close();
							callback(true, null, null);
						}
					} else {
						db.close();
						callback(true, null, null);
					}
				} else {
					db.close();
					callback(true, null, null);
				}
			}
		} else {
			db.close();
			callback(true, null, null);
		}
	}
};

function updateSignature(userId, signatureData, errorCallback){
	var MongoClient = require('mongodb').MongoClient;
	var url = 'mongodb://localhost:27017/test';

	MongoClient.connect(url, function(err,db)  {
		if(!err){
			console.log("Connected correctly to server.");
			dbManager.upsertSignature(userId,signatureData, db, function(err) {
				db.close();
				errorCallback(err);
			});
		} else {
			console.log(err);
			db.close();
			errorCallback(true);
		}
	});
}

var upsertSignature = function(userId, postData, db, callback) {
    db.collection('users').update(
        {"user_id": userId},
        {$set:{"signature":postData}},
        {upsert:true}, 
        function(err, result) {
	   		if(!err){
	    		console.log("Insert sucessful");
	    	}
    		callback(err);
  		}
  	);
};

var updateStats = function(userId, statName, callback) {

	var MongoClient = require('mongodb').MongoClient;
	var url = 'mongodb://localhost:27017/test';
	MongoClient.connect(url, function(err,db)  {
		if(!err){
			console.log("Connected correctly to server.");

			// log all events
			var event = {
				'user_id': queryObject.userId,
				'event_type': statName,
				'timestamp': Math.floor(Date.now() / 1000)
			}

			liveEvents.emitGameEvent(event);
			db.collection('events').insert(event);

			var obj = {};
			obj[statName] = 1 ;
		    db.collection('users').update(
		        {"user_id": userId},
		        {$inc:obj},
		        {upsert:true}, 
		        function(err, result) {
		    		if(!err){
		    		console.log("Insert sucessful");

		   			}
		   			db.close();
		    		callback(err);
		  		}
		  	);	
		} else {
			db.close();
			callback(err);			
		}
	});
};

exports.upsertStat = updateStats;
exports.upsertSignature = updateSignature;
exports.findSignature = findSignatureAndStats;
exports.findUsers = findUsers;
exports.insertUser = insertUser;

// not used atm

/*
var insertUser = function(db, postData, callback) {
   db.collection('users').insertOne( {
      //"username" : "SuperCoolGuy",
      "signature" : postData

   }, function(err, result) {
    if(!err){
    	console.log("Insert sucessful");
    }
    callback(result);
  });
};




var findUsers = function(db, callback) {
   var cursor = db.collection('users').find();
   callback(cursor);

};
*/
