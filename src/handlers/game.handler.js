import { getGameAssets } from '../init/assets.js';
import { clearStage, getStage, setStage } from '../models/stage.model.js';
import {
  createScoreRecord,
  getHighScoreRecord,
  getScoreRecord,
  setScoreRecord,
} from '../models/scoreRecord.model.js';

export const gameStart = (uuid, payload) => {
  // 서버 메모리에 있는 게임 애셋에서 stage 정보를 가지고 온다.
  const { stages } = getGameAssets();

  clearStage(uuid);

  // 기존 기록이 없으면 scoreRecord에 저장
  if (!getScoreRecord(uuid)) {
    console.log('기존 기록이 없어 점수를 초기화합니다.');
    createScoreRecord(uuid);
  }

  let highRecord = '';
  const highScoreRecord = getHighScoreRecord();
  if (highScoreRecord[0] === uuid) {
    highRecord = `현재 최고 점수에 도달하신 전적이 있습니다! ${highScoreRecord[1]}`;
  }

  // stage 배열에서 0번째 = 첫번째 스테이지의 ID를 해당 유저의 stage에 저장한다.
  setStage(uuid, stages.data[0].id, payload.timestamp);

  return { status: 'success', score: highScoreRecord[1], highRecord };
};

export const gameEnd = (uuid, payload) => {
  // 클라이언트에서 받은 게임 종료 시 타임스탬프와 총 점수
  const { timestamp: gameEndTime, score } = payload;
  const stages = getStage(uuid);

  console.log(payload);

  if (!stages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }

  // 기존 기록보다 클라이언트에서 제공한 점수가 높으면 점수 변경
  const highScore = getScoreRecord(uuid);
  if (highScore < Math.floor(score)) {
    setScoreRecord(uuid, Math.floor(score));
  }
  const highScoreRecord = getHighScoreRecord();
  console.log('최고 점수 확인', highScoreRecord);

  if (highScoreRecord[1] !== 0) {
    return {
      status: 'success',
      message: 'Game ended successfully',
      broadcast: highScoreRecord,
    };
  }

  return { status: 'success', message: 'Game ended successfully', score };
};