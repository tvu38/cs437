import { css, html, shadow, Events, Observer } from "@calpoly/mustang";
import reset from "./styles/reset.css.js";

export class NavBarElement extends HTMLElement {
  static template = html`
  <template>
    <div class="navbar">
      <h2> <a href="/index.html">Home </a></h2>
      <h2> <a href="/leaderboard.html">Leaderboard </a></h2>
      <h2><a href="/story.html">Story</a></h2>
      <label class="dark-mode-switch">
        <input type="checkbox" id="dark-mode-toggle" />
        <h2> Dark Mode</h2>
      </label>
      <h2><slot name="hint"><a href="#"></a></slot></h2>
      <h2><slot name="solution"><a href="#"></a></slot></h2>
    </div>
    <a slot="actuator">
      Hello,
      <span id="userid"></span>
    </a>
  </template>
  `;

  static styles = css`
  :host {
    display: contents;
  }

  .navbar {
    display: grid;
    grid-template-columns: subgrid;
    position: sticky;
    top: 0;
    background-color: var(--color-page-background);
    padding: var(--navbar-padding);
    grid-column: var(--grid-whole-span);
  }

  #userid:empty::before {
    content: "traveler";
  }

  ::slotted(a), .navbar h2 a, h2, .navbar label {
    grid-column: auto / span 2;
    font-family: var(--font-family-body);
    color: var(--color-text-subheader);
    text-decoration: none;
    margin: 0;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  .navbar h2 a:hover, ::slotted(a:hover) {
    text-decoration: underline;
  }
  `;

  constructor() {
    super();
    shadow(this)
      .template(NavBarElement.template)
      .styles(reset.styles, NavBarElement.styles);

    this._userid = this.shadowRoot.querySelector("#userid");
    if (!this._userid) {
      console.error("Element with ID #userid not found.");
    }

    const dmSwitch = this.shadowRoot.querySelector(".dark-mode-switch");
    if (dmSwitch) {
      dmSwitch.addEventListener("click", (event) =>
        Events.relay(event, "dark-mode", {
          checked: event.target.checked,
        })
      );
    }
  }

  _authObserver = new Observer(this, "puzzles:auth");

  connectedCallback() {
    this._authObserver.observe(({ user }) => {
      if (user && user.username !== this.userid) {
        this.userid = user.username;
      }
    });

    if (this.src) {
      this.hydrate(this.src);
    }
  }

  get userid() {
    return this._userid.textContent;
  }

  set userid(id) {
    this._userid.textContent = id === "anonymous" ? "" : id;
  }

  get authorization() {
    return (
      this._user?.authenticated && {
        Authorization: `Bearer ${this._user.token}`,
      }
    );
  }

  hydrate(url) {
    fetch(url, { headers: this.authorization })
      .then((res) => {
        if (res.status !== 200) throw `Status: ${res.status}`;
        return res.json();
      })
      .then((json) => this.renderSlots(json))
      .catch((error) =>
        console.error(`Failed to render data from ${url}:`, error)
      );
  }

  renderSlots(json) {
    const entries = Object.entries(json);
    const toSlot = ([key, value]) => {
      switch (key) {
        case "hint":
          return html`<a slot="hint" href="${value}">Hint</a>`;
        case "solution_url":
          return html`<a slot="solution" href="${value}">Solution</a>`;
      }
    };

    const fragment = entries.map(toSlot);
    this.replaceChildren(...fragment);
  }
}
