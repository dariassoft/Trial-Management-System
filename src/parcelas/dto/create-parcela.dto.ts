import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateParcelaDto {
  @ApiProperty({ example: 1, description: 'ID del ensayo' })
  @IsInt()
  ensayoId: number;

  @ApiProperty({ example: 1, description: 'ID del bloque' })
  @IsInt()
  bloqueId: number;

  @ApiProperty({ example: 1, description: 'ID del tratamiento' })
  @IsInt()
  tratamientoId: number;

  @ApiPropertyOptional({ description: 'Nombre/código manual de la parcela (único dentro del ensayo)', example: '26-BASF-0001-PRE-1 A', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  nombreParcela?: string | null;

  @ApiPropertyOptional({ example: 1, description: 'Posición X en grilla (opcional)' })
  @IsOptional()
  @IsInt()
  posXGrid?: number | null;

  @ApiPropertyOptional({ example: 2, description: 'Posición Y en grilla (opcional)' })
  @IsOptional()
  @IsInt()
  posYGrid?: number | null;
}
