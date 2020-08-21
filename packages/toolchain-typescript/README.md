# @jolt/toolchain-typescript

This package is used to develop TypeScript projects with [@jolt/cli](https://www.npmjs.com/package/@jolt/cli)

![Actions](https://github.com/OutwalkStudios/jolt/workflows/build/badge.svg)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/OutwalkStudios/jolt/blob/master/LICENSE)
[![Chat Server](https://img.shields.io/badge/chat-on%20discord-7289da.svg)](https://discord.gg/AA7qukU)
[![Donate](https://img.shields.io/badge/patreon-donate-green.svg)](https://www.patreon.com/outwalkstudios)
[![Follow Us](https://img.shields.io/badge/follow-on%20twitter-4AA1EC.svg)](https://twitter.com/OutwalkStudios)

---

## How To Use This Toolchain?

To make this toolchain the active toolchain for @jolt/cli, first install it.
```
npm install --save-dev @jolt/toolchain-typescript
```

then add set the `toolchain` property in `jolt.json` to `@jolt/toolchain-typescript`

```json
{
    "toolchain": "@jolt/toolchain-typescript"
}
```

---

## What Does This Toolchain Do?

This toolchain powers the `build`, `watch`, `lint`, and `serve` commands for @jolt/cli.

The serve command will also accept [`@jolt/server`](https://www.npmjs.com/package/@jolt/server) options from a `server` property in `jolt.json`.

---

## Reporting Issues

If you are having trouble getting something to work with this toolchain, you can ask in our [discord](https://discord.gg/AA7qukU) or create a new [Issue](https://github.com/OutwalkStudios/jolt/issues).

If you find a bug or if something is not working properly, you can report it by creating a new [Issue](https://github.com/OutwalkStudios/jolt/issues).

If this toolchain does not fit your needs or is missing a feature you would like to see, let us know! We would greatly appreciate your feedback on it.

You can contact Outwalk Studios directly using `support@outwalkstudios.com`

---

## License
@jolt/toolchain-typescript is licensed under the terms of the [**MIT**](https://github.com/OutwalkStudios/jolt/blob/master/LICENSE) license.