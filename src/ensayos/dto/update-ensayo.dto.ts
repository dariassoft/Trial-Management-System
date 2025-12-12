import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNumber, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// Helper DTOs to validate nested objects with an 'id' property
class RelationIdDto {
  @IsInt()
  id: number;
}

export class UpdateEnsayoDto {
  @ApiPropertyOptional({ description: 'ID del ensayo (se ignora, se usa el de la URL)', example: 71 })
  @IsOptional()
  @IsInt()
  id?: number;

  @ApiPropertyOptional({ description: 'Nombre del ensayo', example: 'Ensayo de Girasol 2025 (Corregido)' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  nombreEnsayo?: string;

  @ApiPropertyOptional({ description: 'ID del Protocolo asociado', example: 3 })
  @IsOptional()
  @IsInt()
  protocoloId?: number | null;
  
  @ApiPropertyOptional({ type: () => RelationIdDto, description: 'Objeto Protocolo con ID' })
  @IsOptional()
  @ValidateNested()
  @Type(() => RelationIdDto)
  protocolo?: RelationIdDto;

  @ApiPropertyOptional({ description: 'Código/identificador asignado por el laboratorio', example: 'LAB-2025-004-MOD' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  codigoLabor?: string | null;

  @ApiPropertyOptional({ description: 'ID del Laboratorio asociado', example: 2 })
  @IsOptional()
  @IsInt()
  laboratorioId?: number | null;

  @ApiPropertyOptional({ type: () => RelationIdDto, description: 'Objeto Laboratorio con ID' })
  @IsOptional()
  @ValidateNested()
  @Type(() => RelationIdDto)
  laboratorio?: RelationIdDto;

  @ApiPropertyOptional({ description: 'ID del Tipo de Ensayo (catálogo)', example: 5 })
  @IsOptional()
  @IsInt()
  tipoEnsayoId?: number | null;

  @ApiPropertyOptional({ type: () => RelationIdDto, description: 'Objeto TipoEnsayo con ID' })
  @IsOptional()
  @ValidateNested()
  @Type(() => RelationIdDto)
  tipoEnsayo?: RelationIdDto;

  @ApiPropertyOptional({ description: 'ID del Usuario responsable del ensayo', example: 6 })
  @IsOptional()
  @IsInt()
  responsableId?: number | null;

  @ApiPropertyOptional({ type: () => RelationIdDto, description: 'Objeto Responsable con ID' })
  @IsOptional()
  @ValidateNested()
  @Type(() => RelationIdDto)
  responsable?: RelationIdDto;

  @ApiPropertyOptional({ description: 'Provincia', example: 'Santa Fe' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  provincia?: string | null;

  @ApiPropertyOptional({ description: 'Departamento', example: 'General López' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  departamento?: string | null;

  @ApiPropertyOptional({ description: 'Establecimiento', example: 'La Perseverancia' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  establecimiento?: string | null;

  @ApiPropertyOptional({ description: 'Lote', example: 'Lote 12B' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  lote?: string | null;

  @ApiPropertyOptional({ description: 'Latitud en grados decimales', example: -33.754 })
  @IsOptional()
  @IsNumber()
  latitud?: number | null;

  @ApiPropertyOptional({ description: 'Longitud en grados decimales', example: -61.96 })
  @IsOptional()
  @IsNumber()
  longitud?: number | null;

  @ApiPropertyOptional({ description: 'ID del Cultivo (Especie)', example: 2 })
  @IsOptional()
  @IsInt()
  cultivoId?: number | null;

  @ApiPropertyOptional({ type: () => RelationIdDto, description: 'Objeto Cultivo con ID' })
  @IsOptional()
  @ValidateNested()
  @Type(() => RelationIdDto)
  cultivo?: RelationIdDto;

  @ApiPropertyOptional({ description: 'ID de la Variedad del Cultivo', example: 2 })
  @IsOptional()
  @IsInt()
  variedadId?: number | null;

  @ApiPropertyOptional({ type: () => RelationIdDto, description: 'Objeto Variedad con ID' })
  @IsOptional()
  @ValidateNested()
  @Type(() => RelationIdDto)
  variedad?: RelationIdDto;

  @ApiPropertyOptional({ description: 'ID del Tipo de Siembra', example: 2 })
  @IsOptional()
  @IsInt()
  tipoSiembraId?: number | null;

  @ApiPropertyOptional({ type: () => RelationIdDto, description: 'Objeto TipoSiembra con ID' })
  @IsOptional()
  @ValidateNested()
  @Type(() => RelationIdDto)
  tipoSiembra?: RelationIdDto;

  @ApiPropertyOptional({ description: 'Distancia entre surcos (cm)', example: 70 })
  @IsOptional()
  @IsNumber()
  distSurcosCm?: number | null;

  @ApiPropertyOptional({ description: 'Fecha de Inicio (YYYY-MM-DD)', example: '2025-10-15' })
  @IsOptional()
  @IsDateString()
  fechaInicio?: string | null;

  @ApiPropertyOptional({ description: 'Fecha de Siembra (YYYY-MM-DD)', example: '2025-10-20' })
  @IsOptional()
  @IsDateString()
  fechaSiembra?: string | null;

  @ApiPropertyOptional({ description: 'Fecha de Cosecha (YYYY-MM-DD)', example: '2026-04-25' })
  @IsOptional()
  @IsDateString()
  fechaCosecha?: string | null;

  @ApiPropertyOptional({ description: 'Estado del ensayo', example: 'Activo' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  status?: string | null;
}
