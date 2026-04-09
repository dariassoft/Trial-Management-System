import { Injectable, NotFoundException, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/rol.entity';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { Ensayo } from '../entities/ensayo.entity';
import { Bloque } from '../entities/bloque.entity';
import { Parcela } from '../entities/parcela.entity';
import { DatosCampo } from '../entities/datos-campo.entity';
import { DatosSiembra } from '../entities/datos-siembra.entity';
import { DatosCosecha } from '../entities/datos-cosecha.entity';
import { Protocolo } from '../entities/protocolo.entity';
import { Tratamiento } from '../entities/tratamiento.entity';
import { TratamientoProducto } from '../entities/tratamiento-producto.entity';
import { Laboratorio } from '../entities/laboratorio.entity';
import { Producto } from '../entities/producto.entity';
import { TipoEnsayo } from '../entities/tipo-ensayo.entity';
import { TipoEnsayoVariable } from '../entities/tipo-ensayo-variable.entity';
import { TipoEnsayoEvaluacionDia } from '../entities/tipo-ensayo-evaluacion-dia.entity';
import { ProtocoloVariable } from '../entities/protocolo-variable.entity';
import { Aplicacion } from '../entities/aplicacion.entity';
import { MomentoEvaluacion } from '../entities/momento-evaluacion.entity';
import {
  EstadoFlujoResponseDto,
  PasoFlujoDto,
  PrerequisitosResponseDto,
  PrerequisitoPasoDto,
} from './dto/estado-flujo.dto';

@Injectable({ scope: Scope.REQUEST })
export class AsistenteFlujoService {
  constructor(
    @Inject(REQUEST) private readonly req: Request,
    @InjectRepository(Ensayo) private readonly ensayoRepo: Repository<Ensayo>,
    @InjectRepository(Bloque) private readonly bloqueRepo: Repository<Bloque>,
    @InjectRepository(Parcela) private readonly parcelaRepo: Repository<Parcela>,
    @InjectRepository(DatosCampo) private readonly datosCampoRepo: Repository<DatosCampo>,
    @InjectRepository(DatosSiembra) private readonly datosSiembraRepo: Repository<DatosSiembra>,
    @InjectRepository(DatosCosecha) private readonly datosCosechaRepo: Repository<DatosCosecha>,
    @InjectRepository(Protocolo) private readonly protocoloRepo: Repository<Protocolo>,
    @InjectRepository(Tratamiento) private readonly tratamientoRepo: Repository<Tratamiento>,
    @InjectRepository(TratamientoProducto) private readonly tratProdRepo: Repository<TratamientoProducto>,
    @InjectRepository(Laboratorio) private readonly labRepo: Repository<Laboratorio>,
    @InjectRepository(Producto) private readonly productoRepo: Repository<Producto>,
    @InjectRepository(TipoEnsayo) private readonly tipoEnsayoRepo: Repository<TipoEnsayo>,
    @InjectRepository(TipoEnsayoVariable) private readonly tipoVarRepo: Repository<TipoEnsayoVariable>,
    @InjectRepository(TipoEnsayoEvaluacionDia) private readonly tipoDiaRepo: Repository<TipoEnsayoEvaluacionDia>,
    @InjectRepository(ProtocoloVariable) private readonly protoVarRepo: Repository<ProtocoloVariable>,
    @InjectRepository(Aplicacion) private readonly aplicacionRepo: Repository<Aplicacion>,
    @InjectRepository(MomentoEvaluacion) private readonly momentoRepo: Repository<MomentoEvaluacion>,
  ) {}

  private get auth() {
    const user = (this.req as any)?.user as JwtPayload | undefined;
    const isInvitado = user?.rol === Role.INVITADO;
    const labIds = (user?.lab_ids || []) as number[];
    return { isInvitado, labIds };
  }

  /**
   * Obtiene el estado completo de flujo de trabajo de un ensayo existente
   */
  async getEstado(ensayoId: number): Promise<EstadoFlujoResponseDto> {
    // 1. Cargar ensayo con relaciones
    const ensayo = await this.ensayoRepo.findOne({
      where: { id: ensayoId },
      relations: ['laboratorio', 'tipoEnsayo', 'protocolo', 'cultivo', 'variedad', 'status'],
    });

    if (!ensayo) {
      throw new NotFoundException(`Ensayo #${ensayoId} no encontrado`);
    }

    const pasos: PasoFlujoDto[] = [];

    // === PASO 1: Laboratorio ===
    const labOk = !!ensayo.laboratorio;
    pasos.push({
      id: 'laboratorio',
      orden: 1,
      nombre: 'Laboratorio',
      descripcion: 'El ensayo debe estar asociado a un laboratorio',
      completado: labOk,
      detalle: labOk ? `Laboratorio: ${ensayo.laboratorio!.nombre}` : 'Sin laboratorio asignado',
      ruta: '/admin/laboratorios',
      icono: 'building',
    });

    // === PASO 2: Tipo de Ensayo con variables y DDAs ===
    let tipoOk = false;
    let variablesCount = 0;
    let diasCount = 0;
    if (ensayo.tipoEnsayo) {
      variablesCount = await this.tipoVarRepo.count({ where: { tipoEnsayo: { id: ensayo.tipoEnsayo.id } } });
      diasCount = await this.tipoDiaRepo.count({ where: { tipoEnsayo: { id: ensayo.tipoEnsayo.id } } });
      tipoOk = variablesCount > 0 && diasCount > 0;
    }
    pasos.push({
      id: 'tipo_ensayo',
      orden: 2,
      nombre: 'Tipo de Ensayo',
      descripcion: 'Definir tipo de ensayo con variables a medir y días de evaluación (DDA)',
      completado: tipoOk,
      detalle: ensayo.tipoEnsayo
        ? `${ensayo.tipoEnsayo.nombre} — ${variablesCount} variable(s), ${diasCount} DDA(s)`
        : 'Sin tipo de ensayo asignado',
      ruta: '/tipos-ensayo',
      icono: 'clipboard-list',
    });

    // === PASO 3: Protocolo con Tratamientos y Productos ===
    let protocoloOk = false;
    let tratamientosCount = 0;
    let tratamientosConProductos = 0;
    if (ensayo.protocolo) {
      const tratamientos = await this.tratamientoRepo.find({
        where: { protocolo: { id: ensayo.protocolo.id } },
        relations: ['productos'],
      });
      tratamientosCount = tratamientos.length;
      tratamientosConProductos = tratamientos.filter(t => t.productos && t.productos.length > 0).length;
      // Considerar OK si hay al menos 1 tratamiento (el testigo puede no tener producto)
      protocoloOk = tratamientosCount > 0;
    }
    pasos.push({
      id: 'protocolo',
      orden: 3,
      nombre: 'Protocolo y Tratamientos',
      descripcion: 'Definir protocolo con tratamientos y sus productos asociados',
      completado: protocoloOk,
      detalle: ensayo.protocolo
        ? `${ensayo.protocolo.nombre} — ${tratamientosCount} tratamiento(s), ${tratamientosConProductos} con productos`
        : 'Sin protocolo asignado',
      ruta: ensayo.protocolo ? `/protocolos/${ensayo.protocolo.id}` : '/protocolos',
      icono: 'beaker',
    });

    // === PASO 4: Ensayo creado (siempre completado si estamos aquí) ===
    pasos.push({
      id: 'ensayo',
      orden: 4,
      nombre: 'Ensayo Creado',
      descripcion: 'El ensayo ha sido creado con los datos básicos',
      completado: true,
      detalle: `${ensayo.nombreEnsayo}${ensayo.cultivo ? ' — ' + ensayo.cultivo.nombre : ''}`,
      ruta: `/ensayos/${ensayo.id}`,
      icono: 'document-check',
    });

    // === PASO 5: Bloques ===
    const bloquesCount = await this.bloqueRepo.count({ where: { ensayo: { id: ensayoId } } });
    const bloquesOk = bloquesCount > 0;
    pasos.push({
      id: 'bloques',
      orden: 5,
      nombre: 'Bloques (Repeticiones)',
      descripcion: 'Crear los bloques/repeticiones del ensayo',
      completado: bloquesOk,
      detalle: `${bloquesCount} bloque(s) creado(s)`,
      ruta: `/bloques?ensayoId=${ensayoId}`,
      icono: 'view-grid',
    });

    // === PASO 6: Parcelas ===
    const parcelasCount = await this.parcelaRepo.count({ where: { ensayo: { id: ensayoId } } });
    const parcelasEsperadas = bloquesCount * tratamientosCount;
    const parcelasOk = parcelasCount > 0 && (parcelasEsperadas === 0 || parcelasCount >= parcelasEsperadas);
    pasos.push({
      id: 'parcelas',
      orden: 6,
      nombre: 'Parcelas',
      descripcion: 'Generar parcelas (bloque × tratamiento)',
      completado: parcelasOk,
      detalle: parcelasEsperadas > 0
        ? `${parcelasCount}/${parcelasEsperadas} parcela(s)`
        : `${parcelasCount} parcela(s) creada(s)`,
      progreso: parcelasEsperadas > 0 ? `${parcelasCount}/${parcelasEsperadas}` : undefined,
      ruta: `/parcelas?ensayoId=${ensayoId}`,
      icono: 'table-cells',
    });

    // === PASO 7: Aplicaciones y Momentos de Evaluación ===
    const aplicacionesCount = await this.aplicacionRepo.count({ where: { ensayo: { id: ensayoId } } });
    const momentosCount = await this.momentoRepo
      .createQueryBuilder('m')
      .innerJoin('m.aplicacion', 'a')
      .where('a.ensayo_id_fk = :ensayoId', { ensayoId })
      .getCount();
    const aplicacionesOk = aplicacionesCount > 0 && momentosCount > 0;
    pasos.push({
      id: 'aplicaciones',
      orden: 7,
      nombre: 'Aplicaciones y Momentos',
      descripcion: 'Registrar aplicaciones con sus momentos de evaluación',
      completado: aplicacionesOk,
      detalle: `${aplicacionesCount} aplicación(es), ${momentosCount} momento(s) de evaluación`,
      ruta: `/ensayos/${ensayoId}`,
      icono: 'calendar',
    });

    // === PASO 8: Datos de Siembra ===
    const siembraCount = await this.datosSiembraRepo
      .createQueryBuilder('ds')
      .innerJoin('ds.parcela', 'p')
      .where('p.ensayo_id_fk = :ensayoId', { ensayoId })
      .getCount();
    const siembraOk = parcelasCount > 0 && siembraCount >= parcelasCount;
    pasos.push({
      id: 'siembra',
      orden: 8,
      nombre: 'Datos de Siembra',
      descripcion: 'Registrar los datos de siembra por parcela',
      completado: siembraOk,
      detalle: `${siembraCount}/${parcelasCount} parcela(s) con datos de siembra`,
      progreso: `${siembraCount}/${parcelasCount}`,
      ruta: '/siembra',
      icono: 'leaf',
    });

    // === PASO 9: Mediciones (Datos de Campo) ===
    const medicionesCount = await this.datosCampoRepo
      .createQueryBuilder('dc')
      .innerJoin('dc.parcela', 'p')
      .where('p.ensayo_id_fk = :ensayoId', { ensayoId })
      .getCount();
    // Esperado: parcelas × momentos
    const medicionesEsperadas = parcelasCount * momentosCount;
    const medicionesOk = medicionesEsperadas > 0 && medicionesCount >= medicionesEsperadas;
    pasos.push({
      id: 'mediciones',
      orden: 9,
      nombre: 'Mediciones (Datos de Campo)',
      descripcion: 'Registrar las mediciones de campo en cada parcela por cada momento de evaluación',
      completado: medicionesOk,
      detalle: medicionesEsperadas > 0
        ? `${medicionesCount}/${medicionesEsperadas} registro(s) de medición`
        : `${medicionesCount} registro(s) de medición`,
      progreso: medicionesEsperadas > 0 ? `${medicionesCount}/${medicionesEsperadas}` : undefined,
      ruta: '/mediciones',
      icono: 'chart-bar',
    });

    // === PASO 10: Datos de Cosecha ===
    const cosechaCount = await this.datosCosechaRepo
      .createQueryBuilder('dcos')
      .innerJoin('dcos.parcela', 'p')
      .where('p.ensayo_id_fk = :ensayoId', { ensayoId })
      .getCount();
    const cosechaOk = parcelasCount > 0 && cosechaCount >= parcelasCount;
    pasos.push({
      id: 'cosecha',
      orden: 10,
      nombre: 'Datos de Cosecha',
      descripcion: 'Registrar los datos de cosecha por parcela',
      completado: cosechaOk,
      detalle: `${cosechaCount}/${parcelasCount} parcela(s) con datos de cosecha`,
      progreso: `${cosechaCount}/${parcelasCount}`,
      ruta: '/cosecha',
      icono: 'archive-box',
    });

    // === PASO 11: Reportes (disponibilidad) ===
    const reporteDisponible = medicionesOk || cosechaOk; // Al menos una fuente de datos
    pasos.push({
      id: 'reportes',
      orden: 11,
      nombre: 'Reportes',
      descripcion: 'Exportar reportes PDF/Excel con los datos recolectados',
      completado: reporteDisponible,
      detalle: reporteDisponible
        ? 'Datos suficientes para generar reportes'
        : 'Se necesitan mediciones o datos de cosecha para generar reportes',
      ruta: '/reportes',
      icono: 'document-text',
    });

    // Calcular progreso
    const completados = pasos.filter(p => p.completado).length;
    const total = pasos.length;
    const porcentaje = Math.round((completados / total) * 100);

    // Siguiente paso
    const siguientePaso = pasos.find(p => !p.completado) || null;

    return {
      ensayoId: ensayo.id,
      nombreEnsayo: ensayo.nombreEnsayo,
      pasos,
      siguientePaso,
      progreso: { completados, total, porcentaje },
    };
  }

  /**
   * Verifica prerequisitos globales antes de poder crear un ensayo
   */
  async getPrerequisitos(): Promise<PrerequisitosResponseDto> {
    const prerequisitos: PrerequisitoPasoDto[] = [];

    // 1. Laboratorios
    const labCount = await this.labRepo.count({ where: { esta_activo: true } });
    prerequisitos.push({
      id: 'laboratorios',
      nombre: 'Laboratorios',
      disponible: labCount > 0,
      cantidad: labCount,
      detalle: labCount > 0 ? `${labCount} laboratorio(s) activo(s)` : 'No hay laboratorios creados',
      ruta: '/admin/laboratorios',
    });

    // 2. Productos
    const productoCount = await this.productoRepo.count();
    prerequisitos.push({
      id: 'productos',
      nombre: 'Productos',
      disponible: productoCount > 0,
      cantidad: productoCount,
      detalle: productoCount > 0 ? `${productoCount} producto(s) disponible(s)` : 'No hay productos creados',
      ruta: '/admin/productos',
    });

    // 3. Tipos de Ensayo con variables
    const tipoCount = await this.tipoEnsayoRepo.count({ where: { activo: true } });
    // Contar cuántos tipos tienen variables asignadas
    const tiposConVariables = await this.tipoVarRepo
      .createQueryBuilder('tev')
      .select('tev.tipo_ensayo_id_fk', 'tipoId')
      .groupBy('tev.tipo_ensayo_id_fk')
      .getRawMany();
    prerequisitos.push({
      id: 'tipos_ensayo',
      nombre: 'Tipos de Ensayo',
      disponible: tipoCount > 0 && tiposConVariables.length > 0,
      cantidad: tipoCount,
      detalle: tipoCount > 0
        ? `${tipoCount} tipo(s), ${tiposConVariables.length} con variables configuradas`
        : 'No hay tipos de ensayo creados',
      ruta: '/tipos-ensayo',
    });

    // 4. Variables de medición (Protocolo_Variable)
    const varCount = await this.protoVarRepo.count();
    prerequisitos.push({
      id: 'variables',
      nombre: 'Variables de Medición',
      disponible: varCount > 0,
      cantidad: varCount,
      detalle: varCount > 0 ? `${varCount} variable(s) definida(s)` : 'No hay variables de medición creadas',
      ruta: '/tipos-ensayo',
    });

    // 5. Protocolos con tratamientos
    const protocoloCount = await this.protocoloRepo.count();
    const protocolosConTrat = await this.tratamientoRepo
      .createQueryBuilder('t')
      .select('t.protocolo_id_fk', 'protocoloId')
      .groupBy('t.protocolo_id_fk')
      .getRawMany();
    prerequisitos.push({
      id: 'protocolos',
      nombre: 'Protocolos con Tratamientos',
      disponible: protocoloCount > 0 && protocolosConTrat.length > 0,
      cantidad: protocoloCount,
      detalle: protocoloCount > 0
        ? `${protocoloCount} protocolo(s), ${protocolosConTrat.length} con tratamientos`
        : 'No hay protocolos creados',
      ruta: '/protocolos',
    });

    // Evaluar si puede crear ensayo (mínimo: lab + tipo + protocolo)
    const puedeCrear = prerequisitos.every(p => p.disponible);
    const faltantes = prerequisitos.filter(p => !p.disponible).map(p => p.nombre);

    return {
      puedeCrearEnsayo: puedeCrear,
      prerequisitos,
      mensaje: puedeCrear
        ? 'Todos los prerequisitos están cumplidos. Puede crear un nuevo ensayo.'
        : `Faltan prerequisitos: ${faltantes.join(', ')}`,
    };
  }
}

