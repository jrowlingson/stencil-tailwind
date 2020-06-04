'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const CalciteButton = class {

  constructor(hostRef) {
    __stencil_registerInstance(this, hostRef);
    this.classNames = () => ({
      '<px-4 text-sm> lg<px-8 text-lg>': this.hasText,
      'p-12': !this.hasText,
    });
  }

};
__decorate([
  Styles()
], CalciteButton.prototype, "classNames", void 0);
CalciteButton.style = `.text-lg { font-size: 1.125rem; } \n.text-sm { font-size: 0.875rem; } \n.px-8 { padding-left: 2rem; padding-right: 2rem; } \n.px-4 { padding-left: 1rem; padding-right: 1rem; } \n.p-12 { padding: 3rem; } \n ${calciteButtonStyle}`;

exports.CalciteButton = CalciteButton;
