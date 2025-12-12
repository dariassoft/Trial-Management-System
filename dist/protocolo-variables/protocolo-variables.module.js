"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtocoloVariablesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const protocolo_variables_service_1 = require("./protocolo-variables.service");
const protocolo_variables_controller_1 = require("./protocolo-variables.controller");
const protocolo_variable_entity_1 = require("../entities/protocolo-variable.entity");
let ProtocoloVariablesModule = class ProtocoloVariablesModule {
};
exports.ProtocoloVariablesModule = ProtocoloVariablesModule;
exports.ProtocoloVariablesModule = ProtocoloVariablesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([protocolo_variable_entity_1.ProtocoloVariable])],
        controllers: [protocolo_variables_controller_1.ProtocoloVariablesController],
        providers: [protocolo_variables_service_1.ProtocoloVariablesService],
    })
], ProtocoloVariablesModule);
