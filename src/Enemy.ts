import { UI } from "./UI";
import { Utils } from "./Utils";
import { GameState } from "./Game";
import { Participant } from "./Participant";

const log = Utils.consoleLogger('Enemy', 'red');

enum IntentType {
  ATTACK,
  DEFENSE,
}

type Turn = {
  type: IntentType,
  value: number;
}

export class Enemy extends Participant {
  // enhance intent rendering
  intent: string = '';
  index: number = -1;
  turn: Turn;

  constructor() {
    super();
    this.name = "Bug"

    this.maxHp = 20;
    this.hp = this.maxHp;

    this.log = UI.logger('red', this.name);
  }

  setIndex(index: number) {
    this.index = index;
    this.name = `${this.name} ${index}`;
    this.log = UI.logger('red', this.name);
  }

  startTurn() {
    super.startTurn();

    switch(this.turn.type) {
      case IntentType.ATTACK:
        this.game.player.damage(this.turn.value);
        this.log(`damage player by ${this.turn.value}`);
        break;
      case IntentType.DEFENSE:
        this.defense = this.turn.value
        this.log(`got defense by ${this.turn.value}`);
        break;
    }
    
    this.game.checkWinner();
  }

  endTurn() {
    super.endTurn();
    if (this.game.gameState === GameState.ENDED) return;
    this.chooseIntent();
  }

  chooseIntent() {

    if (Math.random() > 0.3) {
      this.turn = {
        type: IntentType.ATTACK,
        value: Utils.getRandomInt(5,7)
      }
    } else {
      this.turn = {
        type: IntentType.DEFENSE,
        value: Utils.getRandomInt(2,5)
      }
    }

    this.intent = `${IntentType[this.turn.type]} ${this.turn.value}`;
    this.log(`chose ${this.index} intent (${this.intent})`);

    
    this.updateUI();
  }

  initialize() {
    super.initialize();
    this.chooseIntent();
  }

  updateUI() {
    super.updateUI();
    if (document.getElementById(`enemy-info-${this.index}`)) {
      document.getElementById(`enemy-hp-${this.index}`).innerHTML = `${this.hp} / ${this.maxHp}`;
      document.getElementById(`enemy-defense-${this.index}`).innerHTML = `${this.defense}`;
      document.getElementById(`enemy-intent-${this.index}`).innerHTML = this.intent;

      if (this.hp <= 0) {
        document.getElementById(`enemy-info-${this.index}`).classList.add('dead');
      }
    }
  }

  renderEnemy() {
    log('render enemy');
    return `<div class="enemy-info" id="enemy-info-${this.index}" data-index="${this.index}" onclick="window.dispatchEvent(new CustomEvent('onclickenemy', {detail: {index: ${this.index}}}))">
      <div>${this.name}</div>
      <div>hp <span id="enemy-hp-${this.index}">${this.hp} / ${this.maxHp}</span></div>
      <div>defense <span id="enemy-defense-${this.index}">${this.defense}</span></div>
      <div>intent (<span id="enemy-intent-${this.index}">${this.intent}</span>)</div>
    </div>`;
  }
}