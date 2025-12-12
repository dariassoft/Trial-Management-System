import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTratamientoProductoDto {
  @ApiProperty({ example: 1, description: 'ID del tratamiento' })
  @IsInt()
  tratamientoId: number;

  @ApiProperty({ example: 2, description: 'ID del producto' })
  @IsInt()
  productoId: number;

  @ApiPropertyOptional({ example: '800', description: 'Dosis aplicada' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  dosis?: string | null;

  @ApiPropertyOptional({ example: 'cc/ha', description: 'Unidad de dosis' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  unidadDosis?: string | null;

  @ApiPropertyOptional({ example: 'V4', description: 'Estadio de aplicación (V2, V3, V4, etc.)' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  estadio?: string | null;
}
