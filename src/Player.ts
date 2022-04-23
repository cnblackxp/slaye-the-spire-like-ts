import { UI, UIElements } from "./UI";
import { Card, CardType } from "./Card";
import { Utils } from "./Utils";
import { GameState } from "./Game";
import { CardFactory } from "./Card";
import { Participant } from "./Participant";

export class Player extends Participant {
  mp: number;
  maxMp: number;

  drawAmount: number;

  cards: Array<string> = [];
  deck: Array<string> = [];
  discard: Array<string> = [];
  exhaust: Array<string> = [];

  hand: Array<Card> = [];

  constructor() {
    super();

    this.name = 'Player';

    this.maxHp = 50;
    this.hp = this.maxHp;
    this.maxMp = 2;
    this.mp = this.maxMp;

    this.drawAmount = 3;

    this.cards = [
      CardType.KEEP_DEFENSE.id,
      CardType.ATTACK_ALL_CARD.id,
      CardType.ANNIHILATION_CARD.id,


      CardType.STRIKE.id,
      CardType.STRIKE.id,
      CardType.STRIKE.id,
      CardType.STRIKE.id,
      CardType.STRIKE.id,

      CardType.DEFENSE.id,
      CardType.DEFENSE.id,
      CardType.DEFENSE.id,
      CardType.DEFENSE.id,
      CardType.DEFENSE.id,
    ];


    this.log = UI.logger('blue', this.name);
  }

  initialize() {
    super.initialize();

    this.populateDeck();
    this.shuffleDeck();
    this.startTurn();
  }

  startTurn() {
    super.initialize();

    if (this.game.gameState === GameState.ENDED) return;

    this.mp = this.maxMp;

    this.drawCards();
    this.updateUI();
  }

  populateDeck() {
    this.deck = [...this.cards];
    this.log('populate deck');
  }

  shuffleDeck() {
    this.deck = Utils.shuffle(this.deck);
    this.log('shuffle deck');
  }

  shuffleDiscard() {
    this.discard = Utils.shuffle(this.discard);
    this.log('shuffle discard');
  }

  drawCards() {
    if (this.drawAmount > this.deck.length) {
      this.shuffleDiscard();
      this.deck = [...this.deck, ...this.discard];
      this.discard = [];
    }


    for (let i = 0; i < this.drawAmount; i ++) {
      const cardId = this.deck.shift();
      const card = CardFactory.build(cardId);
      card.game = this.game;
      this.hand.push(card);
    }
    this.log(`drew ${this.drawAmount} cards`);
  }

  exhaustCard(index: number) {
    const card = this.hand.splice(index, 1)[0];
    this.exhaust.push(card.id);
    this.log(`exhaust ${card.title}`)
  }

  discardCard(index: number) {
    const card = this.hand.splice(index, 1)[0];
    this.discard.push(card.id);
    this.log(`discarded ${card.title}`)
  }

  discardAllCards() {
    const hand = this.hand.map(card => card.id);
    this.discard = [...this.discard, ...hand];
    this.hand = [];
    this.log(`discarded all cards`)
  }

  endTurn() {
    super.endTurn();

    this.log(`end turn`);
    this.discardAllCards();
  }

  play(index: number) {
    if (this.game.gameState === GameState.SELECT_TARGET) return;
    const card = this.hand[index];
    if (this.mp >= card.cost) {
      this.log(`played ${card.title}`)
      this.log(`lost ${card.cost} mp`)
      this.mp -= card.cost
      card.play();

      if (card.exhausted) {
        this.exhaustCard(index);
      } else {
        this.discardCard(index);
      }

      this.game.checkWinner();
      this.game.updateUI();
    } else {
      this.log(`you don't have enough mp`)
    }
  }

  updateUI() {
    super.updateUI();

    UIElements.characterHp.innerHTML = `${this.hp} / ${this.maxHp}`;
    UIElements.characterDefense.innerHTML = `${this.defense}`;
    UIElements.characterMp.innerHTML = `${this.mp} / ${this.maxMp}`;

    UIElements.characterDeck.innerHTML = `${this.deck.length}`;
    UIElements.characterDiscard.innerHTML = `${this.discard.length}`;
    UIElements.characterExhaust.innerHTML = `${this.exhaust.length}`

    this.updateCardUI();
  }

  updateCardUI() {
    UIElements.cardsContainer.innerHTML = '';
    this.hand.forEach((card, index) => {
      UIElements.cardsContainer.innerHTML += card.renderCard(index);
    })
  }
}