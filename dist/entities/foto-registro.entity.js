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
exports.FotoRegistro = void 0;
const typeorm_1 = require("typeorm");
const datos_campo_entity_1 = require("./datos-campo.entity");
let FotoRegistro = class FotoRegistro {
};
exports.FotoRegistro = FotoRegistro;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'foto_id' }),
    __metadata("design:type", Number)
], FotoRegistro.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => datos_campo_entity_1.DatosCampo, (visita) => visita.fotos, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'dato_campo_id_fk' }),
    __metadata("design:type", datos_campo_entity_1.DatosCampo)
], FotoRegistro.prototype, "visita", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], FotoRegistro.prototype, "file_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500 }),
    __metadata("design:type", String)
], FotoRegistro.prototype, "file_path", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], FotoRegistro.prototype, "mime_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], FotoRegistro.prototype, "fecha_subida", void 0);
exports.FotoRegistro = FotoRegistro = __decorate([
    (0, typeorm_1.Entity)('Foto_Registro')
], FotoRegistro);
