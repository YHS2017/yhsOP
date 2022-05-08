import { io } from 'socket.io-client';

const socket = io('http://192.168.31.251:5000/');

export default socket;