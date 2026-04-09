import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/** Representa un paso individual del flujo de trabajo */
export class PasoFlujoDto {
  @ApiProperty({ description: 'Identificador único del paso', example: 'laboratorio' })
  id: string;

  @ApiProperty({ description: 'Número de orden del paso', example: 1 })
  orden: number;

  @ApiProperty({ description: 'Nombre legible del paso', example: 'Laboratorio' })
  nombre: string;

  @ApiProperty({ description: 'Descripción breve del paso' })
  descripcion: string;

  @ApiProperty({ description: '¿El paso está completado?', example: true })
  completado: boolean;

  @ApiPropertyOptional({ description: 'Detalle extra del estado' })
  detalle?: string;

  @ApiPropertyOptional({ description: 'Progreso parcial (ej: "3/10 parcelas")' })
  progreso?: string;

  @ApiProperty({ description: 'Ruta en el frontend para completar este paso', example: '/admin/laboratorios' })
  ruta: string;

  @ApiPropertyOptional({ description: 'Ícono sugerido para el paso' })
  icono?: string;
}

/** Resumen de progreso general */
export class ProgresoFlujoDto {
  @ApiProperty({ example: 5 })
  completados: number;

  @ApiProperty({ example: 10 })
  total: number;

  @ApiProperty({ example: 50 })
  porcentaje: number;
}

/** Respuesta completa del estado de flujo de un ensayo */
export class EstadoFlujoResponseDto {
  @ApiProperty({ example: 42 })
  ensayoId: number;

  @ApiProperty({ example: 'Ensayo Soja Norte 2026' })
  nombreEnsayo: string;

  @ApiProperty({ type: [PasoFlujoDto] })
  pasos: PasoFlujoDto[];

  @ApiPropertyOptional({ type: PasoFlujoDto, description: 'Próximo paso a completar' })
  siguientePaso?: PasoFlujoDto | null;

  @ApiProperty({ type: ProgresoFlujoDto })
  progreso: ProgresoFlujoDto;
}

/** Estado de un prerequisito global */
export class PrerequisitoPasoDto {
  @ApiProperty({ example: 'laboratorios' })
  id: string;

  @ApiProperty({ example: 'Laboratorios' })
  nombre: string;

  @ApiProperty({ example: true })
  disponible: boolean;

  @ApiProperty({ example: 3 })
  cantidad: number;

  @ApiPropertyOptional({ description: 'Detalle adicional' })
  detalle?: string;

  @ApiProperty({ description: 'Ruta para crear/gestionar', example: '/admin/laboratorios' })
  ruta: string;
}

/** Respuesta de prerequisitos globales (antes de crear un ensayo) */
export class PrerequisitosResponseDto {
  @ApiProperty({ description: '¿Están todos los prerequisitos mínimos cumplidos?' })
  puedeCrearEnsayo: boolean;

  @ApiProperty({ type: [PrerequisitoPasoDto] })
  prerequisitos: PrerequisitoPasoDto[];

  @ApiPropertyOptional({ description: 'Mensaje resumen' })
  mensaje?: string;
}

