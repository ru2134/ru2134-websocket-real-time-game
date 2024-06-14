import { gameEnd, gameStart } from "./game.handler.js";
import { moveStageHandler } from "./stage.handler.js";
import { acquireItemHandler } from './item.handler.js';


const handlerMappings ={
    2: gameStart,
    3: gameEnd,
    11: moveStageHandler,
    21: acquireItemHandler,
};

export default handlerMappings