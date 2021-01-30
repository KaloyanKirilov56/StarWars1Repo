import config from '../config';
import EventEmitter from 'eventemitter3';

const EVENTS = {
  APP_READY: 'app_ready',
};

/**
 * App entry point.
 * All configurations are described in src/config.js
 */
export default class Application extends EventEmitter {
  constructor() {
    super();

    this.config = config;
    this.data = {};

    this.init();
  }

  static get events() {
    return EVENTS;
  }

  /**
   * Initializes the app.
   * Called when the DOM has loaded. You can initiate your custom classes here
   * and manipulate the DOM tree. Task data should be assigned to Application.data.
   * The APP_READY event should be emitted at the end of this method.
   */
  async init() {
    let url = 'https://swapi.booost.bg/api/planets/';
    let planetsArray = [];
    let planetsCount = 0;

    let count = 1;
    while (count < 7) {
      if (count == 1) {
        const response = await fetch(url);
        const planets = await response.json();
        planetsCount = planets.count;

        for (let i = 0; i < planets.results.length; i ++) {
          planetsArray.push(planets.results[i]);
        }
      } else {
        const response = await fetch(url + `?page=${count}`);
        const planets = await response.json();

        for (let i = 0; i < planets.results.length; i ++) {
          planetsArray.push(planets.results[i]);
        }
      }

      count++;
    }

    this.data.count = planetsCount;
    this.data.planets = planetsArray;

    this.emit(Application.events.APP_READY);
  }
}

