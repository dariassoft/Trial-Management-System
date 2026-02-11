import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateProductoDto {
  @ApiProperty({
    example: 'Herbicida X',
    maxLength: 100,
    description: 'Nombre comercial del producto'
  })
  @IsString()
  @MaxLength(100)
  nombre_comercial: string;

  @ApiPropertyOptional({
    example: 'Herbicida selectivo para maíz post-emergencia',
    maxLength: 500,
    description: 'Descripción detallada del producto'
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  descripcion?: string | null;

  @ApiPropertyOptional({
    example: 'Glifosato 48%',
    maxLength: 255,
    description: 'Principio activo del producto'
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  principio_activo?: string | null;

  @ApiPropertyOptional({
    example: 'SL',
    maxLength: 50,
    description: 'Formulación del producto (SL, WP, SC, etc)'
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  formulacion?: string | null;

  @ApiPropertyOptional({
    example: 'Herbicida',
    maxLength: 100,
    description: 'Tipo de producto (Herbicida, Fungicida, Insecticida, etc)'
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  tipo?: string | null;

  @ApiPropertyOptional({
    example: 'L/ha',
    maxLength: 50,
    description: 'Unidad de medida (L/ha, cc/ha, kg/ha, etc)'
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  unidad?: string | null;

  @ApiPropertyOptional({
    example: 150.50,
    description: 'Precio unitario del producto'
  })
  @IsOptional()
  @IsNumber()
  precio?: number | null;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID del Laboratorio propietario'
  })
  @IsOptional()
  @IsInt()
  laboratorioId?: number;
}
