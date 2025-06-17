# @uklon/fleets/shared/styles

Shared scss library

---

## How to use

### Add to an angular application

Add `"libs/fleets/shared/styles"` to `build.options.stylePreprocessorOptions.includePaths`.

Example:

```{json}
"stylePreprocessorOptions": {
  "includePaths": [
    "libs/fleets/shared/styles"
  ]
},
```

### Add to a storybook configuration

Add `"libs/fleets/shared/styles"` to `build-storybook.options.stylePreprocessorOptions.includePaths`.

Example:

```{json}
"stylePreprocessorOptions": {
  "includePaths": [
    "libs/fleets/shared/styles"
  ]
},
```

#### Adding global styles to storybook

Add `"libs/fleets/shared/styles/src/styles/globals/_globals.scss"` to `build-storybook.options.styles`.

> An addon `@storybook/preset-scss` should be added to storybook configuration.

### Usage

In global or component styles use imports like:

```{scss}
@import 'libs/fleets/shared/styles/src/styles/<filename>';
```

or

```{scss}
@use 'libs/fleets/shared/styles/src/styles/<filename>';
```

> There are no intellisense for IDEs due to limitations of `@nx/angular:ng-packagr-lite` executor. [issue](https://github.com/nrwl/nx/issues/1542)

---

## Running build

Run `nx test @uklon/fleets/shared/styles` to execute the unit tests.

---

## Running unit tests

Run `nx test @uklon/fleets/shared/styles` to execute the unit tests.
