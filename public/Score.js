import { sendEvent } from './Socket.js';
import stages from './assets/stage.json' with { type: 'json' };
import items from './assets/item.json' with { type: 'json' };

class Score {
  static highScore = 0;
  score = 0;
  HIGH_SCORE_KEY = 'highScore';
  stageChange = true;
  stageLevel = 0;
  currentStageId = 1000;
  targetStageId = 1001;
  scorePerSecond = 1;

  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
  }

  moveNextStage() {
    this.stageLevel++;
    console.log(`Stage Level : ${this.stageLevel}`);
    sendEvent(11, { currentStage: this.currentStageId, targetStage: this.targetStageId });
    this.currentStageId = this.targetStageId;
    this.targetStageId++;
  }

  update(deltaTime) {
    this.scorePerSecond = stages.data[this.stageLevel].scorePerSecond;
    this.score += deltaTime * 0.001 * this.scorePerSecond;

    const index = stages.data.findIndex((e) => e.id === this.targetStageId);
    const stageLength = stages.data.length;

    let nextStageScore = null;
    if (index === stageLength - 1) {
      this.stageChange = false;
    } else {
      nextStageScore = stages.data[index].score;
    }

    if (Math.floor(this.score) >= nextStageScore && this.stageChange) {
      this.moveNextStage();
    }
  }

  // 현재 스테이지 레벨 리턴
  getStageLevel() {
    return this.stageLevel;
  }

  getItem(itemId) {
    // 현재 점수에 아이템 획득 점수 추가
    const index = items.data.findIndex((e) => e.id === itemId);
    this.score += items.data[index].score;

    // 아이템 획득 시 서버에 메시지 전송
    sendEvent(21, {
      itemId,
      score: items.data[index].score,
      stageId: this.currentStageId,
      timestamp: Date.now(),
    });
  }

  reset() {
    this.score = 0;
  }

  static setHighScore(data) {
    Score.highScore = Math.floor(data);
  }

  static getHighScore() {
    return Score.highScore;
  }

  getScore() {
    return this.score;
  }

  draw() {
    const drawHighScore = Score.highScore;
    const y = 20 * this.scaleRatio;

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = '#525250';

    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const highScoreX = scoreX - 125 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = drawHighScore.toString().padStart(6, 0);

    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
  }
}

export default Score;
