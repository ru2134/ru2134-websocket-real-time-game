import { getUsers, removeUser } from '../models/user.model.js';
import { CLIENT_VERSION } from '../constants.js';
import handlerMappings from './handlerMapping.js';
import { createStage } from '../models/stage.model.js';
import { createScoreRecord } from '../models/scoreRecord.model.js';
import { getHighScoreRecord } from '../models/scoreRecord.model.js';

export const handleConnection = (socket, userUUID) => {
  console.log(`user connected: ${userUUID} with socket ID ${socket.id}`);
  console.log('Current users:', getUsers());

  // 스테이지 빈 배열 생성
  createStage(userUUID);

  // 빈 최고 점수 기록 생성
  createScoreRecord(userUUID);

  // emit 메서드로 해당 유저에게 메시지를 전달할 수 있음
  // 현재의 경우 접속하고 나서 생성된 uuid를 바로 전달해줌
  socket.emit('connection', { uuid: userUUID });
};

export const handleDisconnect = (socket, uuid) => {
  removeUser(socket.id); // 사용자 삭제
  console.log(`User disconnected: ${socket.id}`);
  console.log('Current users:', getUsers());
};

// 유저의 모든 메시지를 받아 적절한 핸들러로 보내주는 이벤트 핸들러
export const handleEvent = (io, socket, data) => {
  // 클라이언트 버전 체크
  // 서버에 저장된 클라이언트 배열에서 메시지로 받은 clientVersion을 확인
  if (!CLIENT_VERSION.includes(data.clientVersion)) {
    // 일치하는 버전이 없을 시, response 이벤트로 fail 결과 전송
    socket.emit('response', { status: 'fail', message: 'Client version mismatch' });
    return;
  }

  // 핸들러 맵핑
  // 메시지로 오는 handlerId에 따라 handlerMappings 객체에서 적절한 핸들러 찾기
  const handler = handlerMappings[data.handlerId];
  // 적절한 핸들러가 없다면 실패처리
  if (!handler) {
    socket.emit('response', { status: 'fail', message: 'Handler not found' });
    return;
  }

  // 유저에게 메시지 전송
  // 적절한 핸들러에 userID와 payload를 전달하고 결과를 받음
  const response = handler(data.userId, data.payload);
  // 만약 결과에 broadcast(모든 유저에게 전달)가 있다면 broadcast
  if (response.broadcast) {
    io.emit('broadcast', response);
    return;
  }
  // 해당 유저에게 적절한 response 전달
  socket.emit('response', response);
};