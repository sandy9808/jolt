import { Component, html } from "jolt";
import style from "./hello-world.css";

const HelloWorld = () => {
    return html`<h1>Hello World!</h1>`;
};

Component.create({
    name: "hello-world",
    styles: [style]
}, HelloWorld);