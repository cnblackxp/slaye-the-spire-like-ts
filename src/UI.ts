export const UIElements = {
  logContainer: document.getElementById('log-container'),

  characterHp: document.getElementById('character-hp'),
  characterDefense: document.getElementById('character-defense'),
  characterMp: document.getElementById('character-mp'),
  characterDeck: document.getElementById('character-deck'),
  characterDiscard: document.getElementById('character-discard'),
  characterExhaust: document.getElementById('character-exhaust'),

  // enemyHp: document.getElementById('enemy-hp'),
  // enemyDefense: document.getElementById('enemy-defense'),
  // enemyIntent: document.getElementById('enemy-intent'),

  enemiesContainer: document.getElementById('enemies-container'),

  cardsContainer: document.getElementById('cards-container'),
  characterTurnActions: document.getElementById('character-turn-actions'),
  endTurnButton: document.getElementById('end-turn-button'),
  startGameButton: document.getElementById('start-game-button'),
};

export const UI = {
  log(message: string) {
    UIElements.logContainer.innerHTML = `<li>${message}</li>` + UIElements.logContainer.innerHTML;
  },
  logger(color: string, name: string = ''): Function {
    return (message:string) => {
      UI.log(`<span class="${color}">${name} - ${message}</>`)
    }
  }
}