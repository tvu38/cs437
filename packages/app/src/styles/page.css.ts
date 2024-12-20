import { css } from "lit";

const styles = css`
body {
    background-color: var(--color-page-background);
    font-family: var(--font-family-display);
    font-weight: var(--font-weight);
}

/* Dark mode styles */
body.dark-mode {
    color: #ffffff;
}

.page {
    --page-grids: 12;
  
    display: grid;
    grid-template-columns: [start] repeat(var(--page-grids), 1fr) [end];    
    gap: var(--size-spacing-small) var(--size-spacing-small);
}

.navbar {
    display: grid;
    grid-template-columns: subgrid;
    position: sticky;
    top: 0;
    background-color: var(--color-page-background);
    padding: var(--navbar-padding);
    grid-column: var(--grid-whole-span);
  }
  .navbar h2 {
    font-family: var(--font-family-display);
    grid-column: auto / span 3;
    font-weight: bold;
  }

h1 {
    font-family: var(--font-family-display);
    color: var(--color-text-bigheader);
    padding: var(--border-padding);
    text-align: var(--text-center);
    font-size: var(--font-size);
    border: 5px solid var(--color-text-body);
    margin: var(--margin-center);
    grid-column: var(--header-span);
}
h2, h2 a {
    font-family: var(--font-family-body);
    color: var(--color-text-subheader); /* only unique color */
    text-decoration: underline;
    grid-column: var(--header-span);
    margin: 0;
}
h3 {
    font-family: var( --font-family-body);
    color: var(--color-text-body);
    grid-column: var(--header-span);
}
.inner-box {
    background-color: var(--color-page-innerbox);   
    padding: var(--border-padding-innerbox);          
    margin: var(--margin-padding-innerbox);       
    width: auto;
    height: auto;
    grid-column: var(--inner-box-span); /* Start at the first column and span 10 cols */
    display: grid;
}
.homepagetitle{
    display: flex;
}
.homepagetitle h1{
    font-family: var(--font-family-display);
    color: var(--color-text-bigheader);/*navy; /* only unique color */
    padding: var(--gap-padding);
    text-align: var(--text-center);
    font-size: var(--font-size);
    border: 5px solid var(--color-text-body);
    margin: var(--margin-center);
}

li a {
    font-family: var(--font-family-body);
    color: var(--color-text-body);
    font-style: italic;
}
/* Responsive behavior */
@media (max-width: 600px) {
    .icon {
        height: 8em;
        width: 6em; /* Shrinks icon size on smaller screens */
    }
}
.grid-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;   
    gap: var(--gap-padding);
    width: auto;
    height: auto;
}
.icon-container {
    width: auto;
    margin: var(--margin-center);
    display: flex; /* Use flexbox */
    justify-content: center; /* Center icons horizontally */
    gap: 10px; /* Space between icons */
}
svg.icon {
    flex-wrap: wrap; /* Allow wrapping of icons */
    width: 20%; /* Responsive width */
    max-width: 100px; /* Maximum width for each icon */
    height: auto; /* Maintain aspect ratio */
    fill: currentColor; /* Optional: Use current text color */
}

#answerInput {
    margin-top: 20px; /* Adds space above the input */
    font-size: 18px;
    grid-column: 5 / span 3;
    height: 50px; /* Adjust the height to make it taller */

    box-sizing: border-box; /* Include padding and border in dimensions */
    /* Border properties */
    border: 2px solid #000000;
     border-radius: 3px;
}
  
#submitButton {
    margin-top: 20px; /* Adds space above the input */
    grid-column: 8 / span 1;
}`;

export default { styles };