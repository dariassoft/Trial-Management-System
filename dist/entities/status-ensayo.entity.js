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
exports.StatusEnsayo = void 0;
const typeorm_1 = require("typeorm");
const ensayo_entity_1 = require("./ensayo.entity");
let StatusEnsayo = class StatusEnsayo {
};
exports.StatusEnsayo = StatusEnsayo;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'status_id' }),
    __metadata("design:type", Number)
], StatusEnsayo.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], StatusEnsayo.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], StatusEnsayo.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], StatusEnsayo.prototype, "activo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], StatusEnsayo.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], StatusEnsayo.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ensayo_entity_1.Ensayo, (ensayo) => ensayo.status),
    __metadata("design:type", Array)
], StatusEnsayo.prototype, "ensayos", void 0);
exports.StatusEnsayo = StatusEnsayo = __decorate([
    (0, typeorm_1.Entity)('StatusEnsayo'),
    (0, typeorm_1.Index)('idx_status_nombre', ['nombre'], { unique: true })
], StatusEnsayo);
