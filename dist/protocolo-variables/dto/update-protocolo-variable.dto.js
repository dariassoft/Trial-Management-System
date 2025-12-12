"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProtocoloVariableDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_protocolo_variable_dto_1 = require("./create-protocolo-variable.dto");
class UpdateProtocoloVariableDto extends (0, swagger_1.PartialType)(create_protocolo_variable_dto_1.CreateProtocoloVariableDto) {
}
exports.UpdateProtocoloVariableDto = UpdateProtocoloVariableDto;
