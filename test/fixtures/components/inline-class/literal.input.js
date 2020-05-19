export const CalciteButton = class {

  render() {
    const iconEl = (h("calcite-icon", { class: "text-sm p-4", icon: this.icon, scale: iconScale }));
  }

};
CalciteButton.style = calciteButtonStyle;
