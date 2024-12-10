import { html, css, LitElement } from "lit";
import reset from "../styles/reset.css";
import page from "../styles/page.css";

export class StoryViewElement extends LitElement {
    render() {
        return html`    
        <main class="page">

        <h1>Story</h1>
        <h2>Backstory</h2>
        <h3>Long ago, in a whimsical little town called Puzzleburg, the citizens thrived on one thing and one thing alone: solving puzzles! From sunrise to sunset, the streets were alive with the sound of gears turning and pens scratching as everyone worked on riddles, codes, and conundrums. You have been tasked
        by the almighty king to figure out the newest set of puzzles in order to feed the citizens and let the town thrive. But the main question is...are you up for it?</h3>
        <h2>_______</h2>
        <h2>What is a puzzlehunt?</h2>
        <h3>In a puzzlehunt, each puzzle has an underlying pattern or insight, which you need to figure out (somewhat like the theme of a crossword puzzle). Puzzles can come in many different forms; the only real commonality is that you usually receive no direct instructions, so it’s up to you to figure out how to make sense of the information you’re given.
        Each answer is a common English word or phrase (you will know the answer when you get it)</h3>
        <h2>_______</h2>
        <h2>What is and isn't allowed?</h2>
        <h3>You may not view source code, dump network packets, hack, or otherwise interact with the website in any unintended way. If you're not sure whether something is intended, then don't do it. The Internet is your best friend though and you are encouraged
        to look up information in order to solve the majority of these puzzles.</h3>
    </main>
    `;
    }

  static styles = [reset.styles, page.styles,
    css`
    :host {
      display: contents; /* Ensure the element behaves as a block-level element */
      width: 100%; /* Inherit full width from parent */
    }

    /* Ensure the main content respects parent styles */
    main {
      width: inherit;
    }
  `,
];
}