(function() {
    let apiUrl = "http://static.somesoft.site/venture/";
    let staticContent = {};

    $(document).ready(function() {
        loadStaticData(apiUrl);
    });

    function loadStaticData(apiUrl) {
        load("items", apiUrl + "items.json", "#itemTab");
        load("entities", apiUrl + "entities.json");
    }

    function load(target, url, element) {
        $.getJSON(url, function(data) {
            data = JSON.parse(JSON.stringify(data))[target];
            staticContent[target] = data;
            displayItems(element, data);
        });
    }

    function displayItems(target, data) {
        let weapons = data.filter(value => value.item_slot === "Weapon1");
        $.each(weapons, function(index, value) {
            $("#weaponTab").append(`
            <div class="col-md-4">
                <div class="itemPill">
                    <div class="row">
                        <div class="col-md-9"><span class="itemPillTitle">` + value.name + `</span></div> 
                        <div class="col-md-3"><span class="itemPillTitle label label-info">T` + value.tier + `</span></div> 
                    </div> 
                    <span class="itemPillText">` + value.description + `</span>
                    <hr>
                    <span class="itemPillText">Fire Rate: ` + value.fire_rate + `</span>
                    <span class="itemPillText">Damage: ` + value.attack1.damage_min + ` - ` + value.attack1.damage_max + `</span>
                    <span class="itemPillText">Projectiles: ` + value.attack1.number_of_projectiles + `</span>
                    <span class="itemPillText">Piercing: ` + value.attack1.multihit + `</span>
                </div>
            </div>`);
        });

        let abilities = data.filter(value => value.item_slot === "Ability");
        $.each(abilities, function(index, value) {
            $("#abilityTab").append(`
            <div class="col-md-4">
                <div class="itemPill">
                    <div class="row">
                        <div class="col-md-9"><span class="itemPillTitle">` + value.name + `</span></div> 
                        <div class="col-md-3"><span class="itemPillTitle label label-info">T` + value.tier + `</span></div> 
                    </div> 
                    <hr>
                    <span class="itemPillText">Tier: ` + value.tier + `</span>
                    <span class="itemPillText">Damage: ` + value.attack1.damage_min + ` - ` + value.attack1.damage_max + `</span>
                    <span class="itemPillText">Projectiles: ` + value.attack1.number_of_projectiles + `</span>
                </div>
            </div>`);
        });

        let armor = data.filter(value => value.item_slot === "Armor");
        $.each(armor, function(index, value) {
            $("#armorTab").append(`
            <div class="col-md-4">
                <div class="itemPill">
                    <div class="row">
                        <div class="col-md-9"><span class="itemPillTitle">` + value.name + `</span></div> 
                        <div class="col-md-3"><span class="itemPillTitle label label-info">T` + value.tier + `</span></div> 
                    </div> 
                    <hr>
                    <span class="itemPillText">Tier: ` + value.tier + `</span>
                </div>
            </div>`);
        });

        let misc = data.filter(value => value.item_slot !== "Weapon1" && value.item_slot !== "Armor" && value.item_slot !== "Ability");
        $.each(misc, function(index, value) {
            $("#miscTab").append(`
            <div class="col-md-4">
                <div class="itemPill">
                    <div class="row">
                        <div class="col-md-9"><span class="itemPillTitle">` + value.name + `</span></div> 
                        <div class="col-md-3"><span class="itemPillTitle label label-info">T` + value.tier + `</span></div> 
                    </div> 
                    <hr>
                    <span class="itemPillText">Tier: ` + value.tier + `</span>
                </div>
            </div>`);
        });
    }
})();
