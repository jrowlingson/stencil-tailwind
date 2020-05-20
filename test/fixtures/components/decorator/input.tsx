export const CalciteButton = class {

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
CalciteButton.style = calciteButtonStyle;
