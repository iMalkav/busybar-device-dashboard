# Device Dashboard for BUSY Bar

<img src="src/appmeta/icon_front_8x8.png" width="64" height="64" alt="Device Dashboard icon">

Battery, connection and firmware information on your BUSY Bar.

Category: **Utilities**.

## Screenshots

Native display captures and their firmware, settings and capture details are
recorded in [docs/SCREENSHOTS.md](docs/SCREENSHOTS.md).

## Controls

Wheel or OK switches pages. Back exits.

## Settings

Open **Apps → Device Dashboard → Setup**. Saved settings are read when the app starts.

| Setting | Type | Default |
| --- | --- | --- |
| Refresh (sec) | integer | 10 |
| Show serial | boolean | False |

Information is read directly from this BUSY Bar. Serial-number display is optional in Setup. Wi-Fi details depend on the fields supplied by the firmware.

## Install and build

Use the Node.js version in [.nvmrc](.nvmrc) and the pnpm version in [package.json](package.json).

    corepack pnpm install --frozen-lockfile
    corepack pnpm check
    corepack pnpm app:install
    corepack pnpm app:run

Pass --addr <host> to an app command to select a device. See [INSTALL.md](INSTALL.md).
The minimum firmware HTTP API is specified in [src/appmeta/manifest.json](src/appmeta/manifest.json).

## Development

Each project contains its own runtime, state model, assets, tests and build scripts.
Run pnpm check for metadata validation, type checking, unit tests, packaging and bundle smoke checks.
Run pnpm release to prepare a versioned archive and SHA256SUMS locally.
Generated files under dist/ are excluded from Git.

See [CONTRIBUTING.md](CONTRIBUTING.md) and [docs/RELEASING.md](docs/RELEASING.md).

## License

Code, pixel icons, geometric artwork and synthesized sound assets: [MIT](LICENSE).
Assets can be recreated with python art/generate_assets.py. Rendering uses fonts supplied by the BUSY Bar firmware.

## AI assistance

See [AI_ASSISTANCE.md](docs/AI_ASSISTANCE.md) for the role of AI in this project.
