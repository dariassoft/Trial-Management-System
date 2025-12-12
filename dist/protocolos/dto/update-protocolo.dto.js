"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProtocoloDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_protocolo_dto_1 = require("./create-protocolo.dto");
class UpdateProtocoloDto extends (0, swagger_1.PartialType)(create_protocolo_dto_1.CreateProtocoloDto) {
}
exports.UpdateProtocoloDto = UpdateProtocoloDto;
