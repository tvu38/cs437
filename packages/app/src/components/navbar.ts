import { LitElement, css, html } from "lit";
import { Events } from "@calpoly/mustang";
import reset from "../styles/reset.css";

function toggleDarkMode(ev: InputEvent) {
    const target = ev.target as HTMLInputElement;
    const checked = target.checked;
  
    Events.relay(ev, "dark-mode", { checked });
  }

export class NavBarElement extends LitElement {
  render() {
    return html`
    <div class="navbar">
      <h2> <a href="/app">Home </a></h2>
      <h2> <a href="/leaderboard.html">Leaderboard </a></h2>
      <h2><a href="/story.html">Story</a></h2>

      <label @change=${toggleDarkMode}>
                <input type="checkbox" />
                <h2> Dark Mode </h2>
              </label> 
        <h2><slot name="hint"><a href="#"></a></slot></h2>
        <h2><slot name="solution"><a href="#"></a></slot></h2>
    </div>
    `;
  }

  static styles = [reset.styles, css`
  :host {
    display: contents;
  }

  .navbar {
    --page-grids: 12;
    display: grid;
    grid-template-columns: [start] repeat(var(--page-grids), 1fr) [end];    
    gap: var(--size-spacing-small) var(--size-spacing-small);


    position: sticky;
    top: 0;
    background-color: var(--color-page-background);
    padding: var(--navbar-padding);
    grid-column: var(--grid-whole-span);
  }
  
  ::slotted(a), .navbar h2 a, h2, .navbar label{
    grid-column: auto / span 2;
    font-family: var(--font-family-body);
    color: var(--color-text-subheader); /* only unique color */
    text-decoration: none;
    margin: 0;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  .navbar h2 a:hover, ::slotted(a:hover) {
    text-decoration: underline;
}
  `];

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