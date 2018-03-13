"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var PrimeiraClasse = /** @class */ (function () {
    function PrimeiraClasse(nome) {
        if (nome === void 0) { nome = ''; }
        this.nome = nome;
    }
    PrimeiraClasse.prototype.executarNome = function () {
        console.log(" Esse \n                          \u00E9 meu nome " + this.nome + "}  ");
    };
    return PrimeiraClasse;
}());
exports.PrimeiraClasse = PrimeiraClasse;
var Tribileu = /** @class */ (function () {
    function Tribileu() {
    }
    Tribileu.prototype.viajarNaPrimeiraClasse = function () {
        console.log(" Sou Tribileu ");
    };
    return Tribileu;
}());
var Jubileu = /** @class */ (function () {
    function Jubileu() {
    }
    Jubileu.prototype.viajarNaPrimeiraClasse = function () {
        console.log(" Sou Jubileu ");
    };
    return Jubileu;
}());
var SegundaClasse = /** @class */ (function (_super) {
    __extends(SegundaClasse, _super);
    function SegundaClasse() {
        return _super.call(this, 'nome') || this;
    }
    SegundaClasse.prototype.executarNome = function () {
        _super.prototype.executarNome.call(this);
        console.log(" Esse \n                          \u00E9 meu nome sobreescrito " + this.nome + "}  ");
    };
    return SegundaClasse;
}(PrimeiraClasse));
exports.SegundaClasse = SegundaClasse;
var classe = new PrimeiraClasse();
classe.executarNome();
classe = new SegundaClasse();
classe.executarNome();
var jub = new Jubileu();
jub.viajarNaPrimeiraClasse();
jub = new Tribileu();
jub.viajarNaPrimeiraClasse();
