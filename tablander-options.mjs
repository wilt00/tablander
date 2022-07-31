import { h, render, Component } from './vendor/preact_10.10.0/preact.module.js';
import htm from './vendor/htm_3.1.1/htm.module.js';

const html = htm.bind(h);

/**
 * @typedef {Object} AppState
 * @property {string} newSite
 * @property {string[]} sites
 * @property {boolean} sitesLoaded
 */

/**
 * @extends {Component<{}, AppState>}
 */
class App extends Component {
  constructor() {
    super();
    this.state = { newSite: '', sites: [], sitesLoaded: false };
  }
  componentDidMount() {
    browser.storage.sync
      .get('sites')
      .then(({ sites }) => this.setState({ sites, sitesLoaded: true })); // [...sites] ?
  }
  onInput = e => {
    const { value } = e.target || {};
    this.setState({ newSite: value });
  };
  /** @param {Event} e */
  onSubmit = e => {
    e.preventDefault();
    this.setState(({ newSite, sites }) => {
      const newSites = [...sites, newSite];
      try {
        browser.storage.sync.set({ sites: newSites });
      } catch (err) {}
      return { sites: newSites, newSite: '' };
    });
  };
  /** @param {string} site */
  removeSite = site => e => {
    e.preventDefault();
    this.setState(({ sites }) => ({
      sites: sites.filter(s => s !== site),
    }));
  };
  /** @param {string} site */
  editSite = site => e => {
    e.preventDefault();
    this.setState(({ sites }) => ({
      newSite: site,
      sites: sites.filter(s => s !== site),
    }));
  };
  /**
   * @param {Object} _
   * @param {AppState} state
   */
  render(_, { newSite, sites }) {
    return html`<div>
      <ul>
        ${sites.map(
          s =>
            html`<li>
              <span>${s}</span>
              <button onClick="${this.editSite(s)}">edit</button>
              <button onClick="${this.removeSite(s)}">remove</button>
            </li>`
        )}
      </ul>
      <form onSubmit="${this.onSubmit}">
        <label for="newSite">Add Site:</label>
        <input
          type="text"
          name="newSite"
          value="${newSite}"
          onInput="${this.onInput}"
        />
        <button type="submit">Submit</button>
      </form>
    </div>`;
  }
}

const appElem = document.getElementById('app');
if (appElem) {
  render(html`<${App} />`, appElem);
} else {
  console.error('Could not find element with id "app"!');
}
