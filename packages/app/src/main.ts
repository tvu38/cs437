import { Auth, define } from "@calpoly/mustang";
import { html, LitElement } from "lit";
import { NavBarElement } from "./components/navbar";
import { HomeViewElement } from "./views/home-view";

class AppElement extends LitElement {
  static uses = define({
    "home-view": HomeViewElement
  });

  protected render() {
    return html`
      <home-view></home-view>
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();
    NavBarElement.initializeOnce();
  }
}

define({
  "mu-auth": Auth.Provider,
  "puzzles-app": AppElement,
  "nav-bar": NavBarElement
});