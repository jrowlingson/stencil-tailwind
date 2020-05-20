export const CalciteButton = class {

  render() {
    const iconEl = (h("calcite-icon", { class: this.hasText ? (this.iconPosition === "end" ? "ml-2" : "mr-2") : "", icon: this.icon, scale: iconScale }));
  }

};
CalciteButton.style = calciteButtonStyle;
