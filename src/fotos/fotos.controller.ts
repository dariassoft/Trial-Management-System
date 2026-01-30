import {
  Controller, Get, Post, Param, ParseIntPipe, Delete, Query,
  UseInterceptors, UploadedFile, Body, BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags, ApiBearerAuth,
  ApiUnauthorizedResponse, ApiForbiddenResponse, ApiConsumes, ApiBody
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { FotosService } from './fotos.service';
import { FotoRegistro } from '../entities/foto-registro.entity';
import { PageQueryDto } from '../common/dto/pagination.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../entities/rol.entity';

// Configuración de Multer para almacenamiento
const storage = diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = join(process.cwd(), 'uploads', 'media');
    if (!existsSync(uploadPath)) {
      mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  // Aceptar imágenes y videos
  if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp|mp4|webm|mov|avi)$/)) {
    cb(null, true);
  } else {
    cb(new BadRequestException('Tipo de archivo no soportado'), false);
  }
};

@ApiTags('fotos')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'No autenticado' })
@ApiForbiddenResponse({ description: 'Prohibido' })
@Controller('fotos')
export class FotosController {
  constructor(private readonly service: FotosService) {}

  @Post('upload')
  @Roles(Role.TECNICO, Role.MANAGER, Role.ADMIN, Role.SUPERADMIN)
  @UseInterceptors(FileInterceptor('file', { storage, fileFilter, limits: { fileSize: 100 * 1024 * 1024 } }))
  @ApiOperation({ summary: 'Subir foto o video' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary', description: 'Archivo de imagen o video' },
        parcelaId: { type: 'number', description: 'ID de la parcela' },
        momentoId: { type: 'number', description: 'ID del momento de evaluación' },
        ensayoId: { type: 'number', description: 'ID del ensayo' },
        type: { type: 'string', enum: ['photo', 'video'], description: 'Tipo de archivo' },
      },
      required: ['file'],
    },
  })
  @ApiOkResponse({ type: FotoRegistro })
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('parcelaId') parcelaId?: string,
    @Body('momentoId') momentoId?: string,
    @Body('ensayoId') ensayoId?: string,
    @Body('type') type?: string,
  ) {
    if (!file) {
      throw new BadRequestException('No se recibió ningún archivo');
    }

    // Crear registro en la base de datos
    // Por ahora guardamos el archivo y retornamos info
    // TODO: Crear o buscar DatosCampo para asociar la foto

    const filePath = `/uploads/media/${file.filename}`;

    return {
      success: true,
      file: {
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: filePath,
      },
      meta: {
        parcelaId: parcelaId ? parseInt(parcelaId, 10) : null,
        momentoId: momentoId ? parseInt(momentoId, 10) : null,
        ensayoId: ensayoId ? parseInt(ensayoId, 10) : null,
        type: type || 'photo',
      },
    };
  }

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
