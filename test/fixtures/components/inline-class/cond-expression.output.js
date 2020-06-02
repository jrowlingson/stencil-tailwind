'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const CalciteButton = class {

  render() {
    const iconEl = (h("calcite-icon", { class: this.hasText ? (this.iconPosition === "end" ? "ml-2" : "mr-2") : "", icon: this.icon, scale: iconScale }));
  }

};
CalciteButton.style = `.ml-2 {  margin-left: 0.5rem;} \n.mr-2 {  margin-right: 0.5rem;} \n ${calciteButtonStyle}`;

exports.CalciteButton = CalciteButton;
