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
exports.TiposEnsayoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const tipo_ensayo_entity_1 = require("../../entities/tipo-ensayo.entity");
const protocolo_variable_entity_1 = require("../../entities/protocolo-variable.entity");
const tipo_ensayo_evaluacion_dia_entity_1 = require("../../entities/tipo-ensayo-evaluacion-dia.entity");
let TiposEnsayoService = class TiposEnsayoService {
    constructor(repository, varRepository, diaRepository) {
        this.repository = repository;
        this.varRepository = varRepository;
        this.diaRepository = diaRepository;
    }
    // ... (métodos CRUD de TipoEnsayo)
    create(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const newTipo = this.repository.create(dto);
            return this.repository.save(newTipo);
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.find({ order: { nombre: 'ASC' } });
        });
    }
    findOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const tipo = yield this.repository.findOne({ where: { id } });
            if (!tipo) {
                throw new common_1.NotFoundException(`Tipo de ensayo con ID ${id} no encontrado.`);
            }
            return tipo;
        });
    }
    update(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const tipo = yield this.findOne(id);
            this.repository.merge(tipo, dto);
            return this.repository.save(tipo);
        });
    }
    remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.findOne(id);
            yield this.repository.delete(id);
            return { deleted: true };
        });
    }
    // --- Variables ---
    listVariables(tipoEnsayoId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.varRepository.find({
                where: { tipoEnsayo: { id: tipoEnsayoId } },
                order: { nombre_variable: 'ASC' },
            });
        });
    }
    addVariable(tipoEnsayoId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const tipoEnsayo = yield this.findOne(tipoEnsayoId);
            const newVar = this.varRepository.create(Object.assign(Object.assign({}, dto), { tipoEnsayo }));
            return this.varRepository.save(newVar);
        });
    }
    removeVariable(variableId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Se busca la variable para asegurar que existe antes de borrar
            const variable = yield this.varRepository.findOne({ where: { id: variableId } });
            if (!variable) {
                throw new common_1.NotFoundException(`Variable con ID ${variableId} no encontrada.`);
            }
            yield this.varRepository.delete(variableId);
            return { deleted: true };
        });
    }
    // --- Días de Evaluación ---
    getDias(tipoEnsayoId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.diaRepository.find({
                where: { tipoEnsayo: { id: tipoEnsayoId } },
                order: { dia: 'ASC' },
            });
        });
    }
    setEvaluacion(tipoEnsayoId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const tipoEnsayo = yield this.findOne(tipoEnsayoId);
            tipoEnsayo.evaluacionCsv = Array.isArray(dto.dias) ? dto.dias.join(',') : dto.dias;
            yield this.repository.save(tipoEnsayo);
            yield this.diaRepository.delete({ tipoEnsayo: { id: tipoEnsayoId } });
            if (tipoEnsayo.evaluacionCsv) {
                const dias = tipoEnsayo.evaluacionCsv.split(',').map((d) => parseInt(d.trim(), 10)).filter((d) => !isNaN(d));
                const diasEntities = dias.map((dia) => this.diaRepository.create({ tipoEnsayo, dia }));
                yield this.diaRepository.save(diasEntities);
            }
            return tipoEnsayo;
        });
    }
};
exports.TiposEnsayoService = TiposEnsayoService;
exports.TiposEnsayoService = TiposEnsayoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tipo_ensayo_entity_1.TipoEnsayo)),
    __param(1, (0, typeorm_1.InjectRepository)(protocolo_variable_entity_1.ProtocoloVariable)),
    __param(2, (0, typeorm_1.InjectRepository)(tipo_ensayo_evaluacion_dia_entity_1.TipoEnsayoEvaluacionDia)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], TiposEnsayoService);
