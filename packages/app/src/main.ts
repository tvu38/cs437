import { Auth, History, Switch, define } from "@calpoly/mustang";
import { html, LitElement } from "lit";
import { NavBarElement } from "./components/navbar";
import { HomeViewElement } from "./views/home-view";
import { PuzzleViewElement }from "./views/puzzle-view";

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

const routes = [
  {
    auth: "protected",
    path: "/:levelid/:puzzleid",
    view: (params: Switch.Params) => html`
      <puzzle-view level=${params.levelid} puzzleid=${params.puzzleid}></puzzle-view>
    `
  },
  {
    auth: "protected",
    path: "/app",
    view: () => html`
      <home-view></home-view>
    `
  },
  {
    path: "/",
    redirect: "/login"
  }
];

define({
  "mu-auth": Auth.Provider,
  "mu-history": History.Provider,
  "mu-switch": class AppSwitch extends Switch.Element {
    constructor() {
      super(routes, "puzzles:history", "puzzles:auth");
    }
  },
  "puzzles-app": AppElement,
  "puzzle-view": PuzzleViewElement,
  "nav-bar": NavBarElement
});