import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, IsOptional, MaxLength, IsBoolean } from 'class-validator';

export class CreateCultivoVariedadDto {
  @ApiProperty({
    description: 'Nombre de la variedad',
    example: 'Don Mario 40R21',
    maxLength: 150
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombre: string;

  @ApiPropertyOptional({
    description: 'Descripción de la variedad',
    example: 'Variedad tolerante a sequía',
    maxLength: 500
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  descripcion?: string | null;

  @ApiPropertyOptional({
    description: 'Características especiales',
    example: 'Alto rendimiento, resistente a enfermedades',
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  caracteristicas?: string | null;

  @ApiPropertyOptional({
    description: 'Variedad activa',
    example: true,
    default: true
  })
  @IsOptional()
  @IsBoolean()
  esta_activo?: boolean;

  @ApiProperty({
    description: 'ID del Cultivo al que pertenece',
    example: 1
  })
  @IsInt()
  @IsNotEmpty()
  cultivo_id: number;
}
