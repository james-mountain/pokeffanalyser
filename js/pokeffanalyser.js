'use strict';
var typenames = [
    "normal",
    "steel",
    "rock",
    "fire",
    "fairy",
    "bug",
    "dragon",
    "electric",
    "dark",
    "fighting",
    "flying",
    "ghost",
    "grass",
    "ground",
    "ice",
    "poison",
    "psychic",
    "water"
];
var typemultipliers = [];
var reqs = [];

function getMultiAttackDmgIndex(atktype, deftype) {
    return typemultipliers[typenames.findIndex(v => v === atktype)][typenames.findIndex(v => v === deftype)];
}

function getInputMulti() {
    var multi = getMultiAttackDmgIndex(document.getElementById('atktype').value, document.getElementById('firstdef').value);
    if (document.getElementById('seconddef').value !== "none") {
        multi *= getMultiAttackDmgIndex(document.getElementById('atktype').value, document.getElementById('seconddef').value);
    }
    alert(multi + "x");
}

function loadTypesFromFile() {
    for (let i = 0; i < typenames.length; i++) {
        var url = "./typedata/" + typenames[i] + ".json";

        reqs[i] = new XMLHttpRequest();
        reqs[i].open("GET", url);
        reqs[i].responseType = 'json';
        reqs[i].send();

        reqs[i].onload = function() {
            var currepdmgrels = this.response.damage_relations;
            typemultipliers[i] = Array(typenames.length).fill(1);

            currepdmgrels.half_damage_to.forEach(function(typ) {
                typemultipliers[i][typenames.findIndex(v => v === typ.name)] = 0.5;
            })

            currepdmgrels.no_damage_to.forEach(function(typ) {
                typemultipliers[i][typenames.findIndex(v => v === typ.name)] = 0;
            })

            currepdmgrels.double_damage_to.forEach(function(typ) {
                typemultipliers[i][typenames.findIndex(v => v === typ.name)] = 2;
            })
        }
    }
}

document.addEventListener("DOMContentLoaded", function(event) {
    var typedelems = document.getElementsByClassName("types")
    for (var i = 0; i < typedelems.length; i++) {
        typenames.forEach(function(typn) {
            var option = document.createElement("option");
            option.text = typn;
            typedelems[i].add(option);
        })
    }
});

loadTypesFromFile();
