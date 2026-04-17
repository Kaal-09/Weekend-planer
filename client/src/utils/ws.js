import { io } from 'socket.io-client'

export function connectWS(userId){
    return io('http://localhost:8000', {
        query: { userId }
    });
}