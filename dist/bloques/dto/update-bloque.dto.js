"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBloqueDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_bloque_dto_1 = require("./create-bloque.dto");
class UpdateBloqueDto extends (0, swagger_1.PartialType)(create_bloque_dto_1.CreateBloqueDto) {
}
exports.UpdateBloqueDto = UpdateBloqueDto;
