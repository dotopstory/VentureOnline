module.exports = function() {
    this.Equipment = class {
        constructor() {
            this.weapon1 = null;
            this.ability = null;
            this.armor = null;
            this.ring = null;
        }

        equip(item, slot) {
            if(item.item_class !== 'equipment' || item.item_slot !== slot) return false;

            //Equip weapon
            if(slot === 'Weapon1') this.weapon1 = item;
            else if(slot === 'Ability') this.ability = item;
            else if(slot === 'Armor') this.armor = item;
            else if(slot === 'Ring') this.ring = item;
            return true;
        }
    };
};