import { css, html } from "@calpoly/mustang/server";
import { Puzzle } from "../models";
import renderPage from "./renderPage"; // generic page renderer

export class LoginPage {
  render() {
    return renderPage({
      scripts: [
        `
        import { define, Auth } from "@calpoly/mustang";
        import { LoginForm } from "/scripts/login-form.js";

        define({
          "mu-auth": Auth.Provider,
          "login-form": LoginForm
        })
        `
      ],
      styles: [
        css`
        login-form {
          display: contents;
          align-items: center; /* Center content vertically */
          justify-items: center; /* Center content horizontally */
        }
        `
      ],
      body: html`
        <body>
          <mu-auth provides="puzzles:auth">
            <article>
              <blz-header></blz-header>
              <main class="page">
                <login-form api="/auth/login" register-api="/auth/register">
                  <h3 slot="title">Sign in and solve puzzles!</h3>
                </login-form>
              </main>
            </article>
          </mu-auth>
        </body>
      `
    });
  }
}
