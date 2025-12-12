"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMomentoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_momento_dto_1 = require("./create-momento.dto");
class UpdateMomentoDto extends (0, swagger_1.PartialType)(create_momento_dto_1.CreateMomentoDto) {
}
exports.UpdateMomentoDto = UpdateMomentoDto;
