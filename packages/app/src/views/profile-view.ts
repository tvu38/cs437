import {
    define,
    Form,
    History,
    InputArray,
    View
  } from "@calpoly/mustang";
  import { css, html, LitElement } from "lit";
  import { property, state } from "lit/decorators.js";
  import { Profile } from "server/models";
  import { Msg } from "../message";
  import { Model } from "../model";
  
  const profileStyle = css`
    * {
        margin: 0;
        box-sizing: border-box;
    }
    section {
        display: grid;
        grid-template-columns: [key] 2fr [value] 2fr [controls] 2fr [end];
        gap: var(--size-spacing-medium);
        align-items: end;
        margin: var(--size-spacing-medium) auto;
    }
    h1 {
        grid-row: 4;
        grid-column: value;
    }
    slot[name="avatar"] {
        display: grid;
        grid-row: 1/ span 4;
    }
    mu-form {
        grid-column: key / end;
        margin: 0;
    }
    dl {
        display: grid;
        grid-column: key / end;
        grid-template-columns: subgrid;
        gap: 0 var(--size-spacing-medium);
        align-items: baseline;
    }
    dt {
        grid-column: key;
        justify-self: end;
        color: var(--color-accent);
        font-family: var(--font-family-display);
    }
    dd {
        padding-left: var(--size-spacing-large);
        grid-column: value;
    }
  
    nav {
      grid-column: 3;
      grid-row: 4;
      display: grid;
      text-align: right;
      margin-top: var(--margin-size-med);
      justify-content: left;
    }
    nav > a {
      margin-top: var(--size-spacing-small);
      font-size: var(--font-size-body);
      color: var(--color-text);
      text-align: center;
    }
  
    nav > * {
      grid-column: controls;
    }
  
    ::slotted(ul) {
        list-style: none;
        display: flex;
        gap: var(--size-spacing-small);
    }

    ::slotted(img[slot="avatar"]) {
      width: 150px;
      height: 150px;
      border-radius: 50%;
    }
    `;
  
  class ProfileViewer extends LitElement {
    @property()
    userid?: string;
  
    render() {
        console.log(this.userid);
      return html`
        <section>
        <slot name="avatar">
        <img src="/avatars/${this.userid} || 'default'}.png" alt="Avatar" />
        </slot>
          <h1><slot name="userid"></slot></h1>
          <dl>
            <dt>Display Name</dt>
            <dd><slot name="displayname"></slot></dd>
            <dt>Catchphrase</dt>
            <dd><slot name="catchphrase"></slot></dd>
            <dt>Puzzles Solved </dt>
            <dd><slot name="puzzlessolved"></slot></dd>
          </dl>
          <nav>
            <a href="${this.userid}/edit" class="edit">Edit</a>
        </nav>
        </section>
      `;
    }
  
    static styles = [
        profileStyle,
    ];
  }
  
  class ProfileEditor extends LitElement {
    static uses = define({
      "mu-form": Form.Element,
      "input-array": InputArray.Element
    });
    @property()
    userid?: string;
  
    @property({ attribute: false })
    init?: Profile;
  
    render() {
      return html`
        <section>
          <slot name="avatar"></slot>
          <h1><slot name="name"></slot></h1>
          <mu-form .init=${this.init}>
            <label>
              <span>Username</span>
              <input disabled name="userid" />
            </label>
            <label>
              <span>Display Name</span>
              <input name="displayname" />
            </label>
            <label>
              <span>Catchphrase</span>
              <input name="catchphrase" />
            </label>
            <label>
            <span>Avatar</span>
            <input type="file" name="_avatar" @change=${(event: Event) => this._handleAvatarChange(event)}/>
          </label>
          </mu-form>
          <nav>
            <a class="close" href="../${this.userid}">Close</a>
          </nav>
        </section>
      `;
    }
  
    static styles = [
      profileStyle
    ];

    private _handleAvatarChange(event: Event) {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = () => {
          const avatarData = reader.result as string; // Base64 data
          const form = this.shadowRoot?.querySelector("mu-form") as Form.Element; // Cast to correct type
          if (form) {
            form.init = { ...form.init, avatar: avatarData }; // Update form's initial data
          }
        };
        reader.readAsDataURL(input.files[0]);
      }
    }    
    
  }
  
  export class ProfileViewElement extends View<Model, Msg> {
    static uses = define({
      "profile-viewer": ProfileViewer,
      "profile-editor": ProfileEditor,
    });
  
    @property({ type: Boolean, reflect: true })
    edit = false;
  
    @property({ attribute: "userid", reflect: true })
    userid = "";
  
    @state()
    get profile(): Profile | undefined {
      return this.model.profile;
    }
  
    private _avatar: string | undefined; // To store the processed avatar data
  
    constructor() {
      super("puzzles:model");
  
      this.addEventListener("mu-form:submit", (event) =>
        this._handleSubmit(event as Form.SubmitEvent<Profile>)
      );
  
      this.addEventListener("change", (event: Event) => {
        const target = event.target as HTMLInputElement;
        console.log("Change event triggered by:", target);
        if (target?.name === "_avatar" && target.files?.[0]) {
          this._handleAvatarChange(target.files[0]);
        }
      });
    }
  
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
      super.attributeChangedCallback(name, oldValue, newValue);
      if (name === "userid" && oldValue !== newValue && newValue) {
        console.log("Profile Page:", newValue);
        this.dispatchMessage(["profile/select", { userid: newValue }]);
      }
    }
  
    render() {
      const { userid, displayname, avatar, catchphrase, puzzlessolved } =
        this.profile || {};
  
      return this.edit
        ? html`
            <profile-editor
              userid=${userid}
              .init=${this.profile}
              @mu-form:submit=${(event: Form.SubmitEvent<Profile>) =>
                this._handleSubmit(event)}
            >
              <slot name="avatar">
                ${this._avatar
                  ? html`<img src=${this._avatar} alt="Avatar" />`
                  : html`<img src=${avatar || "/default.png"} alt="Avatar" />`}
              </slot>
            </profile-editor>
          `
        : html`
            <profile-viewer userid=${userid}>
              <span slot="displayname">${displayname}</span>
              <span slot="catchphrase">${catchphrase}</span>
              <img slot="avatar" src=${avatar || "/default.png"} alt="Avatar" />
              <span slot="puzzlessolved">${puzzlessolved}</span>
            </profile-viewer>
          `;
    }
  
    private _handleAvatarChange(file: File) {
      const reader = new FileReader();
      reader.onload = () => {
        this._avatar = reader.result as string; // Store Base64 string
        this.requestUpdate();
      };
      reader.onerror = (error) =>
        console.error("Error reading avatar file:", error);
      reader.readAsDataURL(file); // Convert file to Base64
    }
  
    private _handleSubmit(event: Form.SubmitEvent<Profile>) {
      console.log("Handling form submission", event.detail);
    
      // Merge updated data with Base64 avatar
      const updatedProfile = {
        ...event.detail,
        avatar: this._avatar || event.detail.avatar,
      };
    
      console.log("Updated profile to save:", updatedProfile);

      console.log("THE NEWEST ANSWER:", event.detail);

    
      this.dispatchMessage([
        "profile/save",
        {
          userid: this.userid,
          profile: updatedProfile,
          onSuccess: () =>
            History.dispatch(this, "history/navigate", {
              href: `/app/profile/${this.userid}`,
            }),
          onFailure: (error: Error) => console.log("ERROR:", error),
        },
      ]);
    }
    
  }
  