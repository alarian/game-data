# Game Data (WIP)

Additional game data that the API does not provide.

## Usage

The following two import forms are supported:

- CommonJS: `const mountSkinData = require('@gw2efficiency/game-data/mounts/skins')`
- ES Modules: `import mountSkinData from '@gw2efficiency/game-data/mounts/skins'`

## Data

- `@gw2efficiency/game-data/home/nodes`: Additional information about home node `name` & `unlock_items`
- `@gw2efficiency/game-data/home/cats`: All additional information about home cats (`name`, `icon`, `description`, `map_screenshot`, `release_date`)
- `@gw2efficiency/game-data/mounts/skins`: Additional information about mount skins `unlock_items`

## Source Structure

The directory structure shows what type of data it is (for example `mounts/skins`).
In each directory, there are the following files:

- `data.ts` - The data for this type
- `test.ts` - Tests that parse `data.ts` and validate if the content is valid
- `generate.ts` - Some way to generate `data.ts` entirely or partially (if applicable)

## NPM Publish

```sh
npm version patch
yarn build
cd build/
npm publish --access=public
```
