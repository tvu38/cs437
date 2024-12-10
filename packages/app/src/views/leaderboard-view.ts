import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import page from "../styles/page.css";
import reset from "../styles/reset.css";

@customElement("leaderboard-view")
export class LeaderboardView extends LitElement {
  static styles = [reset.styles, page.styles, css`
    /* Add styles here */
    #leaderboard-container {
        grid-column: 1 / -1;
    }

    .leaderboard {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
    }

    .leaderboard th,
    .leaderboard td {
      padding: 0.5rem;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }

    .leaderboard img.avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }

    .error {
      color: red;
      font-weight: bold;
    }
  `];

  @state()
  profiles: Array<{
    avatar?: string;
    displayname?: string;
    catchphrase?: string;
    puzzlessolved?: number;
  }> = [];

  @property({ type: Boolean })
  loading = true;

  @property({ type: String })
  errorMessage: string | null = null;

  async connectedCallback() {
    super.connectedCallback();
    await this.fetchLeaderboard();
  }

  async fetchLeaderboard() {
    this.loading = true;
    this.errorMessage = null;

    try {
      const response = await fetch("/api/all-profiles");
      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard data");
      }

      const profiles = await response.json();

      // Sort profiles by puzzlessolved in descending order
      this.profiles = profiles.sort((a: any, b: any) => b.puzzlessolved - a.puzzlessolved);
    } catch (error) {
      console.error("Error loading leaderboard:", error);
      this.errorMessage = "Failed to load leaderboard. Please try again later.";
    } finally {
      this.loading = false;
    }
  }

  render() {
    return html`
      <main class="page">
        <h1>Leaderboard</h1>
        <div id="leaderboard-container">
          ${this.loading
            ? html`<p>Loading...</p>`
            : this.errorMessage
            ? html`<p class="error">${this.errorMessage}</p>`
            : html`
                <table id="leaderboard-table" class="leaderboard">
                  <thead>
                    <tr>
                      <th>Avatar</th>
                      <th>Display Name</th>
                      <th>Catchphrase</th>
                      <th>Puzzles Solved</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${this.profiles.map(
                      (profile) => html`
                        <tr>
                          <td>
                            <img
                              src="${profile.avatar || "/images/default-avatar.png"}"
                              alt="Avatar"
                              class="avatar"
                            />
                          </td>
                          <td>${profile.displayname || "Unknown"}</td>
                          <td>${profile.catchphrase || "No catchphrase"}</td>
                          <td>${profile.puzzlessolved || 0}</td>
                        </tr>
                      `
                    )}
                  </tbody>
                </table>
              `}
        </div>
      </main>
    `;
  }
}
