import { UI } from './UI';
import { EventManager } from './EventManager'
import { Game, GameState } from './Game'
import { Enemy } from './Enemy';

enum CardCategory {
  ATTACK,
  SKILL
}


type TargetCallback = (target: Enemy) => void;


export class Card {
  id: string;
  category: CardCategory;
  title: string;
  description: string;
  cost: number = 0;
  value: number = 0;

  needsTarget: boolean = false;
  exhausted: boolean = false;

  game: Game;

  eventIndex: number;

  constructor() {
    this.id = null;
    this.category = null;
    this.title = null;
    this.description = null;
    this.cost = 0;
    this.value = 0;
    // this.additionalEffects = {};
    this.needsTarget = false;

    this.game = null;
  }

  setId(id: string) {
    this.id = id;
  }

  selectTarget(callback: TargetCallback) {
    this.game.setState(GameState.SELECT_TARGET);
    if (!this.eventIndex) {
      this.eventIndex = EventManager.addEvent('onclickenemy', (event: CustomEvent) => {
        const { index } = event.detail;
        const target = this.game.enemies[index];

        if (target.hp <= 0) {
          UI.log(`enemy is already DEAD`);
          return;
        }
        

        this.game.setState(GameState.WAIT_FOR_ACTION);
        // card effect callback
        callback(target);

        EventManager.removeEvent(this.eventIndex);
        this.eventIndex = undefined;
      });
    }
  }

  attack(target: Enemy = null) {
    if (target) {
      target.damage(this.value);
    } else {
      // no target
      // all enemies
      this.game.enemies.forEach(enemy => enemy.damage(this.value));
    }
    this.game.checkWinner();
    this.game.updateUI();
    UI.log(`played attack card`);
  }

  skill() {
    // implement here
    UI.log(`played skil card`);
  }

  play() {

    

    switch(this.category) {
      case CardCategory.ATTACK:
        if (this.needsTarget) {
          this.selectTarget((target) => {
            this.attack(target);
          })
        } else {
          this.attack();
        }
        break;
      case CardCategory.SKILL:
        this.skill();
        break;
    }
  }

  // use(player, target) {

  // }

  // onCallback() {

  // }

  renderCard(index: number) {
    return `<div class="card" id="card_name_{position}">
      <div class="card-title">${this.title} (<span class="card-mp">${this.cost}</span>)</div>
      <div class="card-description">${this.description}</div>
      <div>
        <button onclick="window.dispatchEvent(new CustomEvent('onclickcard', {detail: {index: ${index}}}))">Play</button>
      </div>
    </div>`;
  }
}


// ===================================================================================================
// ATTACK CARDS
export class StrikeCard extends Card {
  constructor() {
    super();
    this.category = CardCategory.ATTACK;
    this.title = 'Strike';
    this.value = 6;
    this.description = `Damage the enemy by ${this.value}`;
    this.cost = 1;
    this.needsTarget = true;
  }
}

export class AttackAllCard extends Card {
  constructor() {
    super();
    this.category = CardCategory.ATTACK;
    this.title = 'Strike All';
    this.value = 3;
    this.description = `Damage all enemies by ${this.value}`;
    this.cost = 1;
  }
}

export class AnnihilationCard extends Card {
  constructor() {
    super();
    this.category = CardCategory.ATTACK;
    this.title = 'Annihilation';
    this.value = 6;
    this.description = `Damage all enemies by ${this.value}`;
    this.cost = 2;
    this.exhausted = true;
  }
}


// ===================================================================================================
// SKILL CARDS
export class DefenseCard extends Card {
  constructor() {
    super();
    this.category = CardCategory.SKILL;
    this.title = 'Defense';
    this.value = 6;
    this.description = `Build up ${this.value} Defense`;
    this.cost = 1;
  }

  skill() {
    super.skill();
    const player = this.game.player;
    player.defense += this.value;
  } 
}

export class KeepDefenseCard extends Card {
  constructor() {
    super();
    this.category = CardCategory.SKILL;
    this.title = 'Keep Defense';
    // this.value = 6;
    this.description = `Defense isn't removed on the start of your turn`;
    this.cost = 2;
    this.exhausted = true;
  }

  skill() {
    super.skill();
    const player = this.game.player;
    player.keepDefense = true;
  } 
}



type CardComponent = {
  Component: { new(): Card },
  id: string,
} 

export const CardType: {[key: string]: CardComponent} = {
  STRIKE: {
    Component: StrikeCard,
    id: 'STRIKE',
  },
  DEFENSE: {
    Component: DefenseCard,
    id: 'DEFENSE',
  },
  KEEP_DEFENSE: {
    Component: KeepDefenseCard,
    id: 'KEEP_DEFENSE',
  },
  ATTACK_ALL_CARD: {
    Component: AttackAllCard,
    id: 'ATTACK_ALL_CARD'
  },
  ANNIHILATION_CARD: {
    Component: AnnihilationCard,
    id: 'ANNIHILATION_CARD'
  }
}


export const CardFactory = {
  build(cardId: string): Card {
    const card = new CardType[cardId].Component();
    card.setId(cardId);
    return card;
  }
}