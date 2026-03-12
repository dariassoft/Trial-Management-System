import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsEnum } from 'class-validator';
import { TipoNotificacion } from '../entities/notificacion.entity';

export class CreateNotificacionDto {
  @ApiProperty({ description: 'ID del usuario destinatario' })
  @IsInt()
  usuarioId: number;

  @ApiProperty({ description: 'Título de la notificación' })
  @IsString()
  titulo: string;

  @ApiProperty({ description: 'Descripción detallada' })
  @IsString()
  descripcion: string;

  @ApiPropertyOptional({ description: 'Link de navegación' })
  @IsOptional()
  @IsString()
  link?: string;

  @ApiPropertyOptional({ enum: TipoNotificacion, description: 'Tipo de notificación' })
  @IsOptional()
  @IsEnum(TipoNotificacion)
  tipo?: TipoNotificacion;

  @ApiPropertyOptional({ description: 'ID del ensayo relacionado' })
  @IsOptional()
  @IsInt()
  ensayoId?: number;
}
