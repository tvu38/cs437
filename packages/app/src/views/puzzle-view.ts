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
          name,
          title,
          level,
          solution_url,
          hint,
          flavor_text,
          content,
          featured_image,
          answer
        } = this.puzzle || {};
    
        return html`
        <body>
    <main class="page">
      <h1>${title}</h1>
      ${flavor_text ? html`<h2>${flavor_text}</h2>` : ''} 
      ${content ? html`<h3>${content}</h3>` : ''}
      ${featured_image ? html`<img src=${featured_image}>` : ''}

      <input type="text" id="answerInput" placeholder="Type your answer here">
      <button id="submitButton">Submit</button>
      <p id="result"></p>

      <script>
          // Define the correct answer
          const correctAnswer = '${answer}';
  
          // Add an event listener to the button
          document.getElementById('submitButton').addEventListener('click', () => {
              const userInput = document.getElementById('answerInput').value.trim().toLowerCase();
              const resultElement = document.getElementById('result');
  
              if (userInput === correctAnswer) {
                  resultElement.textContent = "Correct! You've solved the puzzle!";
                  resultElement.className = "correct";
              } else {
                  resultElement.textContent = "Incorrect answer. Try again!";
                  resultElement.className = "incorrect";
              }
          });
      </script>
  
    </main>
  </body> `;
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