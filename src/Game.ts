import { Enemy } from "./Enemy";
import { EventManager } from "./EventManager";
import { Participant } from "./Participant";
import { Player } from "./Player";
import { UI, UIElements } from "./UI";

export enum GameState {
  WAIT_FOR_ACTION,
  SELECT_TARGET,
  ENEMY_TURN,
  ENDED,
}


export class Game {
  player: Player;
  enemies: Array<Enemy>;
  gameState: GameState;

  participants: Array<Participant>


  constructor(player: Player, ...enemies: Array<Enemy>) {
    this.player = player;
    this.enemies = enemies;
    this.participants = [ player, ...enemies ];
    
    this.gameState = GameState.WAIT_FOR_ACTION;

    this.initialize();
    UI.log('Game started');
  }

  initialize() {
    EventManager.addEvent('onclickcard', (event: any) => {
      this.player.play(event.detail.index);
    });


    this.gameState = GameState.WAIT_FOR_ACTION;
    this.participants.forEach(participant => {
      participant.setGame(this);
      participant.initialize();
    });
    this.enemies.forEach((enemy, index) => enemy.setIndex(index));
    this.renderEnemies();
    this.updateUI();
  }

  renderEnemies() {
    UIElements.enemiesContainer.innerHTML = '';
    this.enemies.forEach(enemy => {
      UIElements.enemiesContainer.innerHTML += enemy.renderEnemy();
    });

    this.updateUI();
  }

  updateUI() {
    this.participants.forEach(participants => participants.updateUI());
  }

  setState(newState: GameState) {
    if (this.gameState !== GameState.ENDED) {
      UI.log(`Game State = ${GameState[newState]}`)
      this.gameState = newState;
    }
  }

  endTurn() {
    if (this.gameState !== GameState.WAIT_FOR_ACTION) return;


    this.player.endTurn();
    this.updateUI();
    this.setState(GameState.ENEMY_TURN)
    UI.log('enemies turn');
    this.startEnemyTurn(0);

  }

  startEnemyTurn(index: number) {
    const checkNextTurn = () => {
      if (this.gameState === GameState.ENDED) return;
      if (index < this.enemies.length - 1) { // there are still enemies
        this.startEnemyTurn(index + 1);
      } else {
        this.startPlayerTurn();
      }
    }

    const enemy = this.enemies[index];
    if (enemy.hp <= 0) {
      enemy.intent = '';
      UI.log(`${enemy.name} ${index} is dead`);
      checkNextTurn();
      return;
    }

    setTimeout(() => {
      enemy.startTurn();
      enemy.endTurn();
      this.updateUI();
      checkNextTurn();
    }, 500);
  }

  startPlayerTurn() {
    setTimeout(() => {
      this.setState(GameState.WAIT_FOR_ACTION)
      UI.log('player turn');
      this.player.startTurn();
    }, 500);
  }

  checkWinner() {
    if (this.player.hp <= 0) {
      this.gameState = GameState.ENDED;
      UI.log(`<b class="red">YOU LOSE</b>`)
    }

    const areEnemiesDead = this.enemies.every((enemy) => enemy.hp <= 0);
    if (areEnemiesDead) {
      this.gameState = GameState.ENDED;
      UI.log(`<b class="blue">YOU WIN!!!!</b>`)
    }

    if (this.gameState === GameState.ENDED) {
      this.player.discardAllCards();
    }
  }


}