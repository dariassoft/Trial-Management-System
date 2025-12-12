import { Controller, Patch, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProtocoloVariablesService } from './protocolo-variables.service';
import { UpdateProtocoloVariableDto } from './dto/update-protocolo-variable.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../entities/rol.entity';

@ApiTags('Protocolo - Variables')
@ApiBearerAuth()
@Controller('protocolo-variables')
export class ProtocoloVariablesController {
  constructor(private readonly service: ProtocoloVariablesService) {}

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Actualizar una variable de protocolo por su ID' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProtocoloVariableDto) {
    return this.service.update(id, dto);
  }
}
