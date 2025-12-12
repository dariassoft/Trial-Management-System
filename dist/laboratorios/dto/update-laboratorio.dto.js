"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateLaboratorioDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_laboratorio_dto_1 = require("./create-laboratorio.dto");
class UpdateLaboratorioDto extends (0, swagger_1.PartialType)(create_laboratorio_dto_1.CreateLaboratorioDto) {
}
exports.UpdateLaboratorioDto = UpdateLaboratorioDto;
