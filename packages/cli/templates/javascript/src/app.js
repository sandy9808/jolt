import { html, render } from "jolt";
import logo from "./logo.svg";
import "./app.css";

function App() {
    return html`
        <div class="app-container">
            <img src="${logo}" class="app-logo" alt="logo" />
            <a class="app-link" href="https://github.com/OutwalkStudios/jolt" target="_blank">
                Get Started with Jolt
            </a>
        </div>
    `;
}

render(App(), document.querySelector("#app"));