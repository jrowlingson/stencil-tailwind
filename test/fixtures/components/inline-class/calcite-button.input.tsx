import { registerInstance as __stencil_registerInstance, getElement as __stencil_getElement } from "@stencil/core/internal/client";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
        r = Reflect.decorate(decorators, target, key, desc);
    else
        for (var i = decorators.length - 1; i >= 0; i--)
            if (d = decorators[i])
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { h, Host, Build } from "@stencil/core/internal/client";
import { Styles } from "../../utils/styles";
import { getElementDir } from "../../utils/dom";
import calciteButtonStyle from "./calcite-button.scss?tag=calcite-button&encapsulation=shadow";
export const CalciteButton = class {
    constructor(hostRef) {
        __stencil_registerInstance(this, hostRef);
        //--------------------------------------------------------------------------
        //
        //  Properties
        //
        //--------------------------------------------------------------------------
        /** specify the color of the button, defaults to blue */
        this.color = "blue";
        /** specify the appearance style of the button, defaults to solid. */
        this.appearance = "solid";
        /** specify the scale of the button, defaults to m */
        this.scale = "m";
        /** specify the width of the button, defaults to auto */
        this.width = "auto";
        /** optionally add a calcite-loader component to the button, disabling interaction.  */
        this.loading = false;
        /** optionally add a round style to the button  */
        this.round = false;
        /** optionally add a floating style to the button - this should be positioned fixed or sticky */
        this.floating = false;
        /** optionally used with icon, select where to position the icon */
        this.iconPosition = "start";
        /** the node type of the rendered child element */
        this.childElType = "button";
        this.classNames = () => ({
            '<px-4 py-3 text-sm> lg<px-6 py-4 text-lg> sm<px-3 py-2 text-xs>': this.hasText,
            'p-4': !this.hasText,
            'shadow hover:shadow-md': this.floating,
            'rounded-full': this.round,
            'border-blue bg-blue text-white': this.solid && this.blue,
            'border-red bg-red text-white': this.solid && this.red,
            'border-gray-lighter bg-gray-lighter text-black': this.solid && this.light,
            'border-gray-darker bg-gray-darker text-white': this.solid && this.dark,
            'border-blue text-blue': this.outlined && this.blue,
            'border-red text-red': this.outlined && this.red,
            'border-black text-black': this.outlined && this.dark,
            'border-gray-light text-black': this.outlined && this.light,
            'border-transparent bg-transparent': this.transparent,
            'hover:bg-blue-light hover:border-blue-light': this.solid && this.blue,
            'hover:bg-red-light hover:border-red-light': this.solid && this.red,
            'hover:bg-gray-light hover:border-gray-light': this.solid && this.light,
            'hover:bg-gray-darkest hover:border-gray-darkest': this.solid && this.dark
        });
        /** determine if there is slotted text for styling purposes */
        this.hasText = false;
        //--------------------------------------------------------------------------
        //
        //  Private Methods
        //
        //--------------------------------------------------------------------------
        // act on a requested or nearby form based on type
        this.handleClick = (e) => {
            // this.type refers to type attribute, not child element type
            if (this.childElType === "button" && this.type !== "button") {
                const requestedForm = this.el.getAttribute("form");
                const targetForm = requestedForm
                    ? document.getElementsByName(`${requestedForm}`)[0]
                    : this.el.closest("form");
                if (targetForm) {
                    const targetFormSubmitFunction = targetForm.onsubmit;
                    switch (this.type) {
                        case "submit":
                            if (targetFormSubmitFunction)
                                targetFormSubmitFunction();
                            else if (targetForm.checkValidity())
                                targetForm.submit();
                            else
                                targetForm.reportValidity();
                            break;
                        case "reset":
                            targetForm.reset();
                            break;
                    }
                }
                e.preventDefault();
            }
        };
    }
    //--------------------------------------------------------------------------
    //
    //  Lifecycle
    //
    //--------------------------------------------------------------------------
    connectedCallback() {
        // prop validations
        let appearance = ["solid", "outline", "clear", "transparent"];
        if (!appearance.includes(this.appearance))
            this.appearance = "solid";
        let color = ["blue", "red", "dark", "light"];
        if (!color.includes(this.color))
            this.color = "blue";
        let scale = ["xs", "s", "m", "l", "xl"];
        if (!scale.includes(this.scale))
            this.scale = "m";
        let width = ["auto", "half", "full"];
        if (!width.includes(this.width))
            this.width = "auto";
        let iconPosition = ["start", "end"];
        if (this.icon !== null && !iconPosition.includes(this.iconPosition))
            this.iconPosition = "start";
        this.childElType = this.href ? "a" : "button";
        this.setupTextContentObserver();
    }
    disconnectedCallback() {
        this.observer.disconnect();
    }
    componentWillLoad() {
        if (Build.isBrowser) {
            this.updateHasText();
            const elType = this.el.getAttribute("type");
            this.type = this.childElType === "button" && elType ? elType : "submit";
        }
    }
    render() {
        const dir = getElementDir(this.el);
        const attributes = this.getAttributes();
        const Tag = this.childElType;
        const loader = (h("div", { class: "calcite-button--loader" }, h("calcite-loader", { "is-active": true, inline: true })));
        const iconScale = this.scale === "xs" || this.scale === "s" || this.scale === "m"
            ? "s"
            : this.scale === "l"
                ? "m"
                : "l";
        const iconEl = (h("calcite-icon", { class: this.hasText ? (this.iconPosition === "end" ? "ml-2" : "mr-2") : "", icon: this.icon, scale: iconScale }));
        console.log('fo');
        return (h(Host, { hasText: this.hasText, dir: dir }, h(Tag, Object.assign({}, attributes, { class: "text-sm", onClick: (e) => this.handleClick(e), disabled: this.disabled, ref: (el) => (this.childEl = el) }), this.loading ? loader : null, this.icon && this.iconPosition === "start" ? iconEl : null, h("slot", null), this.icon && this.iconPosition === "end" ? iconEl : null)));
    }
    //--------------------------------------------------------------------------
    //
    //  Public Methods
    //
    //--------------------------------------------------------------------------
    async setFocus() {
        this.childEl.focus();
    }
    updateHasText() {
        console.log('fo');
        this.hasText = this.el.textContent.length > 0;
    }
    setupTextContentObserver() {
        if (Build.isBrowser) {
            this.observer = new MutationObserver(() => {
                this.updateHasText();
            });
            this.observer.observe(this.el, { childList: true, subtree: true });
        }
    }
    getAttributes() {
        // spread attributes from the component to rendered child, filtering out props
        let props = [
            "appearance",
            "color",
            "dir",
            "hasText",
            "icon",
            "iconPosition",
            "id",
            "loading",
            "scale",
            "slot",
            "width",
            "theme",
        ];
        return Array.from(this.el.attributes)
            .filter((a) => a && !props.includes(a.name))
            .reduce((acc, { name, value }) => (Object.assign(Object.assign({}, acc), { [name]: value })), {});
    }
    get outlined() {
        return this.appearance === "outline";
    }
    get solid() {
        return this.appearance === "solid";
    }
    get transparent() {
        return this.appearance === "transparent";
    }
    get blue() {
        return this.color === "blue";
    }
    get red() {
        return this.color === "red";
    }
    get dark() {
        return this.color === "dark";
    }
    get light() {
        return this.color === "light";
    }
    get el() { return __stencil_getElement(this); }
};
__decorate([
    Styles()
], CalciteButton.prototype, "classNames", void 0);
CalciteButton.style = calciteButtonStyle;
