/*
Author: Royal Cloud Solutions
Developed in cooperation with NTNU as a bachelor thesis.
Updated: 26.5.2020
Version 3.1

Creates a web hosting system and websocket connection.
Serves a web browser realtime IoT data.
Hosts on port 4000 if no environmental value is created.
Supports inclusion of files to be served (such as HTML, CSS, JS etc.)
*/

//const Joi = require('joi');                 //Joi allows for advanced debugging and error rules.
const express = require('express');         //Express is used to create the web host.
const path = require('path');               //Adding HTML Path functionalities needed to including HTML files.
const cp = require('child_process');        //The child_process module allows for connecting NodeJS processes.
const forked = cp.fork(`fireBaseLink.js`); //Initiating the link to the firebaseConnect JS file.
const app = express();                      //Initiating the web hosting.

//Enabling  serving of Json and static files through middleware
app.use(express.json()); //
app.use(express.static(path.join(__dirname, 'public')));

//Creating server with websocket
const server = require('http').createServer(app);
const io = require('socket.io')(server);         



//Function setup initial values from the channel to firebaselinks and post to socket
function initClientData(fireBaseData){
    // Get data from channel from FireBaselink
    forked.on('message', (msg) => { 
        fireBaseData[msg.id] = msg.data;
    });
    // Send data to socket on client when connection
    io.on('connection', (client) => {
        // Iterate through all the HTML-pages which contain sensor data from firebase, and transmit sensor data
        firebaseTypes.forEach(function(element, i) { 
            var id;
            console.log(element,id);
            if(element in fireBaseData){
                id = element;
            }else{
                id = 'default';
            }
            var emit_name = 'socketData_'+element;
            console.log("Initial gathering data from fireBaseLink at start");
            client.emit(emit_name, fireBaseData[id]);
        });
    });
    return fireBaseData;
}

// Function for updating sensor data to client, whenever new data in firebase detected
function updateClientData(fireBaseData){
    // Set up connection to client
    io.on('connection', (client) => {
        //Set up waiting on new data from firebaselink channel 
        forked.on('message', (msg) => {
            // Transmit new data to client iwhen received
            fireBaseData[msg.id] = msg.data;
            var emit_name = 'socketData_'+msg.id;
            console.log("Gathering data from fireBaseLink when changed");
            
            client.emit(emit_name, fireBaseData[msg.id]);
        });
    
        //Acknowledgement from web browser
        client.on('socketAck', (data) => {
            console.log(data);
        });
    });
    return fireBaseData;
}


// Function for creating the web page specific content,
// and defining the route (URL) that the request and response will answer to.
function setUpHost(){
    app.get('/',function(req,res){
        res.sendFile(path.join(__dirname+'/index.html'));
    });
    
    app.get('/webToFirebase',function(req,res){
        res.sendFile(path.join(__dirname+'/webToFirebase/index.html'));
    });
    
    app.get('/api/kontoretTilArne', (req, res) => {
        res.sendFile(__dirname + '/kontoretTilArne.html');
    });
    
    app.get('/api/ntnuGateway08', (req, res) => {
        res.sendFile(__dirname + '/ntnuGateway08.html');
    });
}
// Function to setup port to be used by the webpage
function setUpPort(port){ 
    server.listen(port, () => console.log(`Listening on port ${port}...`));
}

//Environmental value, if no value read 4000.
const port = process.env.PORT || 4000; 
const firebaseTypes = ['kontoretTilArne', 'ntnuGateway08'];
var fireBaseData = {'default': {'Loading':'...'}};

// Find initial value from sensor which will be used on the webpage
fireBaseData = initClientData(fireBaseData);
// Setup host of webpage
setUpHost();
// Setup port to be used by the webpage
setUpPort(port);
// Update data on webpage if any sensor value changes on firebase
fireBaseData = updateClientData(fireBaseData);




