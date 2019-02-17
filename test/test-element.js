import {PolymerElement} from '../../../@polymer/polymer/polymer-element.js';
import {ArcSettingsPanelMixin} from '../arc-settings-panel-mixin.js';
import '../arc-settings-panel-styles.js';
import {html} from '../../../@polymer/polymer/lib/utils/html-tag.js';
/**
 * @customElement
 * @polymer
 * @demo demo/index.html
 * @appliesMixin ArcComponents.ArcSettingsPanelMixin
 */
class TestElement extends ArcSettingsPanelMixin(PolymerElement) {
  static get template() {
    return html`
    <style include="arc-settings-panel-styles">
    :host {
      display: block;
    }
    </style>
`;
  }

  static get is() {
    return 'test-element';
  }
}
window.customElements.define(TestElement.is, TestElement);
