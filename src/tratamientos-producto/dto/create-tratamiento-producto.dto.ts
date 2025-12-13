import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTratamientoProductoDto {
  @ApiProperty({ example: 1, description: 'ID del tratamiento' })
  @IsInt()
  tratamientoId: number;

  @ApiProperty({ example: 2, description: 'ID del producto' })
  @IsInt()
  productoId: number;

  @ApiPropertyOptional({
    example: '800',
    description: 'Dosis aplicada (ej: 800, 500+300, 1500)',
    maxLength: 50,
    type: String
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  dosis?: string | null;

  @ApiPropertyOptional({
    example: 'cc/ha',
    description: 'Unidad de dosis (ej: cc/ha, ml, l, g, kg, gr/ha)',
    maxLength: 20,
    type: String,
    default: 'cc/ha'
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  unidadDosis?: string | null;

  @ApiPropertyOptional({
    example: 'V4',
    description: 'Estadio de aplicación - Válores: V2, V3, V4, V5, V6, V7, V8, R1, R2, R3, etc. (ej: V4, V3, sin especificar)',
    maxLength: 20,
    type: String
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  estadio?: string | null;
}
