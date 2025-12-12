import { Body, Controller, Delete, Get, Param, Patch, Post, ParseIntPipe, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags, ApiParam, ApiBearerAuth, ApiUnauthorizedResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { DatosCampoService } from './datos-campo.service';
import { CreateDatosCampoDto } from './dto/create-datos-campo.dto';
import { UpdateDatosCampoDto } from './dto/update-datos-campo.dto';
import { DatosCampo } from '../entities/datos-campo.entity';
import { PageQueryDto } from '../common/dto/pagination.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FotosService } from '../fotos/fotos.service';
import { FotoRegistro } from '../entities/foto-registro.entity';
import * as Multer from 'multer';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../entities/rol.entity';


@ApiTags('datos-campo')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'No autenticado' })
@ApiForbiddenResponse({ description: 'Prohibido' })
@Controller('datos-campo')
export class DatosCampoController {
  constructor(
    private readonly service: DatosCampoService,
    private readonly fotosService: FotosService,
  ) {}

  @Roles(Role.TECNICO, Role.MANAGER, Role.ADMIN, Role.SUPERADMIN)
  @Post()
  @ApiOperation({ summary: 'Crear registro de datos de campo' })
  @ApiCreatedResponse({ type: DatosCampo, description: 'Datos de campo creados' })
  @ApiBody({
    type: CreateDatosCampoDto,
    examples: {
      default: {
        summary: 'Visita con mediciones dinámicas',
        value: {
          parcela_id_fk: 1,
          momento_id_fk: 1,
          observaciones: 'Sin observaciones',
          mediciones: [
            { variable_id: 1, valor: '10.5' },
            { variable_id: 2, valor: 'Alto' },
          ],
        },
      },
    },
  })
  create(@Body() dto: CreateDatosCampoDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar datos de campo (paginado y filtrado)' })
  @ApiOkResponse({ description: 'Lista paginada', schema: { example: { data: [], meta: { total: 0, page: 1, limit: 10, pageCount: 0 } } } })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, type: String })
  @ApiQuery({ name: 'order', required: false, enum: ['ASC','DESC'] })
  @ApiQuery({ name: 'parcelaId', required: false, type: Number })
  @ApiQuery({ name: 'momentoId', required: false, type: Number })
  findAll(@Query() query: PageQueryDto & { parcelaId?: number; momentoId?: number }) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener datos de campo por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: DatosCampo })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Roles(Role.TECNICO, Role.MANAGER, Role.ADMIN, Role.SUPERADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar datos de campo' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: DatosCampo })
  @ApiBody({
    type: UpdateDatosCampoDto,
    examples: {
      reemplazoMediciones: {
        summary: 'Actualizar observaciones y reemplazar mediciones',
        value: {
          observaciones: 'Lluvia previa a la medición',
          mediciones: [
            { variable_id: 1, valor: '9.8' },
            { variable_id: 3, valor: 'Bajo' }
          ]
        },
      },
    },
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDatosCampoDto) {
    return this.service.update(id, dto);
  }

  @Roles(Role.TECNICO, Role.MANAGER, Role.ADMIN, Role.SUPERADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar datos de campo' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ schema: { example: { deleted: true } } })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  @Roles(Role.TECNICO, Role.MANAGER, Role.ADMIN, Role.SUPERADMIN)
  @Post(':idVisita/upload-foto')
  @ApiOperation({ summary: 'Sube una foto para una visita (DatosCampo)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary', description: 'Imagen (jpg, jpeg, png); máx. 10MB' },
      },
      required: ['file'],
    },
  })
  @ApiCreatedResponse({ type: FotoRegistro, description: 'Foto registrada' })
  @ApiOkResponse({ description: 'Ejemplo de respuesta', schema: { example: { id: 1, file_name: 'foto.jpg', file_path: '/uploads/visita_1/foto.jpg', mime_type: 'image/jpeg', fecha_subida: '2025-11-04T10:00:00.000Z' } } })
  @ApiParam({ name: 'idVisita', required: true, description: 'ID de la visita (DatosCampo)', type: Number })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: Multer.diskStorage({
        destination: (
          req: any,
          file: any,
          cb: (error: Error | null, destination: string) => void,
        ) => {
          const fs = require('fs');
          const path = require('path');
          const visitaId = (req as any).params.idVisita;
          const baseDir = path.join(process.cwd(), 'uploads');
          const visitaDir = path.join(baseDir, `visita_${visitaId}`);
          if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir, { recursive: true });
          if (!fs.existsSync(visitaDir)) fs.mkdirSync(visitaDir, { recursive: true });
          cb(null, visitaDir);
        },
        filename: (
          req: any,
          file: any,
          cb: (error: Error | null, filename: string) => void,
        ) => {
          const ext = (file.mimetype && file.mimetype.split('/')[1]) || 'bin';
          const rand = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
          cb(null, `visita_${(req as any).params.idVisita}_${Date.now()}_${rand}.${ext}`);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async uploadFoto(
    @Param('idVisita', ParseIntPipe) idVisita: number,
    @UploadedFile() file: any,
  ) {
    return this.fotosService.create(idVisita, file);
  }

  @Get('mediciones/por-variable/:variableId')
  @ApiOperation({ summary: 'Listar mediciones por variable (paginado)' })
  @ApiParam({ name: 'variableId', type: Number })
  @ApiOkResponse({ description: 'Lista paginada de mediciones', schema: { example: { data: [], meta: { total: 0, page: 1, limit: 10, pageCount: 0 } } } })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, type: String })
  @ApiQuery({ name: 'order', required: false, enum: ['ASC','DESC'] })
  findMedicionesByVariable(
    @Param('variableId', ParseIntPipe) variableId: number,
    @Query() query: PageQueryDto,
  ) {
    return this.service.findMedicionesByVariable(variableId, query);
  }

  @Get('mediciones/por-visita/:visitaId')
  @ApiOperation({ summary: 'Listar mediciones por visita (paginado)' })
  @ApiParam({ name: 'visitaId', type: Number })
  @ApiOkResponse({ description: 'Lista paginada de mediciones', schema: { example: { data: [], meta: { total: 0, page: 1, limit: 10, pageCount: 0 } } } })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, type: String })
  @ApiQuery({ name: 'order', required: false, enum: ['ASC','DESC'] })
  findMedicionesByVisita(
    @Param('visitaId', ParseIntPipe) visitaId: number,
    @Query() query: PageQueryDto,
  ) {
    return this.service.findMedicionesByVisita(visitaId, query);
  }
}
