import { writable } from 'svelte/store';

import WebSocket from 'isomorphic-ws';

export const messageStore = writable('');

export const loginDetails= writable();

export const roomDetails= writable();

export let leaveRoomDetails = writable();

const socket = new WebSocket('ws://localhost:3000/', 'my-protocol');

// Connection opened
socket.addEventListener('open', function (event) {
    console.log("It's open");
}); 

// Listen for messages
socket.addEventListener('message', function (event) {
    let data = JSON.parse(event.data); 
    if(data.action == 'login'){
        loginDetails.set(event.data);
    }else if(data.action == "joinRoom"){
        roomDetails.set(event.data);
    }else if(data.action == "sendMessage"){
        messageStore.set(event.data);
    }else if(data.action == "leaveRoom" ){
        leaveRoomDetails.set(event.data);
    }
});

export const checkLogin = (loginObj) => {
	if (socket.readyState <= 1) {
		socket.send(JSON.stringify(loginObj));
	}
}

export const createRoom = (roomData) => {
	if (socket.readyState <= 1) {
		socket.send(JSON.stringify(roomData));
	}
}

export const sendMessage = (message) => {
	if (socket.readyState <= 1) {
		socket.send(JSON.stringify(message));
	}
}