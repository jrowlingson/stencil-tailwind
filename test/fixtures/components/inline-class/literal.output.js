'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const CalciteButton = class {

  render() {
    const iconEl = (h("calcite-icon", { class: "text-sm p-4", icon: this.icon, scale: iconScale }));
  }

};
CalciteButton.style = `.text-sm {  font-size: 0.875rem} \n.p-4 {  padding: 1rem} \n ${calciteButtonStyle}`;

exports.CalciteButton = CalciteButton;
