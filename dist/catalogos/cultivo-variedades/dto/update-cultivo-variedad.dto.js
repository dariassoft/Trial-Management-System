"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCultivoVariedadDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_cultivo_variedad_dto_1 = require("./create-cultivo-variedad.dto");
class UpdateCultivoVariedadDto extends (0, swagger_1.PartialType)(create_cultivo_variedad_dto_1.CreateCultivoVariedadDto) {
}
exports.UpdateCultivoVariedadDto = UpdateCultivoVariedadDto;
