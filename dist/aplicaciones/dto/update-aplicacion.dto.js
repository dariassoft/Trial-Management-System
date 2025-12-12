"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAplicacionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_aplicacion_dto_1 = require("./create-aplicacion.dto");
class UpdateAplicacionDto extends (0, swagger_1.PartialType)(create_aplicacion_dto_1.CreateAplicacionDto) {
}
exports.UpdateAplicacionDto = UpdateAplicacionDto;
