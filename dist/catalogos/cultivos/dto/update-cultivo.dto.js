"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCultivoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_cultivo_dto_1 = require("./create-cultivo.dto");
class UpdateCultivoDto extends (0, swagger_1.PartialType)(create_cultivo_dto_1.CreateCultivoDto) {
}
exports.UpdateCultivoDto = UpdateCultivoDto;
