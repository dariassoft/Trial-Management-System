import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { NotificacionesService } from './notificaciones.service';
import { UpdateNotificacionDto } from './dto/update-notificacion.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { JwtPayload } from '../auth/jwt-payload.interface';

@ApiTags('notificaciones')
@Controller('notificaciones')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class NotificacionesController {
  constructor(
    private readonly notificacionesService: NotificacionesService,
  ) {}

  @Post('generar')
  @ApiOperation({ summary: 'Generar notificaciones manualmente para el usuario actual' })
  async generarNotificaciones(@Req() req: Request) {
    const user = req.user as JwtPayload;
    await this.notificacionesService.generateForUser(user.sub);
    return { message: 'Notificaciones generadas exitosamente.' };
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Obtener cantidad de notificaciones sin leer' })
  async getUnreadCount(@Req() req: Request) {
    const user = req.user as JwtPayload;
    const count = await this.notificacionesService.countUnread(user.sub);
    return { count };
  }

  @Patch('mark-all-read')
  @ApiOperation({ summary: 'Marcar todas las notificaciones como leídas' })
  async markAllAsRead(@Req() req: Request) {
    const user = req.user as JwtPayload;
    await this.notificacionesService.markAllAsRead(user.sub);
    return { message: 'Todas las notificaciones marcadas como leídas.' };
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las notificaciones del usuario actual' })
  findAll(@Req() req: Request) {
    const user = req.user as JwtPayload;
    return this.notificacionesService.findAll(user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una notificación por ID' })
  findOne(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as JwtPayload;
    return this.notificacionesService.findOne(+id, user.sub);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una notificación (marcar como leída/no leída)' })
  update(@Param('id') id: string, @Body() updateDto: UpdateNotificacionDto, @Req() req: Request) {
    const user = req.user as JwtPayload;
    return this.notificacionesService.update(+id, updateDto, user.sub);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una notificación' })
  remove(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as JwtPayload;
    return this.notificacionesService.remove(+id, user.sub);
  }
}
