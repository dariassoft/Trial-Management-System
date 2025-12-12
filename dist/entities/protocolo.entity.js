"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Protocolo = void 0;
const typeorm_1 = require("typeorm");
const tratamiento_entity_1 = require("./tratamiento.entity");
const ensayo_entity_1 = require("./ensayo.entity"); // Asegúrate de que esta línea exista
let Protocolo = class Protocolo {
};
exports.Protocolo = Protocolo;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'protocolo_id' }),
    __metadata("design:type", Number)
], Protocolo.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Protocolo.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Protocolo.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => tratamiento_entity_1.Tratamiento, (tratamiento) => tratamiento.protocolo),
    __metadata("design:type", Array)
], Protocolo.prototype, "tratamientos", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ensayo_entity_1.Ensayo, (ensayo) => ensayo.protocolo) // Asegúrate de que esta relación exista
    ,
    __metadata("design:type", Array)
], Protocolo.prototype, "ensayos", void 0);
exports.Protocolo = Protocolo = __decorate([
    (0, typeorm_1.Entity)('Protocolo'),
    (0, typeorm_1.Unique)(['nombre'])
], Protocolo);
