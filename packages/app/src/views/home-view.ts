import { Auth, Observer } from "@calpoly/mustang";
import { css, html, LitElement } from "lit";
import { state } from "lit/decorators.js";
import { Profile } from "server/models";

export class HomeViewElement extends LitElement {
    src = "/profile";
  
    @state()
    tourIndex = new Array<Profile>();
  
    render() {
      const tourList = this.tourIndex.map(this.renderItem);
  
      return html`
        <main class="page">
          <header>
            <h2>Your Trips</h2>
          </header>
          <dl>${tourList}</dl>
        </main>
      `;
    }
  
    // more to come
  }