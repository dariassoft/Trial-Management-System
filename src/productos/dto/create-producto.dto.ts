import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateProductoDto {
  @ApiProperty({ example: 'Herbicida X', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  nombre_comercial: string;

  @ApiPropertyOptional({ example: 'Glifosato 48%', maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  principio_activo?: string | null;

  @ApiPropertyOptional({ example: 'SL', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  formulacion?: string | null;

  @ApiPropertyOptional({ example: 1, description: 'ID del Laboratorio propietario' })
  @IsOptional()
  @IsInt()
  laboratorioId?: number;
}
