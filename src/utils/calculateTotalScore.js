import { getGameAssets } from '../init/assets.js';

// 스테이지 지속 시간을 기반으로 총 점수를 계산하는 함수다.
const calculateTotalScore = (stages, gameEndTime, isMoveStage) => {
  let totalScore = 0;

  const { stages: stageData } = getGameAssets();
    

  stages.forEach((stage, index) => {
    let stageEndTime;
    if (index === stages.length - 1) {
      // 마지막 스테이지의 경우 종료 시간이 게임의 종료 시간이다.
      stageEndTime = gameEndTime;
    } else {
      // 다음 스테이지의 시작 시간을 현재 스테이지의 종료 시간으로 사용한다.
      stageEndTime = stages[index + 1].timestamp;
    }
    let stageDuration = (stageEndTime - stage.timestamp) / 1000; // 스테이지의 지속 시간 (초 단위로)

    // 현재 스테이지의 scorePerSecond 를 가져온다.
    const stageInfo = stageTable.find((s) => s.id === stage.id);
    const scorePerSecond = stageInfo ? stageInfo.scorePerSecond : 1;

    if (!isMoveStage && index === stages.length - 1) {
      // 마지막 스테이지의 경우 버림 처리 한다.
      console.log(stageDuration);
      console.log(`gameEndTime: ${gameEndTime}`);
      console.log(`stage: ${stage.timestamp}`);
      stageDuration = Math.floor(stageDuration);
    } else {
      // 중간 스테이지의 경우 반올림으로 처리 한다.
      stageDuration = Math.round(stageDuration);
    }

    totalScore += stageDuration * scorePerSecond; // 각 스테이지의 scorePerSecond 를 반영하여 점수를 계산한다.
  });

  return totalScore;
};

export default calculateTotalScore;