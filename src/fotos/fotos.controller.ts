import { Controller, Get, Param, ParseIntPipe, Delete, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags, ApiBearerAuth, ApiUnauthorizedResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { FotosService } from './fotos.service';
import { FotoRegistro } from '../entities/foto-registro.entity';
import { PageQueryDto } from '../common/dto/pagination.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../entities/rol.entity';

@ApiTags('fotos')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'No autenticado' })
@ApiForbiddenResponse({ description: 'Prohibido' })
@Controller('fotos')
export class FotosController {
  constructor(private readonly service: FotosService) {}

  @Get('por-visita/:visitaId')
  @ApiOperation({ summary: 'Listar fotos por visita (paginado)' })
  @ApiParam({ name: 'visitaId', type: Number, description: 'ID de la visita (DatosCampo)' })
  @ApiOkResponse({ description: 'Lista paginada de fotos', schema: { example: { data: [ { id: 1, file_name: 'foto.jpg', file_path: '/uploads/visita_1/foto.jpg', mime_type: 'image/jpeg', fecha_subida: '2025-11-04T10:00:00.000Z', visita: { id: 1 } } ], meta: { total: 1, page: 1, limit: 10, pageCount: 1 } } } })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, type: String })
  @ApiQuery({ name: 'order', required: false, enum: ['ASC','DESC'] })
  findByVisita(@Param('visitaId', ParseIntPipe) visitaId: number, @Query() query: PageQueryDto) {
    return this.service.findByVisita(visitaId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener foto por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: FotoRegistro })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Roles(Role.TECNICO, Role.MANAGER, Role.ADMIN, Role.SUPERADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar foto' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ schema: { example: { deleted: true } } })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
