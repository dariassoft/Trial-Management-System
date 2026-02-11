import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, MaxLength, IsOptional, IsEmail, IsBoolean } from 'class-validator';

export class CreateLaboratorioDto {
  @ApiProperty({
    example: 'ACME Agro Labs',
    maxLength: 100,
    description: 'Nombre único del laboratorio'
  })
  @IsString()
  @MaxLength(100)
  nombre: string;

  @ApiPropertyOptional({
    example: 'Laboratorio de análisis de suelos',
    maxLength: 500,
    description: 'Descripción del laboratorio'
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  descripcion?: string | null;

  @ApiPropertyOptional({
    example: 'Calle Principal 123, Ciudad',
    maxLength: 255,
    description: 'Dirección física del laboratorio'
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  direccion?: string | null;

  @ApiPropertyOptional({
    example: '3875789133',
    maxLength: 50,
    description: 'Teléfono de contacto'
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  telefono?: string | null;

  @ApiPropertyOptional({
    example: 'lab@acme.com',
    maxLength: 100,
    description: 'Email del laboratorio'
  })
  @IsOptional()
  @IsEmail()
  email?: string | null;

  @ApiPropertyOptional({
    example: 'Ing. Juan Pérez',
    maxLength: 100,
    description: 'Nombre del contacto responsable'
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  contacto?: string | null;

  @ApiPropertyOptional({
    example: true,
    default: true,
    description: 'Laboratorio activo'
  })
  @IsOptional()
  @IsBoolean()
  esta_activo?: boolean;
}
