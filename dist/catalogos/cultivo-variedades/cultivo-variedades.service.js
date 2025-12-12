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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CultivoVariedadesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cultivo_entity_1 = require("../../entities/cultivo.entity");
const cultivo_variedad_entity_1 = require("../../entities/cultivo-variedad.entity");
let CultivoVariedadesService = class CultivoVariedadesService {
    constructor(variedadRepository, cultivoRepository) {
        this.variedadRepository = variedadRepository;
        this.cultivoRepository = cultivoRepository;
    }
    create(createDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombre, cultivo_id } = createDto;
            // Verificar que el cultivo padre exista
            const cultivo = yield this.cultivoRepository.findOne({ where: { id: cultivo_id } });
            if (!cultivo) {
                throw new common_1.NotFoundException(`El Cultivo con ID #${cultivo_id} no existe`);
            }
            const nuevaVariedad = this.variedadRepository.create({
                nombre,
                cultivo,
                cultivo_id,
            });
            return this.variedadRepository.save(nuevaVariedad);
        });
    }
    findAll() {
        return this.variedadRepository.find({ relations: ['cultivo'] });
    }
    findOne(id) {
        return this.variedadRepository.findOne({ where: { id }, relations: ['cultivo'] });
    }
    update(id, updateDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const variedad = yield this.variedadRepository.preload(Object.assign({ id }, updateDto));
            if (!variedad)
                throw new common_1.NotFoundException(`Variedad con ID #${id} no encontrada`);
            if (updateDto.cultivo_id) {
                const cultivo = yield this.cultivoRepository.findOne({ where: { id: updateDto.cultivo_id } });
                if (!cultivo) {
                    throw new common_1.NotFoundException(`El Cultivo con ID #${updateDto.cultivo_id} no existe`);
                }
                variedad.cultivo = cultivo;
            }
            return this.variedadRepository.save(variedad);
        });
    }
    remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const variedad = yield this.findOne(id);
            if (!variedad)
                throw new common_1.NotFoundException(`Variedad con ID #${id} no encontrada`);
            return this.variedadRepository.remove(variedad);
        });
    }
};
exports.CultivoVariedadesService = CultivoVariedadesService;
exports.CultivoVariedadesService = CultivoVariedadesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cultivo_variedad_entity_1.CultivoVariedad)),
    __param(1, (0, typeorm_1.InjectRepository)(cultivo_entity_1.Cultivo)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CultivoVariedadesService);
