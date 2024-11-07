import { css, html } from "@calpoly/mustang/server";
import { Puzzle } from "../models";
import renderPage from "./renderPage"; // generic page renderer

export class PuzzlePage {
  data: Puzzle;

  constructor(data: Puzzle) {
    this.data = data;
  }

  render() {
    return renderPage({
      body: this.renderBody(),
      stylesheets: [],
      styles: [
      ],
      scripts: []
    });
  }

  renderBody() {
    const { name,
      title,
      solution_url,
      hint,
      flavor_text,
      content,
      featured_image /* , etc */ } = this.data;
    return html`
    <body>
    <main class="page">
      <nav-bar>
        <a slot="hint" href=${hint}>Hint</a>
        <a slot="solution" href=${solution_url}>Solution</a>
      </nav-bar>
      <h1>${title}</h1>
      <h2>${flavor_text}</h2>
      <h3>${content}</h3>
    </main>
  </body> `;
  }
}