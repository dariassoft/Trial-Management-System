import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, IsEnum, IsOptional, MaxLength, IsBoolean } from 'class-validator';
import { AccionPermiso } from '../../entities/permiso.entity';

export class CreatePermisoDto {
  @ApiProperty({
    description: 'ID del rol al que pertenece este permiso',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  rol_id: number;

  @ApiProperty({
    description: 'Recurso/módulo (ej: laboratorios, usuarios, productos)',
    example: 'laboratorios',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  recurso: string;

  @ApiProperty({
    description: 'Acción permitida',
    example: 'VER',
    enum: AccionPermiso,
  })
  @IsEnum(AccionPermiso)
  @IsNotEmpty()
  accion: AccionPermiso;

  @ApiPropertyOptional({
    description: 'Descripción del permiso',
    example: 'Permite ver todos los laboratorios',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  descripcion?: string | null;

  @ApiPropertyOptional({
    description: 'Permiso activo',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}

