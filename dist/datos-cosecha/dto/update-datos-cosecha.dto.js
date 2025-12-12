"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDatosCosechaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_datos_cosecha_dto_1 = require("./create-datos-cosecha.dto");
class UpdateDatosCosechaDto extends (0, swagger_1.PartialType)(create_datos_cosecha_dto_1.CreateDatosCosechaDto) {
}
exports.UpdateDatosCosechaDto = UpdateDatosCosechaDto;
