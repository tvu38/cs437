import { Auth, Observer } from "@calpoly/mustang";
import { html, css, LitElement } from "lit";
import reset from "../styles/reset.css";
import page from "../styles/page.css";

export class HomeViewElement extends LitElement {
    src = ""
    render() {
        return html`    
        <main class="page">
      <div class="inner-box">
    <!-- Container for centering SVG files -->

    <div class="homepagetitle" >
        <h1>Funny Puzzle Hunt :P</h1>
    </div>

    <div class="icon-container">
        <svg class="icon">
            <use href="/icons/puzzlepiece.svg#icon-piece" />
        </svg>
        <svg class="icon">
            <use href="/icons/puzzlepiece.svg#icon-piece" />
        </svg>
        <svg class="icon">
            <use href="/icons/puzzlepiece.svg#icon-thinking" />
        </svg>
        <svg class="icon">
            <use href="/icons/puzzlepiece.svg#icon-piece" />
        </svg>
        <svg class="icon">
            <use href="/icons/puzzlepiece.svg#icon-piece" />
        </svg>
    </div>
    
    <div class="grid-container">
        <div class="grid-item">
            <h2>Level 1 Puzzles</h2>
            <ol>
                <li><a href="level-1/colors">Colors</a></li>
                <li><a href="level-1/answer-yoohoo">Just Look Up</a></li>
                <li><a href="level-1/aplusbequalsc">A+B=C</a></li>
                <li><a href="level-1/time">Time</a></li>
                <li><a href="level-1/1-3-puzzle">1/3 Puzzle</a></li>
            </ol>
        </div>
        <div class="grid-item">
            <h2>Level 2 Puzzles</h2>
            <ol>
                <li><a href= "level-2/not-without-precedent">Not Without Precedent</a></li>
                <li><a href="level-2/lunchable-gatorade">Lunchables Gatorade</a></li>
                <li><a href="level-2/nyc-subway">NYC Subway</a></li>
                <li><a href="level-2/blank-squares">Blank Squares</a></li>
                <li><a href="level-2/2-3-puzzle">2/3 Puzzle</a></li>
            </ol>
        </div>
        <div class="grid-item">
            <h2>Level 3 Puzzles</h3>
                <ol>
                    <li><a href="level-3/lele.html">LELE!</a></li>
                    <li><a href="level-3/obligatory-connections-puzzle.html">Obligatory Connections Puzzle</a></li>
                    <li><a href="level-3/three-crosses.html">Three Crosses</a></li>
                    <li><a href="level-3/blank-spaces.html">Blank Spaces</a></li>
                    <li><a href="level-3/list-of-really-really-really-stupid-article-ideas.html">List of really, really, really stupid article ideas</a></li>
                </ol>
        </div>
        <div class="grid-item">
            <h2>Level 4 Puzzles</h4>
                <ol>
                    <li><a href="level-4/the-puzzle-that-gives-back.html">The Puzzle That Gives Back</a></li>
                    <li><a href="level-4/path.html">Path</a></li>
                    <li><a href="level-4/generational-gifts.html">Generational Gifts</a></li>
                    <li><a href="level-4/all-the-moves.html">All the Moves</a></li>
                    <li><a href="level-4/50-50.html">50/50</a></li>
                </ol>
        </div>
    </div>
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

    hydrate(url: string) {
        fetch(url, {
            headers: Auth.headers(this._user)
        })
            .then((res: Response) => {
                if (res.status === 200) return res.json();
                throw `Server responded with status ${res.status}`;
            })
            .then((json: unknown) => {
                if (json) {
                }
            })
            .catch((err) =>
                console.log("Failed to tour data:", err)
            );
    }
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
            this.hydrate(this.src);
        });
    }
}