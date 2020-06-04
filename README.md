# stencil-tailwind

This package is used in order to integrate with [tailwindcss](https://tailwindcss.com/docs/installation/).

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

### @Style

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

*class-list* → *prefix* < *class* >

*class-list* → *prefix* < *class* >

*class-list* → *prefix* < *class-list class* >

*class* → **string**

*prefix* → **string** | ''


### Directives

Use the [`@apply`](https://tailwindcss.com/docs/functions-and-directives/#apply) directive to inline any existing utility classes into your external component stylesheet files. This is useful when you want to apply utilities to the shadow host.

```css
:host {
  @apply font-bold py-2 px-4 rounded;
}
```

## Options

Sass options can be passed to the plugin within the stencil config, which are used directly by `sass`. Please reference [sass documentation](https://www.npmjs.com/package/sass) for all available options. Note that this plugin automatically adds the component's directory to the `includePaths` array.

* `inputFile`: the input file path (default: `app.css`)
* `includeTailwindCss`: include global `tailwind.css` in the bundle (default: `true`)
