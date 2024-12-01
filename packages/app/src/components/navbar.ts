// src/components/blazing-header.ts
import { Auth, Events, Observer } from "@calpoly/mustang";
import { LitElement, css, html } from "lit";
import { state } from "lit/decorators.js";
import reset from "../styles/reset.css";

function toggleDarkMode(ev: InputEvent) {
    const target = ev.target as HTMLInputElement;
    const checked = target.checked;
  
    Events.relay(ev, "dark-mode", { checked });
  }
  
  function signOut(ev: MouseEvent) {
    Events.relay(ev, "auth:message", ["auth/signout"]);
  }

export class NavBarElement extends LitElement {
    @state()
    userid: string = "puzlzer";


  protected render() {
    return html`
    <div class="navbar">
    <h2> <a href="/index.html">Home </a></h2>
    <h2> <a href="/leaderboard.html">Leaderboard </a></h2>
    <h2><a href="/story.html">Story</a></h2>
    <label @change=${toggleDarkMode}>
      <input type="checkbox" id="dark-mode-toggle" />
      <h2> Dark Mode</h2>
    </label>
    <h2 class="when-signed-in><a id="signout" @click=${signOut}>Sign Out</a></h2> 
    <h2><slot name="hint"><a href="#"></a></slot></h2>
    <h2><slot name="solution"><a href="#"></a></slot></h2>
  </div>
  <a slot="actuator">
    Hello,
    <span id="userid">${this.userid}</span>
  </a>
    `;
  }

  static styles = [reset.styles, css`
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

  a:has(#userid:empty) ~ menu > .when-signed-in,
  a:has(#userid:not(:empty)) ~ menu > .when-signed-out {
    display: none;
  }
  `];

  _authObserver = new Observer<Auth.Model>(
    this,
    "puzzles:auth"
  );

  connectedCallback() {
    super.connectedCallback();

    this._authObserver.observe(({ user }) => {
      if (user && user.username !== this.userid) {
        this.userid = user.username;
      }
    });
  }

  static initializeOnce() {
    function toggleDarkMode(
      page: HTMLElement,
      checked: boolean
    ) {
      page.classList.toggle("dark-mode", checked);
    }

    document.body.addEventListener("dark-mode", (event) =>
      toggleDarkMode(
        event.currentTarget as HTMLElement,
        (event as CustomEvent).detail?.checked
      )
    );
  }
}