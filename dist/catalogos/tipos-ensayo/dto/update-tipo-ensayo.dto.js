"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTipoEnsayoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_tipo_ensayo_dto_1 = require("./create-tipo-ensayo.dto");
class UpdateTipoEnsayoDto extends (0, swagger_1.PartialType)(create_tipo_ensayo_dto_1.CreateTipoEnsayoDto) {
}
exports.UpdateTipoEnsayoDto = UpdateTipoEnsayoDto;
