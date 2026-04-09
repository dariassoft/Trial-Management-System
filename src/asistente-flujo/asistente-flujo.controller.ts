import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiBearerAuth, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiParam } from '@nestjs/swagger';
import { AsistenteFlujoService } from './asistente-flujo.service';
import { EstadoFlujoResponseDto, PrerequisitosResponseDto } from './dto/estado-flujo.dto';

@ApiTags('asistente-flujo')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'No autenticado' })
@ApiForbiddenResponse({ description: 'Prohibido' })
@Controller('asistente-flujo')
export class AsistenteFlujoController {
  constructor(private readonly asistenteFlujoService: AsistenteFlujoService) {}

  @Get('prerequisitos')
  @ApiOperation({
    summary: 'Verificar prerequisitos globales para crear un ensayo',
    description: 'Devuelve el estado de todos los prerequisitos necesarios antes de crear un ensayo: laboratorios, productos, tipos de ensayo, variables y protocolos.',
  })
  @ApiOkResponse({ type: PrerequisitosResponseDto })
  getPrerequisitos() {
    return this.asistenteFlujoService.getPrerequisitos();
  }

  @Get('estado/:ensayoId')
  @ApiOperation({
    summary: 'Obtener estado del flujo de trabajo de un ensayo',
    description: 'Devuelve todos los pasos del flujo de trabajo con su estado de completitud, progreso y siguiente paso a completar.',
  })
  @ApiParam({ name: 'ensayoId', type: Number, description: 'ID del ensayo' })
  @ApiOkResponse({ type: EstadoFlujoResponseDto })
  getEstado(@Param('ensayoId', ParseIntPipe) ensayoId: number) {
    return this.asistenteFlujoService.getEstado(ensayoId);
  }
}

