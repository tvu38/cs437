import { css, html, shadow } from "@calpoly/mustang";
import reset from "./styles/reset.css.js";

export class LoginForm extends HTMLElement {
  static template = html`
    <template>
      <form id="loginForm">
        <slot name="title">
          <h3>Sign in with Username and Password</h3>
        </slot>
        <label>
          <span>
            <slot name="username">Username</slot>
          </span>
          <input name="username" autocomplete="off" />
        </label>
        <label>
          <span>
            <slot name="password">Password</slot>
          </span>
          <input type="password" name="password" />
        </label>
        <slot name="submit">
          <button type="submit">Sign In</button>
        </slot>
      </form>
      <form id="registerForm">
        <h4>New here? Create an account:</h4>
        <label>
          <span>Username</span>
          <input name="username" autocomplete="off" />
        </label>
        <label>
          <span>Password</span>
          <input type="password" name="password" />
        </label>
        <button type="submit">Register</button>
      </form>
    </template>
  `;

  static styles = css`
  form {
    grid-column: 4 / span 6; /* Center forms in the middle columns */
    background-color: #fff; /* White background for the forms */
    padding: 20px;
    border: 1px solid #ddd; /* Light border */
    border-radius: 8px; /* Rounded corners */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow */
    max-width: 100%; /* Ensure responsiveness */
    display: flex;
    flex-direction: column; /* Stack elements vertically */
  }
  
  form label {
    margin-bottom: 10px; /* Space between labels and inputs */
  }
  
  form input {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
  }
  
  form button {
    margin-top: 15px;
    padding: 10px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
  }
  
  form button:hover {
    background-color: #45a049;
  }
  
  h3, h4 {
    text-align: center; /* Center-align headings */
  }
  

  `;

  constructor() {
    super();

    shadow(this)
      .template(LoginForm.template)
      .styles(reset.styles, LoginForm.styles);

    // Attach event listeners
    this.loginForm.addEventListener("submit", (event) =>
      submitLoginForm(
        event,
        this.getAttribute("api"),
        this.getAttribute("redirect") || "/app"
      )
    );

    this.registerForm.addEventListener("submit", (event) =>
      submitRegisterForm(
        event,
        this.getAttribute("register-api") || "/auth/register"
      )
    );
  }

  get loginForm() {
    return this.shadowRoot.querySelector("#loginForm");
  }

  get registerForm() {
    return this.shadowRoot.querySelector("#registerForm");
  }
}

function submitLoginForm(event, endpoint, redirect) {
  event.preventDefault();
  const form = event.target.closest("form");
  const data = new FormData(form);
  const method = "POST";
  const headers = {
    "Content-Type": "application/json"
  };
  const body = JSON.stringify(Object.fromEntries(data));

  fetch(endpoint, { method, headers, body })
    .then((res) => {
      if (res.status !== 200)
        throw `Form submission failed: Status ${res.status}`;
      return res.json();
    })
    .then((payload) => {
      const { token } = payload;

      form.dispatchEvent(
        new CustomEvent("auth:message", {
          bubbles: true,
          composed: true,
          detail: ["auth/signin", { token, redirect }]
        })
      );
    })
    .catch((err) => console.log("Error submitting form:", err));
}

function submitRegisterForm(event, endpoint) {
  event.preventDefault();
  const form = event.target.closest("form");
  const data = new FormData(form);
  const method = "POST";
  const headers = {
    "Content-Type": "application/json"
  };
  const body = JSON.stringify(Object.fromEntries(data));

  fetch(endpoint, { method, headers, body })
    .then((res) => {
      if (res.status !== 201) {
        throw `Registration failed: Status ${res.status}`;
      }
      return res.json();
    })
    .then(() => {
      console.log("Registration successful.");
      showPopupMessage("Registration successful! You can now log in.");
    })
    .catch((err) => console.log("Error submitting registration form:", err));
}


function showPopupMessage(message) {
  // Create the popup container
  const popup = document.createElement("div");
  popup.textContent = message;
  popup.className = "popup-message";

  // Append to the body
  document.body.appendChild(popup);

  // Automatically hide the popup after 3 seconds
  setTimeout(() => {
    popup.remove();
  }, 3000);
}

