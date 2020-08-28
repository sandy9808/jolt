import { Component, html, render } from "jolt";
import logo from "./logo.svg";
import "./app.css";

function App() {
    return html`
        <style>
            div {
                text-align: center;
                background-color: white;
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: black;
            }

            img {
                height: 40vmin;
                pointer-events: none;
                margin-bottom: 50px;
            }

            a {
                color: grey;
                font-size: 30px;
            }
        </style>
        
        <div>
            <img src=${logo} alt="logo" />
            <a href="https://github.com/OutwalkStudios/jolt" target="_blank">
                Get Started with Jolt
            </a>
        </div>
    `;
}

Component.register("app-root", App);

render(App, document.body);