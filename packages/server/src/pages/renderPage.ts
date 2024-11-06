import {
    PageParts,
    renderWithDefaults
  } from "@calpoly/mustang/server";
  
  const defaults = {
    stylesheets: [
      "/styles/reset.css",
      "/styles/tokens.css",
      "/styles/page.css",
      "https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap",
      "https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap"
    ],
    styles: [],
    scripts: [
      `import { define } from "@calpoly/mustang";
      import { NavBarElement } from "/scripts/navbar.js";
  
      define({
        "nav-bar": NavBarElement
      });
  
      NavBarElement.initializeOnce();
      `
    ],
    googleFontURL:
      "https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,200;0,400;0,700;1,700&family=Merriweather:wght@400;700&display=swap",
    imports: {
      "@calpoly/mustang": "https://unpkg.com/@calpoly/mustang"
    }
  };
  
  export default function renderPage(page: PageParts) {
    return renderWithDefaults(page, defaults);
  }