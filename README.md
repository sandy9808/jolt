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
    <a href="https://www.patreon.com/outwalkstudios">
        <img src="https://img.shields.io/badge/patreon-donate-green.svg" alt="Donate on Patreon">
    </a>
    <a href="https://discord.gg/AA7qukU">
        <img src="https://img.shields.io/badge/chat-on%20discord-7289da.svg" alt="Join us on Discord">
    </a>
    <a href="https://twitter.com/OutwalkStudios">
        <img src="https://img.shields.io/badge/follow-on%20twitter-4AA1EC.svg" alt="Follow us on Twitter">
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
| [@jolt/cli](https://www.npmjs.com/package/@jolt/cli)        | Development CLI |
| [@jolt/router](https://www.npmjs.com/package/@jolt/router)      | Single Page Application Routing |
| [@jolt/server](https://www.npmjs.com/package/@jolt/server)        | Live Reloading Development Server |

---

## Installation

To get started building applications in Jolt, the first step is to install the Jolt CLI,
the CLI is used to create projects and handle ongoing tasks such as bundling, linting, and running a development server.

To install the Jolt CLI, run the following command:
```
npm install -g @jolt/cli
```

You can read more on the Jolt CLI's [README](https://github.com/OutwalkStudios/jolt/tree/master/packages/cli).

---

## Getting Started

### Create a new Project

You can create a new project by running the `create` command and supply the app name for the project.
```
jolt create <app-name>
```

The CLI will create a new project with the supplied name, install all the required dependencies, as well as configure the project config.

### Run the Application

The Jolt CLI comes with a built in live reloading development server.
Running the `serve` command will launch a web server, watch your files, and build the app as you make changes to the files.
```
# Navigate to the project folder
cd app-name

# Launch the development server
jolt serve
```

---

## Using Components In Your Application

Components are the building blocks to your application, There are two types of components you can create, function components, and class components, depending on what the component is for will determine which type is a better fit. `Component.register` is used to register the component as a valid WebComponent.

<strong>NOTICE:</strong> 
- Component names are required to have hyphen in the name in order to not conflict with standardized HTML elements.
- Components must be registerd with an element name in order to be available to use.

### Function Components

For simple parts of your application or to simply render html, function components are the best option. They dont offer state management or lifecycle functions like class components do, but they can react to changes in the component attributes. An Object containing all the components attributes is passed into the function when rendered.

```js
import { Component, html, render } from "jolt";

function App() {
    return html`
        <h1>Hello World!</h1>
    `;
}

Component.register("app-root", App);

render(App, document.body);
```

### Class Components

When you are building a component that needs state management or lifecycle methods, you should use class components, A class component has a `state` property for updating the component state, as well as `didLoad()`, `didUpdate()`, and `willUnload()` methods that are called during certain times in the components lifecycle. An Object containing all the components attributes are passed into the components `render` method when rendered, as well as available as an `attribs` property.

```js
import { Component, html } from "jolt";

class HelloWorld extends Component {

    render() {
        return html`
            <h1>Hello World!</h1>
        `;
    }
}

Component.register("hello-world", HelloWorld);
```

Class Components make use of the [ShadowDOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM), in order to disable this, you can pass a set of options into the components super constructor.

```js
import { Component, html } from "jolt";

class HelloWorld extends Component {

    constructor() {
        super({ disableShadowDOM: true });
    }

    render() {
        return html`
            <h1>Hello World!</h1>
        `;
    }
}

Component.register("hello-world", HelloWorld);
```

---

## Event Binding With Jolt

Jolt has a simple way to bind events to elements. Instead of managing and creating your own event listeners, you can let Jolt manage it all for you! To bind an event to an element you just create a normal event listener but pass a function as the value instead of a string.

```js
html`<button onclick=${() => alert("I was clicked")}>Click Me!</button>`
```

---

## State Management With Jolt

Jolt comes with a built-in solution to state management. State is localized to the component containing the state property. The [Component](#class-components) class contains a `state` property that you can store your state in. When a property in the state object is changed it will update the part of the DOM that changed as a result.

You can set the initial state in the constructor or the didLoad method. When using the Component constructor you must always call the super constructor.

```js
import { Component, html } from "jolt";

class MyComponent extends Component {
  constructor() {
    super();

    this.state.set({
      date: new Date()
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

Jolt is a lightweight frontend JavaScript framework. It was developed to make creating web apps in a very simple and easy way. It is designed to only use web standards meaning all the code you write can run directly in a browser without a build step. Unlike other frameworks that utilize a Virtual DOM, Jolt uses the real DOM and only makes changes to the elements that have changed. This makes Jolt very fast when making updates to the DOM. Jolt Components are built as an abstraction over native WebComponents with additonal features such as state management and event binding. Templates in Jolt are designed similar to JSX but without the compliation step. If you are looking for a powerful and lightweight framework to build your next app using the tools you love then Jolt may be the solution your looking for!

---

## Reporting Issues

If you are having trouble getting something to work with Jolt, you can ask in our [discord](https://discord.gg/AA7qukU) or create a new [Issue](https://github.com/OutwalkStudios/jolt/issues).

If you find a bug or if something is not working properly, you can report it by creating a new [Issue](https://github.com/OutwalkStudios/jolt/issues).

If Jolt does not fit your needs or is missing a feature you would like to see, let us know! We would greatly appreciate your feedback on it.

You can contact Outwalk Studios directly by email using `support@outwalkstudios.com`.

---

## License

Jolt is licensed under the terms of the [**MIT**](https://github.com/OutwalkStudios/jolt/blob/master/LICENSE) license.

