# stencil-tailwind

This package is used in order to integrate with [tailwindcss](https://tailwindcss.com/docs/installation/). It provides
simple functionality for supporting a [utility-first](https://tailwindcss.com/docs/utility-first) workflow within the Shadow DOM.

Note, this plugin specificially adds support for _inline utilities_ (idiomatic Tailwind). If you find that this is not a
requirement for your project you can opt to include Tailwind via [`@stencil/postcss`](https://github.com/ionic-team/stencil-postcss). This will allow you to use the
[`@apply`](https://tailwindcss.com/docs/functions-and-directives/#apply) directive and [`theme()`](https://tailwindcss.com/docs/functions-and-directives/#theme) function within your component's stylesheet. You can get started with the following configuration:

```ts
import { Config } from '@stencil/core'
import postcss from '@stencil/postcss'
import tailwind from 'tailwindcss'

export const config: Config = {
  plugins: [
    postcss({
      plugins: [ tailwind() ]
    })
  ]
}
```

## Installation

First, npm install within the project:

`npm install stencil-tailwind --save-dev`

Next, within the project's `stencil.config.js` file, import the plugin and add it to the config's plugins config:

### stencil.config.ts

```ts
import { Config } from '@stencil/core'
import tailwind from 'stencil-tailwind'

export const config: Config = {
  plugins: [
    tailwind()
  ]
}
```

Note, hot module reloading (`hmr`) is not yet supported. For local development, you'll need to update `reloadStratgy` to use the `pageReload` option:

```ts
export const config: Config = {
  devServer: {
    reloadStrategy: 'pageReload'
  }
}
```

### Create your Tailwind config file (optional)

While Tailwind provides a sensible default configuration, it is often desirable to further customize your theme. This default configuration can be used as a starting point for such customizations. To customize your Tailwind installation, you will first need to generate a config file for your project using the included Tailwind CLI utility when you install the `stencil-tailwind` npm package.

`npm tailwindcss init`

This will generate a [`tailwind.conig.js`](https://tailwindcss.com/docs/configuration) file at the root of your project.

## Usage

### Inline utilities

[Utility classes](https://tailwindcss.com/docs/utility-first) can be used directly within JSX; they will be included in the component's shadow tree.

```jsx
class MyComponent {
  render() {
    return (
      <div class="p-4 bg-red">
        <p class="text-sm text-white">This is JSX!</p>
      </div>
    );
  }
}
```

### @Styles

Utilities can be conditionally applied using the `Styles` decorator. This decorator provides a simple wrapper for the
[`classnames`](https://www.npmjs.com/package/classnames) npm package.

```jsx
class MyComponent {
  render() {
    return (
      <button class={this.classNames()}>
        Hello World
      </button>
    );
  }

  @Styles()
  private classNames = () => ({
    'p-4': true,
    'shadow hover:shadow-md': this.floating,
    'rounded-full': this.round
  })
}
```

### Directives

Use the [`@apply`](https://tailwindcss.com/docs/functions-and-directives/#apply) directive to inline any existing utility classes into your external component stylesheet files. This is useful when you want to apply utilities to the shadow host.

```css
:host {
  @apply font-bold py-2 px-4 rounded;
}
```

### DSL (advanced)

A simple, declarative, runtime DSL can be used to provide sugar for conditionally applied utilties based on a
[Prop](https://stenciljs.com/docs/properties) value. All classes will be included in the shadow tree at build time.

```tsx
class MyComponent {

  /** specify the size of the button, defaults to m */
  @Prop({ reflect: true }) size: "s" | "m" | "l" = "m";

  render() {
    return (
      <button class="<px-4 py-3 text-sm> l<px-6 py-4 text-lg> s<px-3 py-2 text-xs>">
        Hello World
      </button>
    );
  }

}
```

The DSL is described by the following grammer:

*class-container* → *prefix* < *class-list* >

*class-list* → *class-list class*

*class-list* → *class*

*class* → **string**

*prefix* → **string** | ''

## Options

The following plugin options may be configured:

### stencil.config.ts

```js
import tailwindcss from 'tailwindcss'

export const config: Config = {
  plugins: [
    tailwind({
      tailwind: tailwindcss('tailwind.config.js'),
      inputFile: './src/styles/app.css',
      includeTailwindCss: false
    })
  ]
}
```

* `tailwind`: **(optional)** your own configuration file and version of TailwindCSS to be used.
* `inputFile`: **(optional)** a stylesheet filepath to be used in place of the default.
* `includeTailwindCss`: **(optional)** include global `tailwind.css` in the bundle (default: `true`)
