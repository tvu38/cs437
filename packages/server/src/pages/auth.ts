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
            /* your CSS here */
          `
        ],
        body: html`
          <body>
            <mu-auth provides="puzzles:auth">
              <article>
                <blz-header></blz-header>
                <main class="page">
                  <login-form api="/auth/login">
                    <h3 slot="title">Sign in and go places!</h3>
                  </login-form>
                  <p class="register">
                    Or did you want to
                    <a href="./register">
                      register as a new user
                    </a>
                    ?
                  </p>
                </main>
              </article>
            </mu-auth>
          </body>
        `
      });
    }
  }