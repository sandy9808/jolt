<div align="center">
    <img src="https://raw.githubusercontent.com/OutwalkStudios/jolt/master/resources/jolt-logo.svg" alt="Jolt" width="400px" height="300px" />
</div>

<div align="center">
    <p><strong>A JavaScript framework for building lightning fast web apps.</strong></p>
    <p>Build responsive web apps for desktop and mobile platforms.</p>
    <a href="#">
        <img src="https://github.com/OutwalkStudios/jolt/workflows/build/badge.svg" alt="Current build status of Jolt">
    </a>
    <a href="https://github.com/OutwalkStudios/jolt/blob/master/LICENSE">
        <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="Jolt is released under the MIT license">
    </a>
    <a href="https://discord.gg/AA7qukU">
        <img src="https://img.shields.io/badge/chat-on%20discord-7289da.svg" alt="Join us on Discord">
    </a>
    <a href="https://www.patreon.com/outwalkstudios">
        <img src="https://img.shields.io/badge/patreon-donate-green.svg" alt="Donate on Patreon">
    </a>
</div>

---

 Table of Contents
-----------------

- [Ecosystem](#ecosystem)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Using Components in your Application](#using-components-in-your-application)
- [Event Binding with Jolt](#event-binding-with-jolt)
- [State Management with Jolt](#state-management-with-jolt)
- [Why use Jolt?](#why-use-jolt)
- [Reporting Issues](#reporting-issues)

---

## Ecosystem

| Project | Description |
|---------|-------------|
| [jolt](https://www.npmjs.com/package/jolt)      | Core Framework |
| [@jolt/server](https://www.npmjs.com/package/@jolt/server)        | Live Reloading Development Server |
| [@jolt/router](https://www.npmjs.com/package/@jolt/router)      | Single Page Application Routing |
| [@jolt/cli](https://www.npmjs.com/package/@jolt/cli)        | Project Scaffolding |

---

## Installation

Jolt is designed to fit into your existing workflows with no hassle. </br>
You can install Jolt using [npm](https://www.npmjs.com/package/jolt) or add it to your page using a [CDN](https://unpkg.com/jolt) and script tag.
When installing Jolt using a script tag, all Jolt features are in a `Jolt` namespace.

Install using [npm](https://www.npmjs.com/package/jolt):
```bash
npm install jolt
```

Install using a [CDN](https://unpkg.com/jolt) and script tag:
```html
<script src="https://unpkg.com/jolt"></script>
```

Documentation is availiable [here](https://outwalkstudios.github.io/jolt/).

---

## Getting Started

The quickest way to get started with Jolt is to use [@jolt/cli](https://www.npmjs.com/package/@jolt/cli) to generate a new project. You can do so by running `npx @jolt/cli create my-app`.

If you are manually installing Jolt you can get a simple app up and running by creating a [function component](#function-components) and rendering it to a container element.

```js
import { html, render } from "jolt";

function App() {
    return html`
        <h1>Hello World!</h1>
    `;
}

render(App(), document.querySelector("#app"));
```

---

## Using Components In Your Application

Components are the building blocks to your application, There are two types of components you can create, function components, and class components, depending on what the component is for will determine which type is a better fit.

### Function Components

---

For simple parts of your application or to simply render html, function components are the best option. They dont offer state management or lifecycle functions like class components do, but for small tasks, they make a great option.

```js
import { html, render } from "jolt";

function App() {
    return html`
        <h1>Hello World!</h1>
    `;
}

render(App(), document.querySelector("#app"));
```

### Class Components

--- 

When you are building a component that needs state management or lifecycle methods, class components are the preferred option. A class component has a `state` property for updating the component state, as well as `didLoad()` and `willUnload()` methods that are called when the component is added or removed form the page. Class components are required to be registered with its own html tag such as `<hello-world></hello-world>`.

```js
import { html, Component } from "jolt";

class HelloWorld extends Component {

    render() {
        return html`
            <h1>Hello World!</h1>
        `;
    }
}

Component.register("hello-world", HelloWorld);
```

The line `Component.register("hello-world", HelloWorld);` makes the component availible as `<hello-world></hello-world>`

<strong>NOTICE:</strong> 
- Component names are required to have hyphen in the name in order to not conflict with standardized HTML elements.
- Components must be registerd with an element name in order to be available to use.

---

## Event Binding With Jolt

Jolt has a simple way to bind events to elements. Instead of managing and creating your own event listeners, you can let Jolt manage it all for you! To bind an event to an element you just create a normal event listener but pass a function as the value instead of a string.

```js
html`<button onclick=${() => alert("I was clicked")}>Click Me!</button>`
```

---

## State Management With Jolt

Jolt comes with a built-in solution to state management. State is localized to the class component containing the state property. The [Component](#class-components) class contains a `state` property that you can store your state in. When a property in the state object is changed it will update the part of the DOM that changed as a result.

You can set the initial state in the constructor or the didLoad method. When using the Component constructor you must always call the super constructor.

```js
import { html, Component } from "jolt";

class MyComponent extends Component {
  constructor() {
    super();

    this.state.set({
      date: new Date(),
    });
  }

  render() {
    return html`
      <span>The current date is ${this.state.date}</span>
      <button onclick=${() => this.updateDate()}>Update Date</button>
    `;
  }

  updateDate() {
    this.state.date = new Date();
  };
}
```

---

## Why Use Jolt

Jolt is a lightweight frontend JavaScript framework. It was developed to make creating web apps in a very simple and easy way. Additionally it is designed to drop into any project or build process that you prefer. Unlike other frameworks that utilize a Virtual DOM, Jolt uses the real DOM and only makes changes to the elements that have changed. This makes Jolt very fast when making updates to the DOM. Jolt Components are built as an abstraction over native WebComponents with additonal features such as state management and event binding. Templates in Jolt are designed similar to JSX but without the compliation step. If you are looking for a powerful and lightweight framework to build your next app using the tools you love then Jolt may be the solution your looking for!

---

## Reporting Issues

If you are having trouble getting something to work with Jolt, you can ask in our [discord](https://discord.gg/AA7qukU) or create a new [Issue](https://github.com/OutwalkStudios/jolt/issues).

If you find a bug or if something is not working properly, you can report it by creating a new [Issue](https://github.com/OutwalkStudios/jolt/issues).

If Jolt does not fit your needs or is missing a feature you would like to see, let us know! We would greatly appreciate your feedback on it.

You can contact Outwalk Studios directly by email using `support@outwalkstudios.com`.

---

## License

Jolt is licensed under the terms of the [**MIT**](https://github.com/OutwalkStudios/jolt/blob/master/LICENSE) license.

