/**
@license
Copyright 2018 The Advanced REST client authors <arc@mulesoft.com>
Licensed under the Apache License, Version 2.0 (the "License"); you may not
use this file except in compliance with the License. You may obtain a copy of
the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
License for the specific language governing permissions and limitations under
the License.
*/
import {dedupingMixin} from '../../@polymer/polymer/lib/utils/mixin.js';
/**
 * Components implementing this mixin are part of ARC settings panel.
 * After mixing it into the prototype the component gain access to common
 * methods to read and update application settings.
 *
 * ## Processing initial settings
 *
 * The element should override two methods: `_processValues()` and
 * `_setSettings()`. Process values shouls process incomming data and set
 * defaults and proper data types (application storage may not respect data
 * types!). When this function is not provided the element will use data as they
 * arrive from settings provider. The `_setSettings()` function should be used
 * to set appropieate settings on the UI.
 *
 * ```javascript
 * _processValues(values) {
 *  if (values.myKey) {
 *    values.myKey = true;
 *  }
 *  return values;
 * }
 *
 * _setSettings(values) {
 *  this.myValue = values.myKey;
 * }
 * ```
 *
 * ## Updating settings
 *
 * To update settings using `updateSetting()` function first set `__settingsRestored`
 * to true on the element. It ensures to not send events when restoring the data.
 * Update function has a debouncer set to 300 ms. Each change will be commited
 * after this time wiht the last updated value.
 *
 * ```javascript
 * _setSettings(values) {
 *  this.myValue = values.myKey;
 *  this.__settingsRestored = true;
 * }
 *
 * _valueChangeHandler(value) {
 *  this.updateSetting('myKey', value);
 * }
 * ```
 *
 * ## Handling update event
 *
 * Implement `_settingsChanged(key, value)` function in the component and
 * the function will be called each time a setting was updated.
 *
 * ```javascript
 * ...
 * _settingsChanged(key, value) {
 *  if (key === 'my-setting') {
 *    this.myValue = value;
 *  }
 * }
 * ...
 * ```
 *
 * @polymer
 * @mixinFunction
 * @memberof ArcComponents
 */
export const ArcSettingsPanelMixin = dedupingMixin((base) => {
  /**
   * @polymer
   * @mixinClass
   */
  class ASPmixin extends base {
    static get properties() {
      return {
        /**
         * When set the element will not request current settings state and
         * will wait until it's properties are set.
         */
        manual: Boolean,
        /**
         * When set the settings are baing loaded.
         */
        loading: {type: Boolean, readOnly: true, notify: true},
        /**
         * Some panels have sub pages. This tracks selected page.
         */
        page: Number,
        __settingsRestored: {type: Boolean, value: false}
      };
    }

    constructor() {
      super();
      this.__settingsUpdated = this.__settingsUpdated.bind(this);
    }

    connectedCallback() {
      super.connectedCallback();
      if (!this.manual) {
        this.loadSettings();
      }
      window.addEventListener('settings-changed', this.__settingsUpdated);
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      window.removeEventListener('settings-changed', this.__settingsUpdated);
    }
    /**
     * Dispatches `settings-read` custom event to settings provider to read
     * application settings and sets received values on the component.
     *
     * @return {Promise} Promise resolved when operartion ends.
     */
    loadSettings() {
      this._setLoading(true);
      return this._readSettings()
      .then((settings) => this._setSettings(settings))
      .catch((cause) => {
        console.warn(cause);
        throw cause;
      });
    }
    /**
     * Reads settings from the settings provider
     * @return {Promise}
     */
    _readSettings() {
      const e = new CustomEvent('settings-read', {
        cancelable: true,
        composed: true,
        bubbles: true,
        detail: {}
      });
      this.dispatchEvent(e);
      if (!e.defaultPrevented) {
        return Promise.reject('Settings provided not found.');
      }
      return e.detail.result
      .then((settings) => this._processValues(settings));
    }

    _processValues(values) {
      return values;
    }

    _setSettings() {}
    /**
     * Dispatches `settings-changed` to settings provider with new value.
     * The event is dispatched with 300 ms debouncer.
     *
     * @param {String} key Setting key
     * @param {any} value Value to store. Values are serialized
     */
    updateSetting(key, value) {
      if (!this.__settingsRestored) {
        return;
      }
      if (!this._pendingValues) {
        this._pendingValues = {};
      }
      this._pendingValues[key] = value;
      if (!this._valueDebounce) {
        this._valueDebounce = {};
      }
      if (this._valueDebounce[key]) {
        clearTimeout(this._valueDebounce[key]);
      }
      this._valueDebounce[key] = setTimeout(() => {
        this._valueDebounce[key] = undefined;
        this._updateSetting(key, this._pendingValues[key]);
        this._pendingValues[key] = undefined;
      }, 300);
    }
    /**
     * Dispatches `settings-changed` event to store the setting value.
     * @param {String} name Property name
     * @param {any} value A value to store.
     */
    _updateSetting(name, value) {
      const e = new CustomEvent('settings-changed', {
        cancelable: true,
        composed: true,
        bubbles: true,
        detail: {
          name,
          value
        }
      });
      this.dispatchEvent(e);
      if (!e.defaultPrevented) {
        console.warn('Settings provided not found.');
        return;
      }
    }
    /**
     * Returns a boolean value for the `value`.
     * @param {any} value
     * @return {Boolean}
     */
    _boolValue(value) {
      const type = typeof value;
      if (type === 'boolean') {
        return value;
      }
      if (type === 'string') {
        if (value === 'true') {
          return true;
        }
        if (value === 'false') {
          return false;
        }
      }
      return !!value;
    }
    /**
     *  Returns a numeric value for the `value`
     * @param {any} val Current value
     * @return {Number} Translated value
     */
    _numValue(val) {
      val = Number(val);
      if (val !== val) {
        return 0;
      }
      return val;
    }
    /**
     * Shows internal sub-page
     *
     * @param {ClickEvent} e
     */
    _showPage(e) {
      const path = e.composedPath();
      let target;
      while (true) {
        const item = path.shift();
        if (!item) {
          return;
        }
        if (item.dataset && item.dataset.page) {
          target = item;
          break;
        }
      }
      const page = Number(target.dataset.page);
      if (page === page) {
        this.page = page;
      }
    }
    /**
     * Restores the main page of the editor.
     */
    back() {
      this.page = 0;
    }
    /**
     * To be used when a list item has a toggle button.
     * When clicking on the list option this function should be called to
     * toggle the button.
     * @param {ClickEvent} e
     */
    _toggleOption(e) {
      const button = e.currentTarget.querySelector('paper-toggle-button');
      button.checked = !button.checked;
    }
    /**
     * Cancels the event and it's propagation.
     * @param {Event} e
     */
    _cancelEvent(e) {
      e.preventDefault();
      e.stopPropagation();
    }
    /**
     * Opens a URL in new window.
     * If the application handle `open-external-url` then it does nothing.
     *
     * @param {String} url
     */
    _openLink(url) {
      const e = new CustomEvent('open-external-url', {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: {
          url
        }
      });
      this.dispatchEvent(e);
      if (e.defaultPrevented) {
        return;
      }
      window.open(url);
    }
    /**
     * Handler for `settings-changed` event.
     * Calls `_settingsChanged` function if implementing element has this method.
     * @param {CustomEvent} e
     */
    __settingsUpdated(e) {
      if (!this._settingsChanged || e.cancelable) {
        return;
      }
      if (e.composedPath()[0] === this) {
        return;
      }
      this._settingsChanged(e.detail.name, e.detail.value);
    }
  }
  return ASPmixin;
});
