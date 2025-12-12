import { PartialType } from '@nestjs/swagger';
import { CreateProtocoloVariableDto } from './create-protocolo-variable.dto';

export class UpdateProtocoloVariableDto extends PartialType(
  CreateProtocoloVariableDto,
) {}
