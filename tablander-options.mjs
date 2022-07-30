// import {
//   html,
//   render,
//   Component,
// } from 'https://unpkg.com/htm/preact/index.mjs?module';

import { h, render, Component } from './vendor/preact_10.10.0/preact.module.js';
import htm from './vendor/htm_3.1.1/htm.module.js';

const html = htm.bind(h);

// function saveOptions(e) {
//   const sites = document
//     .querySelector('#sites')
//     .value.split('\n')
//     .map(s => s.trim())
//     .filter(Boolean);

//   browser.storage.sync.set({ sites });
//   e.preventDefault();
// }

// async function restoreOptions() {
//   const { sites } = await browser.storage.sync.get('sites');
//   document.querySelector('#sites').value = (sites || []).join('\n');
// }

// document.addEventListener('DOMContentLoaded', restoreOptions);
// document.querySelector('form').addEventListener('submit', saveOptions);

// const SitesListItem = ({ site }) => html`<li class="SitesListItem>{site}</li>`;
// const SitesList = ({ sites }) =>
//   html`<ul class="SitesList">
//     {sites.map(SitesListItem)}
//   </ul>`;

// class AddSiteForm extends Component {
//   state = { value: '' };
//   onSubmit = e => {};
//   onInput = e => {
//     const { value } = e.target;
//     this.setState({ value });
//   };
//   render(_, { value }) {
//     return html`<form onSubmit="${this.onSubmit}">
//       <input type="text" value="${value}" onInput="${this.onInput}" />
//       <button type="submit">Submit</button>
//     </form>`;
//   }
// }

// const App = () =>
//   html`<div><${SitesList} sites={["foo", "bar"]} /><${AddSiteForm} /></div>`;

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
  /**
   * @param {Object} _
   * @param {AppState} state
   */
  render(_, { newSite, sites }) {
    return html`<div>
      <ul>
        ${sites.map(s => html`<li>${s}</li>`)}
      </ul>
      <form>
        <input type="text" value="${newSite}" onInput="${this.onInput}" /> //
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
