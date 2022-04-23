import { Game } from "./Game";
import { Utils } from "./Utils";

// interface IParticipant

const log = Utils.consoleLogger('Participant', '#FF00FF')

export class Participant {
  name: string;
  hp: number;
  maxHp: number;
  defense: number = 0;
  game: Game;
  log: Function;

  keepDefense: boolean = false;

  initialize() {
    this.log(`Initialize`);
  }

  setGame(game: Game) {
    this.game = game;
  }

  startTurn() {
    this.log(`start turn`);
    if (!this.keepDefense) {
      this.defense = 0;
    }
  }

  damage(value: number) {
    if (this.defense >= value) {
      this.defense -= value;
      value = 0;
    } else {
      value -= this.defense;
      this.defense = 0;
    }
    this.hp -= value;
  }


  endTurn() {
    this.log(`end turn`);
  }


  updateUI() {
    log(this.name, 'updated ui');
  }
}