import { Auth, Store, History, Switch, define } from "@calpoly/mustang";
import { html, LitElement } from "lit";
import { NavBarElement } from "./components/navbar";
import { HomeViewElement } from "./views/home-view";
import { PuzzleViewElement }from "./views/puzzle-view";

import { init, Model } from "./model";
import update from "./update";
import { Msg } from "./message";

const routes: Switch.Route[] = [
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

class AppElement extends LitElement {

  protected render() {
    return html`
    <mu-switch></mu-switch>
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();
    NavBarElement.initializeOnce();
  }
}

define({
  "mu-auth": Auth.Provider,
  "mu-history": History.Provider,
  "mu-store": class AppStore extends Store.Provider<
    Model,
    Msg
  > {
    constructor() {
      super(update, init, "puzzles:auth");
    }
  },
  "mu-switch": class AppSwitch extends Switch.Element {
    constructor() {
      super(routes, "puzzles:history", "puzzles:auth");
    }
  },
  "home-view": HomeViewElement,
  "puzzles-app": AppElement,
  "puzzle-view": PuzzleViewElement,
  "nav-bar": NavBarElement
});