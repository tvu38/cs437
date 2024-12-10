import { css } from "lit";

const styles = css`
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
    margin-bottom: var(--margin-spacing);
}
.page img {
    display: grid;          /* Make the image a block element */
    grid-column: var(--grid-whole-span);
    margin: 0 auto;          /* Center the image horizontally */
    width: auto;            /* Adjust the width as needed */
    height: auto;            /* Maintain the aspect ratio */
}`;

export default { styles };