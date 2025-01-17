import { Server, Socket } from 'socket.io';
import prisma from '../config/prisma';

export default (io: Server) => {
  io.on('connection', (socket: Socket) => {
    socket.on('join', (roomId: string) => {
      socket.join(roomId);
    });
       
    socket.on('message', async (data) => {
      const { content, senderId, recipientId, groupId, fileUrl, fileType } = data;
      
    }); 

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};


