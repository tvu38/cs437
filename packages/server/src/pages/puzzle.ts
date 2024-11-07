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
        /* copied over from puzzlepage.css */
        css`
        h1 {
          font-size: var(--font-size-medium);
          border: 3px solid var(--color-text-body);
          margin-top: 30px;
          margin-bottom: 30px;
      }
      h2, h2 a {
          text-align: center;
          text-decoration: none;
          font-style: italic;
          color: var(--color-text-body);
          font-size: var(--font-size-small);
          margin-bottom: var(--margin-spacing);
      }
      h3 {
          text-align: center;
          margin_bottom: var(--margin-spacing);
      }
      .page img {
          display: grid;          /* Make the image a block element */
          grid-column: var(--grid-whole-span);
          margin: 0 auto;          /* Center the image horizontally */
          width: auto;            /* Adjust the width as needed */
          height: auto;            /* Maintain the aspect ratio */
      }
      `],
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
      featured_image } = this.data;

      // Replace all occurrences of "\\n" with actual newlines
      const processedContent = content.replace(/\\n/g, '\n');

    return html`
    <body>
    <main class="page">
      <nav-bar>
        <a slot="hint" href=${hint}>Hint</a>
        <a slot="solution" href=${solution_url}>Solution</a>
      </nav-bar>
      <h1>${title}</h1>
      ${flavor_text ? html`<h2>${flavor_text}</h2>` : ''} <!-- Conditionally render flavortext -->
      ${processedContent ? html`<h3>${processedContent}</h3>` : ''} <!-- Conditionally render content -->
      ${featured_image ? html`<img src=${featured_image}>` : ''} <!-- Conditionally render content -->
    </main>
  </body> `;
  }
}

//const parser = new DOMParser()
//parser.parseFromString(htmlString, "text/html");