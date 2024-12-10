import { View } from "@calpoly/mustang";
import { html } from "lit";
import { property, state } from "lit/decorators.js";
import { Puzzle } from "server/models";
import reset from "../styles/reset.css";
import puzzlepage from "../styles/puzzlepage.css";
import page from "../styles/page.css";

import { Msg } from "../message";
import { Model } from "../model";

export class PuzzleViewElement extends View<Model, Msg> {

    @property({ attribute: "level", reflect: true })
    level?: string;
    
    @property({ attribute: "puzzleid", reflect: true})
    puzzleid?: string;

    @state()
    get puzzle(): Puzzle | undefined {
        return this.model.puzzle;
    }

        render() {
          const {
            title,
            flavor_text,
            content,
            featured_image,
          } = this.puzzle || {};
        
          return html`
            <main class="page">
              <h1>${title || "Puzzle"}</h1>
              ${flavor_text ? html`<h2>${flavor_text}</h2>` : ''}
              ${content ? html`<h3>${content}</h3>` : ''}
              ${featured_image ? html`<img src=${featured_image} alt="Featured Image">` : ''}
        
              <input type="text" id="answerInput" placeholder="Type your answer here">
              <button @click=${this._handleSubmit} id="submitButton">Submit</button>
              <p id="result"></p>
            </main>
          `;
        }

        private _handleSubmit() {
          const inputElement = this.shadowRoot?.getElementById("answerInput") as HTMLInputElement;
          const resultElement = this.shadowRoot?.getElementById("result") as HTMLElement;
        
          if (!inputElement || !resultElement) return;
        
          const userInput = inputElement.value.trim().toLowerCase();
          const correctAnswer = this.puzzle?.answer?.trim().toLowerCase();
        
          if (userInput === correctAnswer) {
            resultElement.textContent = "Correct! You've solved the puzzle!";
            resultElement.className = "correct";
          } else {
            resultElement.textContent = "Incorrect answer. Try again!";
            resultElement.className = "incorrect";
          }
        }
        
        

      static styles = [reset.styles, page.styles, puzzlepage.styles];

      constructor() {
        super("puzzles:model");
      }

      attributeChangedCallback(
        name: string,
        old: string | null,
        value: string | null
      ) {
        super.attributeChangedCallback(name, old, value);
    
        if (name === "puzzleid" && old !== value && value)
          this.dispatchMessage([
            "puzzle/select",
            { puzzleid : value }
          ]);
      }
}