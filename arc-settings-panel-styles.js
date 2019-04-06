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
import '../../@polymer/polymer/polymer-element.js';
const styleElement = document.createElement('dom-module');
styleElement.innerHTML =
`<template>
 <style>
 .panel-title {
   @apply --arc-font-subhead;
   @apply --layout-horizontal;
   @apply --layout-center;
   color: var(--arc-settings-panel-header-color);
   @apply --arc-settings-panel-header;
 }

 .panel-icon {
   color: var(--arc-settings-panel-icon-color, rgba(0, 0, 0, 0.34));
   width: 24px;
   height: 24px;
 }

 .nav-away-icon {
   transform: rotate(-90deg);
 }

 .clickable {
   cursor: pointer;
 }

 .card {
   padding: 12px;
   border-radius: 4px;
   @apply --shadow-elevation-4dp;
   background-color: var(--arc-settings-panel-card-background-color);
 }

 p {
   @apply --select-text;
   @apply --arc-font-body1;
   color: var(--arc-settings-panel-description-color, rgba(0,0,0,0.74));
   margin: 16px;
 }

 .error-toast {
   background-color: var(--warning-primary-color, #FF7043);
   color: var(--warning-contrast-color, #fff);
   @apply --error-toast;
 }
 </style>
</template>`;
styleElement.register('arc-settings-panel-styles');
