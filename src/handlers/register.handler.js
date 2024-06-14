import { v4 as uuidv4 } from 'uuid';
import { addUser } from '../models/user.model.js';
import { handleConnection, handleDisconnect, handleEvent } from './helper.js';

const registerHandler = (io) => {
  io.on('connection', (socket) => {
    // 최초 커넥션을 맺은 이후 발생하는 각종 이벤트를 처리하는 곳입니다. 

    const userUUID = uuidv4(); // UUID 생성합니다. 
    addUser({ uuid: userUUID, socketId: socket.id }); // 사용자를 추가합니다.

    handleConnection(socket, userUUID);

    // 모든 서비스를 이벤트 처리 합니다. 
    socket.on('event', (data) => handleEvent(io, socket, data));
    // 접속 해제시 이벤트 처리 합니다. 
    socket.on('disconnect', () => handleDisconnect(socket, userUUID));
  });
};

export default registerHandler;