import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateEnsayoDto {
  @ApiProperty({ description: 'Nombre del ensayo', example: 'Ensayo de Maíz Tardío 2025', type: String, maxLength: 255 })
  @IsString()
  @MaxLength(255)
  nombreEnsayo: string;

  @ApiPropertyOptional({ description: 'ID del Protocolo asociado', example: 1, type: Number })
  @IsOptional()
  @IsInt()
  protocoloId?: number | null;

  @ApiPropertyOptional({ description: 'Código/identificador asignado por el laboratorio', example: 'LAB-2025-003', type: String, maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  codigoLabor?: string | null;

  @ApiPropertyOptional({ description: 'ID del Laboratorio asociado', example: 1, type: Number })
  @IsOptional()
  @IsInt()
  laboratorioId?: number | null;

  @ApiPropertyOptional({ description: 'ID del Tipo de Ensayo (catálogo)', example: 4, type: Number })
  @IsOptional()
  @IsInt()
  tipoEnsayoId?: number | null;

  @ApiPropertyOptional({ description: 'ID del Usuario responsable del ensayo', example: 5, type: Number })
  @IsOptional()
  @IsInt()
  responsableId?: number | null;

  @ApiPropertyOptional({ description: 'Provincia', example: 'Córdoba', type: String, maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  provincia?: string | null;

  @ApiPropertyOptional({ description: 'Departamento', example: 'Río Cuarto', type: String, maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  departamento?: string | null;

  @ApiPropertyOptional({ description: 'Establecimiento', example: 'El Progreso', type: String, maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  establecimiento?: string | null;

  @ApiPropertyOptional({ description: 'Lote', example: 'Lote 7A', type: String, maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  lote?: string | null;

  @ApiPropertyOptional({ description: 'Latitud en grados decimales', example: -33.1306, type: Number })
  @IsOptional()
  @IsNumber()
  latitud?: number | null;

  @ApiPropertyOptional({ description: 'Longitud en grados decimales', example: -64.349, type: Number })
  @IsOptional()
  @IsNumber()
  longitud?: number | null;

  @ApiPropertyOptional({ description: 'ID del Cultivo (Especie)', example: 1, type: Number })
  @IsOptional()
  @IsInt()
  cultivoId?: number | null;

  @ApiPropertyOptional({ description: 'ID de la Variedad del Cultivo', example: 1, type: Number })
  @IsOptional()
  @IsInt()
  variedadId?: number | null;

  @ApiPropertyOptional({ description: 'ID del Tipo de Siembra', example: 1, type: Number })
  @IsOptional()
  @IsInt()
  tipoSiembraId?: number | null;

  @ApiPropertyOptional({ description: 'Distancia entre surcos (cm)', example: 52.5, type: Number })
  @IsOptional()
  @IsNumber()
  distSurcosCm?: number | null;

  @ApiPropertyOptional({ description: 'Fecha de Inicio (YYYY-MM-DD)', example: '2025-12-10', type: String, format: 'date' })
  @IsOptional()
  @IsDateString()
  fechaInicio?: string | null;

  @ApiPropertyOptional({ description: 'Fecha de Siembra (YYYY-MM-DD)', example: '2025-12-15', type: String, format: 'date' })
  @IsOptional()
  @IsDateString()
  fechaSiembra?: string | null;

  @ApiPropertyOptional({ description: 'Fecha de Cosecha (YYYY-MM-DD)', example: '2026-05-20', type: String, format: 'date' })
  @IsOptional()
  @IsDateString()
  fechaCosecha?: string | null;

  @ApiPropertyOptional({ description: 'ID del Estado del ensayo', example: 1, type: Number })
  @IsOptional()
  @IsInt()
  statusId?: number | null;
}
