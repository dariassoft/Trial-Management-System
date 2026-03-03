"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDatosSiembraDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_datos_siembra_dto_1 = require("./create-datos-siembra.dto");
class UpdateDatosSiembraDto extends (0, swagger_1.PartialType)(create_datos_siembra_dto_1.CreateDatosSiembraDto) {
}
exports.UpdateDatosSiembraDto = UpdateDatosSiembraDto;
