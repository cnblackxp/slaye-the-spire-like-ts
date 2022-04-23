import { Utils } from './Utils';

const log = Utils.consoleLogger('EventManager', '#993300');

interface EventContainer {
  type: any,
  callback: any
}

export class EventManager {
  private static events: Array<EventContainer> = [];

  public static addEvent(type: any, callback: any): number {
    const event = {type, callback};
    window.addEventListener(type, callback);
    EventManager.events.push(event);

    log('addEvent', EventManager.events);

    return EventManager.events.length - 1;
  }

  public static removeEvent(eventIndex: number) {
    const event = EventManager.events[eventIndex];
    window.removeEventListener(event.type, event.callback);
    EventManager.events.splice(eventIndex, 1);
    
    log('removeEvent', EventManager.events);
  }

  public static removeEvents() {
    EventManager.events.forEach(event => {
      window.removeEventListener(event.type, event.callback);
    })

    EventManager.events = [];
    
    log('removeEvents', EventManager.events);
  }
}