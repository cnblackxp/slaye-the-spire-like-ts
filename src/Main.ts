// import './style';

import { UIElements } from './UI';
import { EventManager } from './EventManager';
import { Player } from './Player';
import { Enemy } from './Enemy';
import { Game } from './Game';

let game: Game;

function startGame() {
  EventManager.removeEvents();

  const player = new Player();


  const enemies = [
    new Enemy(),
    new Enemy(),
    new Enemy(),
    // new Enemy(),
  ];
  
  game = new Game(player, ...enemies);
}

startGame();


UIElements.startGameButton.addEventListener('click', () => startGame());
UIElements.endTurnButton.addEventListener('click', () => game.endTurn());