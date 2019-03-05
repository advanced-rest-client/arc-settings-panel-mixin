[![Published on NPM](https://img.shields.io/npm/v/@advanced-rest-client/arc-settings-panel-mixin.svg)](https://www.npmjs.com/package/@advanced-rest-client/arc-settings-panel-mixin)

[![Build Status](https://travis-ci.org/advanced-rest-client/arc-settings-panel-mixin.svg?branch=stage)](https://travis-ci.org/advanced-rest-client/arc-settings-panel-mixin)

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/advanced-rest-client/arc-settings-panel-mixin)

# arc-settings-panel-mixin

A mixin to be applied to settings panel. Contains common methods to get and update settings

### API components

This components is a part of [API components ecosystem](https://elements.advancedrestclient.com/)

## Usage

### Installation
```
npm install --save @advanced-rest-client/arc-settings-panel-mixin
```

### In a Polymer 3 element

```js
import {PolymerElement, html} from '@polymer/polymer';
import {ArcSettingsPanelMixin} from '@advanced-rest-client/arc-settings-panel-mixin/arc-settings-panel-mixin.js';
import '@advanced-rest-client/arc-settings-panel-mixin/arc-settings-panel-styles.js';

class SampleElement extends ArcSettingsPanelMixin(PolymerElement) {
  static get template() {
    return html`
    <style include="arc-settings-panel-styles"></style>
    <h1>Settings panel</h1>
    `;
  }
}
customElements.define('sample-element', SampleElement);
```

### Installation

```sh
git clone https://github.com/advanced-rest-client/arc-settings-panel-mixin
cd api-url-editor
npm install
npm install -g polymer-cli
```

### Running the tests
```sh
polymer test --npm
```
