/*
Author: Royal Cloud Solutions 2020
Developed in cooperation with NTNU as a bachelor thesis.
Updated: 26.5.2020
Version 9.5

Interacts with Google Firebase Realtime Database
Establishes a realtime connection at the desired dataPath to GET data.
Automatically updates the latest values with GET at any data update for the given child
Path controlls the selection child, if left empty all available data will be requested.
Only forwards data that is not undefined or void. 
*/

var firebase = require('firebase');      //Includes the firebase cloud functions, not priviledged.
const admin = require("firebase-admin");   //Includes auth and verification functionality, used for priviledges.
const serviceAccount = require('./firebase/serviceAccountKey.json');   //Offline Key. 

//Initiates the connection to firebase
firebase.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://frbasewebapprlcrowdsolutions20.firebaseio.com"
  });

console.log('Process startup');

//Requests data from firebase on callback, once and on every update.
//Handles response and makes response available for other processes.

// Transforms the name from firebase to a standard format
function processData(data){
    var dataPrettyfied = {};
    for(var key in data){
        var niceKey = JSON.stringify(key);
        niceKey = niceKey.match(/([A-Z]?[^A-Z]*)/g);
        
        if(niceKey.length > 1){
            niceKey = niceKey.join(' ');
        }
        niceKey = niceKey.toLowerCase().replace('"', '').replace('"', '');
        dataPrettyfied[niceKey] = data[key];
    }
    return dataPrettyfied;
}
function fetchData(dataPath) {
     firebase.database().ref("/" + dataPath).on('value',(snap)=>{
        console.log('Payload Requested...');
        if((snap.val() !== "undefined") && snap.val() !== "null"){
            
            console.log('Payload secured and formated!');
            
            var dataPrettyfied = processData(snap.val());
            
            var temp = {id:dataPath, data:dataPrettyfied};
            process.send(temp);
        }               
    });
}

fetchData("kontoretTilArne");
fetchData("ntnuGateway08");