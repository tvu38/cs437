import { Auth, define, Observer } from "@calpoly/mustang";
import { css, html, LitElement, TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { Puzzle } from "server/models";
import reset from "../styles/reset.css";
import puzzlepage from "../styles/puzzlepage.css";
import page from "../styles/page.css";

export class PuzzleViewElement extends LitElement {

    @property({ attribute: "level", reflect: true })
    level="";
    
    @property({ attribute: "puzzleid", reflect: true})
    puzzleid= "";

    @state()
    puzzle?: Puzzle;

    _authObserver = new Observer<Auth.Model>(
        this,
        "puzzles:auth"
      );
    
      _user = new Auth.User();
    
      connectedCallback() {
        super.connectedCallback();
        this._authObserver.observe(({ user }) => {
          if (user) {
            this._user = user;
          }
          this.loadData();
        });
      }

      loadData() {
        const src = `/api/puzzles/${this.puzzleid}`;

        fetch(src, {
            headers: Auth.headers(this._user)
          })
            .then((res: Response) => {
              if (res.status === 200) return res.json();
              throw `Server responded with status ${res.status}`;
            })
            .catch((err) =>
              console.log("Failed to load puzzle data:", err)
            )
            .then((json: unknown) => {
              if (json) {
                console.log("Puzzle:", json);
                this.puzzle = json as Puzzle;

              }
            })
            .catch((err) =>
              console.log("Failed to convert puzzle data:", err)
            );
      }

      render(): TemplateResult {
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
}