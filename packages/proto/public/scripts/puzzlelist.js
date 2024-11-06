    import { css, html, shadow } from "@calpoly/mustang";
    import reset from "./styles/reset.css.js";

    export class PuzzleList extends HTMLElement {
        static template = html`
        <template>
        <div class="grid-item">
            <h2><slot name="level">Level 2 Puzzles</slot></h2>
            <ol>
                <li><slot name="item-1"><a href="#">Default Link</a></slot></li>
                <li><slot name="item-2"><a href="#">Default Link</a></slot></li>
                <li><slot name="item-3"><a href="#">Default Link</a></slot></li>
                <li><slot name="item-4"><a href="#">Default Link</a></slot></li>
                <li><slot name="item-5"><a href="#">Default Link</a></slot></li>
            </ol>
        </div>
        </template>
    `;
    
    static styles = css`

     
       ol, li {
        font-size: var(--font-size-small);
        color: var(--color-text-body);
        font-style: italic;
       }

        h2{
            font-family: var(--font-family-body);
            font-size: var(--font-size-medium);
            color: var(--color-text-subheader);
            text-decoration: underline;
            grid-column: var(--header-span);
            margin: 0;
        }

        ::slotted(a) {
            font-family: var(--font-family-body);
            color: var(--color-text-body);
            font-style: italic;
            text-decoration: none;
        }

        /* Apply a specific color for visited links to match your design */
        ::slotted(a:visited) {
            color: var(--color-text-body);
        }

        ::slotted(a:hover) {
            text-decoration: underline;
        }
    `;

        constructor() {
            super();
            shadow(this)
                .template(PuzzleList.template)
                .styles(
                    reset.styles,
                    PuzzleList.styles);
        }
    }