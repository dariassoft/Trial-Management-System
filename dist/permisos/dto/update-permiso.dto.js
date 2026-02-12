"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePermisoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_permiso_dto_1 = require("./create-permiso.dto");
class UpdatePermisoDto extends (0, swagger_1.PartialType)(create_permiso_dto_1.CreatePermisoDto) {
}
exports.UpdatePermisoDto = UpdatePermisoDto;
