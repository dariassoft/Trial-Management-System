"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTratamientoProductoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_tratamiento_producto_dto_1 = require("./create-tratamiento-producto.dto");
class UpdateTratamientoProductoDto extends (0, swagger_1.PartialType)(create_tratamiento_producto_dto_1.CreateTratamientoProductoDto) {
}
exports.UpdateTratamientoProductoDto = UpdateTratamientoProductoDto;
