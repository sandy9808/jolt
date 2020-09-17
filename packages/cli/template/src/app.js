import { Component, html } from "jolt";
import logo from "./logo.svg";
import "./app.css";

const App = () => {
    return html`
        <div>
            <img src=${logo} alt="logo" />
            <a href="https://github.com/OutwalkStudios/jolt" target="_blank">
                Get Started with Jolt
            </a>
        </div>
    `;
}

Component.create({
    name: "app-root",
    useShadow: false
}, App);

Component.mount(App, document.body);