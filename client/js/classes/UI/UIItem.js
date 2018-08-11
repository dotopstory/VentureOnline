class uiItem {
    constructor(element, name, requireFocus, toggleFunction, accountTypeAccess) {
        this.id = uiItem.nextID++;
        this.element = element;
        this.name = name;
        this.toggleFunction = toggleFunction;
        this.requireFocus = requireFocus; //True if ui item must be shown with no other ui items focused
        this.accountTypeAccess = accountTypeAccess;
    }

    getElement() {
        return $(this.element);
    }
}
uiItem.nextID = 0;