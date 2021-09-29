# BachelorThesis_NodeJS
This repository contains the backend/frontend NodeJS solution of a Bachelor Thesis.
It is created using JavaScript and is based on communication between Google Firebase and a NodeJS backend.

NodeJSestablished a web hosting system and a websocket connection between itself and a web page for realtime updates. NodeJS Interacts with Google Firebase in realtime fetching data which is relayed from a sensorsystem (Texas Instruments + ESP32 setup). It automatically updates the latest values with the HTTP GET method using callbacks. 
NodeJS Hosts on port 4000 if no environmental value is created and supports inclusion of files to be served (such as HTML, CSS, JS etc.)

Requirements:
<lo> 
  <li> NodeJS </li>
  <li> Google Firebase </li>
  <li> Varios NodeJS Modules (see includsion in code) </li>
</lo>
