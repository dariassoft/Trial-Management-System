"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTratamientoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_tratamiento_dto_1 = require("./create-tratamiento.dto");
class UpdateTratamientoDto extends (0, swagger_1.PartialType)(create_tratamiento_dto_1.CreateTratamientoDto) {
}
exports.UpdateTratamientoDto = UpdateTratamientoDto;
