<div align="center">
	<h1><img src="./shots/logo.svg" alt="storybook-addon-grid"/></h1>
	<p align="center"><code>yarn add storybook-addon-grid</code> makes column grids simple</p>
	<hr />
	<span>
		<a href="https://github.com/maraisr/storybook-addon-grid/actions?query=workflow:CI+branch:main">
			<img src="https://github.com/maraisr/storybook-addon-grid/workflows/CI/badge.svg?query=branch:main"/>
		</a>
		<a href="https://npm-stat.com/charts.html?package=storybook-addon-grid">
			<img src="https://badgen.net/npm/dm/storybook-addon-grid" alt="downloads"/>
		</a>
	</span>
</div>

<br />

![example that shows how the columns look when enabled](./shots/example.png)

## ⚙️ Install

```sh
yarn add -D storybook-addon-grid
```

```js
// .storybook/main.js
module.exports = {
  addons: [require.resolve('storybook-addon-grid/preset')],
};
```

> <details>
> <summary>Chromatic users</summary>
>
> Include this additional preset to configure the grid lines for your Chromatic
> screenshots.
>
> ```js
> // .storybook/main.js
> module.exports = {
>   addons: [
>     require.resolve('storybook-addon-grid/preset'),
>     require.resolve('storybook-addon-grid/chromatic'),
>   ],
> };
> ```
>
> </details>

## 🚀 Usage

The grid is controlled with
[parameters](https://storybook.js.org/docs/react/writing-stories/parameters) and
as such you can define this globally or per story.

The grid can be turned on either via clicking the Grid button in the toolbar, or
via a keyboard shortcut <kbd>Ctrl</kbd> + <kbd>G</kbd>.

> **Note:** Due to the nature of `z-index`, the root `div` of the stories will
> have a `position: relative` and `z-index: 0` applied to it, allowing the
> column guides to sit over the top.

### _Parameters_

Column design system is defined by 3 values:

- the number of `columns`
- the `gap` between them
- the `gutter` — minimal margin between the system and the screen
- `maximal-width` for the system to limit maximum width of all columns as well.

#### `gridOn?: boolean = false`

Defines if the grid should be turned on this story _by-default_. The grid is
controlled with a toolbar item, keyboard shortcut which may cause this to not
_always_ be on. This will _force_ it to either be `on` or `off` when the story
is loaded.

#### `columns?: number = 12`

The number of columns to render.

#### `gap?: string = '20px'`

The gap between `columns`.

#### `gutter?: string = '50px'`

The gap on the left and right side of the columns.

#### `maxWidth?: string = '1024px'`

The maximum width our columns should grow.

##### _Global Parameters~_

```js
// .storybook/preview.js
export const parameters = {
  grid: {
    gridOn: true,
    columns: 12,
    gap: '20px',
    gutter: '50px',
    maxWidth: '1024px',
  },
};
```

##### _Per story~_

```js
// MyComponent.stories.js

export const Example = () => {...};
Example.parameters = {
	grid: {
		columns: 6,
	},
};
```

## 📚 Further Readings

- https://compassofdesign.com/articles/design-principle-1-guides-gutters-and-grids

## License

MIT © [Marais Rossouw](https://marais.io)
