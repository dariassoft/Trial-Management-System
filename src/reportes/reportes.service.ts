import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExcelReportGenerator } from './excel-generator';
import { PdfReportGenerator } from './pdf-generator';
import { Ensayo } from '../entities/ensayo.entity';
import { Parcela } from '../entities/parcela.entity';
import { DatosCampo } from '../entities/datos-campo.entity';
import { DatosCampoMedicion } from '../entities/datos-campo-medicion.entity';
import { DatosCosecha } from '../entities/datos-cosecha.entity';
import { Tratamiento } from '../entities/tratamiento.entity';
import { Bloque } from '../entities/bloque.entity';

@Injectable()
export class ReportesService {
  constructor(
    @InjectRepository(Ensayo)
    private ensayoRepository: Repository<Ensayo>,
    @InjectRepository(Parcela)
    private parcelaRepository: Repository<Parcela>,
    @InjectRepository(DatosCampo)
    private datosCampoRepository: Repository<DatosCampo>,
    @InjectRepository(DatosCampoMedicion)
    private datosCampoMedicionRepository: Repository<DatosCampoMedicion>,
    @InjectRepository(DatosCosecha)
    private datosCosechaRepository: Repository<DatosCosecha>,
    @InjectRepository(Tratamiento)
    private tratamientoRepository: Repository<Tratamiento>,
    @InjectRepository(Bloque)
    private bloqueRepository: Repository<Bloque>,
  ) {}

  /**
   * Obtiene todos los datos de un ensayo desde la BD
   */
  async obtenerDatosEnsayo(ensayoId: number): Promise<{
    ensayo: Ensayo | null;
    datosCampo: any[];
    datosTrilla: any[];
    metadadatos: any;
  }> {
    try {
      console.log(`📥 Obteniendo datos para ensayo ${ensayoId}...`);

      // 1. Obtener ensayo base
      const ensayo = await this.ensayoRepository.findOne({
        where: { id: ensayoId },
        relations: [
          'laboratorio',
          'cultivo',
          'variedad',
          'tipoSiembra',
          'protocolo',
          'responsable',
          'parcelas',
          'parcelas.bloque',
          'parcelas.tratamiento',
        ],
      });

      if (!ensayo) {
        console.warn(`⚠️  Ensayo ${ensayoId} no encontrado`);
        return { ensayo: null, datosCampo: [], datosTrilla: [], metadadatos: {} };
      }

      console.log(`✅ Ensayo: ${ensayo.nombreEnsayo}, ${ensayo.parcelas?.length || 0} parcelas`);

      // 2. Obtener datos de campo
      const datosCampoRaw = await this.datosCampoRepository
        .createQueryBuilder('dc')
        .leftJoinAndSelect('dc.parcela', 'p')
        .leftJoinAndSelect('p.tratamiento', 't')
        .leftJoinAndSelect('p.bloque', 'b')
        .leftJoinAndSelect('dc.mediciones', 'm')
        .leftJoinAndSelect('m.variable', 'v')
        .where('p.ensayo_id_fk = :ensayoId', { ensayoId })
        .getMany();

      console.log(`✅ Datos campo: ${datosCampoRaw.length} registros`);

      // 3. Procesar datos de campo
      const datosCampo: any[] = [];
      const parcelaMap = new Map<number, any>();

      for (const dato of datosCampoRaw) {
        const parcelaId = dato.parcela?.id;
        if (!parcelaMap.has(parcelaId)) {
          parcelaMap.set(parcelaId, {
            tratamiento: dato.parcela?.tratamiento?.id || 1,
            bloque: dato.parcela?.bloque?.nombreBloque || 'B',
            parcela: dato.parcela?.nombreParcela || `P${parcelaId}`,
          });
        }
        const fila = parcelaMap.get(parcelaId);
        for (const m of dato.mediciones || []) {
          if (m.variable?.nombre_variable) {
            fila[m.variable.nombre_variable] = this.parseNumerico(m.valor);
          }
        }
      }
      datosCampo.push(...parcelaMap.values());

      // 4. Obtener datos de cosecha
      const datosCosechaRaw = await this.datosCosechaRepository
        .createQueryBuilder('dc')
        .leftJoinAndSelect('dc.parcela', 'p')
        .leftJoinAndSelect('p.tratamiento', 't')
        .leftJoinAndSelect('p.bloque', 'b')
        .where('p.ensayo_id_fk = :ensayoId', { ensayoId })
        .getMany();

      console.log(`✅ Datos cosecha: ${datosCosechaRaw.length} registros`);

      // 5. Procesar datos de trilla
      const datosTrilla: any[] = datosCosechaRaw.map(c => ({
        tratamiento: c.parcela?.tratamiento?.id || 1,
        bloque: c.parcela?.bloque?.nombreBloque || 'B',
        parcela: c.parcela?.nombreParcela || `P${c.parcela?.id}`,
        humedad: this.parseNumerico(c.humedadPct),
        kgHa: this.parseNumerico(c.kgHaCorregido),
        gje: this.parseNumerico(c.gie),
      }));

      if (datosTrilla.length === 0 && ensayo.parcelas) {
        datosTrilla.push(...ensayo.parcelas.map(p => ({
          tratamiento: p.tratamiento?.id || 1,
          bloque: p.bloque?.nombreBloque || 'B',
          parcela: p.nombreParcela || `P${p.id}`,
          humedad: 0, kgHa: 0, gje: 0,
        })));
      }

      // 6. Metadatos
      const metadadatos = {
        ensayoId: ensayo.id,
        nombreEnsayo: ensayo.nombreEnsayo || 'Sin nombre',
        cultivo: (ensayo.cultivo as any)?.nombre || 'N/A',
        variedad: (ensayo.variedad as any)?.nombre || 'N/A',
        provincia: ensayo.provincia || 'N/A',
        departamento: ensayo.departamento || 'N/A',
        establecimiento: ensayo.establecimiento || 'N/A',
        lote: ensayo.lote || 'N/A',
        tipoSiembra: (ensayo.tipoSiembra as any)?.nombre || 'N/A',
        fechaSiembra: ensayo.fechaSiembra
          ? new Date(ensayo.fechaSiembra).toLocaleDateString('es-ES')
          : 'N/A',
        fechaCosecha: ensayo.fechaCosecha
          ? new Date(ensayo.fechaCosecha).toLocaleDateString('es-ES')
          : 'N/A',
        responsable: (ensayo.responsable as any)?.nombre || 'N/A',
        laboratorio: (ensayo.laboratorio as any)?.nombre || 'N/A',
        numeroTratamientos: [...new Set((ensayo.parcelas || []).map(p => p.tratamiento?.id))].length,
        numeroBloques: [...new Set((ensayo.parcelas || []).map(p => p.bloque?.id))].length,
      };

      console.log(`✅ Completado: ${datosCampo.length} datos campo, ${datosTrilla.length} datos trilla`);

      return { ensayo, datosCampo, datosTrilla, metadadatos };
    } catch (error) {
      console.error(`❌ Error obtenerDatosEnsayo:`, error);
      throw error;
    }
  }

  /**
   * Parsea un valor numérico desde CSV (maneja comas decimales)
   */
  private parseNumerico(valor: any): number {
    if (typeof valor === 'number') return valor;
    if (valor === undefined || valor === null || valor === '') return 0;

    const str = String(valor).trim();
    // Reemplazar coma por punto
    const numStr = str.replace(',', '.');
    const num = parseFloat(numStr);
    return isNaN(num) ? 0 : num;
  }

  /**
   * Calcula estadísticas por tratamiento
   */
  calcularEstadisticasPorTratamiento(
    datos: any[],
    campo: string = 'kgHa',
  ): Record<string, any> {
    const estadisticas: Record<string, any> = {};

    if (!datos || datos.length === 0) {
      return {
        T1: {
          n: 0,
          promedio: 0,
          desviacion: 0,
          minimo: 0,
          maximo: 0,
          coefVariacion: 0,
        },
      };
    }

    const tratamientos = [...new Set(datos.map(d => d.tratamiento))].sort();

    for (const trat of tratamientos) {
      const datosTrat = datos.filter(d => d.tratamiento === trat);
      const valores = datosTrat
        .map(d => this.parseNumerico(d[campo]))
        .filter(v => !isNaN(v) && v !== null);

      if (valores.length > 0) {
        estadisticas[`T${trat}`] = {
          n: valores.length,
          promedio: parseFloat(this.promedio(valores).toFixed(2)),
          desviacion: parseFloat(
            this.desviacionEstandar(valores).toFixed(2),
          ),
          minimo: parseFloat(Math.min(...valores).toFixed(2)),
          maximo: parseFloat(Math.max(...valores).toFixed(2)),
          coefVariacion: parseFloat(this.coefVariacion(valores).toFixed(2)),
        };
      }
    }

    return estadisticas;
  }

  /**
   * Analiza la evolución de fitotoxicidad
   */
  analizarFitotoxicidad(datosCampo: any[]): Record<string, any> {
    const ddasKeys = ['3DDA_FITO', '7DDA_FITO', '14DDA_FITO', '38DDA_FITO', '58DDA_FITO'];
    const ddas = ['3DDA', '7DDA', '14DDA', '38DDA', '58DDA'];
    const resultados: Record<string, any> = {};

    if (!datosCampo || datosCampo.length === 0) {
      return {};
    }

    const tratamientos = [...new Set(datosCampo.map(d => d.tratamiento))].sort();

    for (const trat of tratamientos) {
      resultados[`T${trat}`] = {};
      const datosTrat = datosCampo.filter(d => d.tratamiento === trat);

      for (let i = 0; i < ddasKeys.length; i++) {
        const dda = ddas[i];
        const valores = datosTrat
          .map((d: any) => this.parseNumerico(d[ddasKeys[i]]))
          .filter(v => !isNaN(v) && v !== null);

        if (valores.length > 0) {
          resultados[`T${trat}`][dda] = {
            promedio: parseFloat(this.promedio(valores).toFixed(2)),
            max: parseFloat(Math.max(...valores).toFixed(2)),
            min: parseFloat(Math.min(...valores).toFixed(2)),
          };
        }
      }
    }

    return resultados;
  }

  /**
   * Analiza viabilidad y rendimiento
   */
  analizarRendimiento(datosTrilla: any[]): Record<string, any> {
    const resultados: Record<string, any> = {};

    if (!datosTrilla || datosTrilla.length === 0) {
      return { T1: { promedio: 0, desviacion: 0, minimo: 0, maximo: 0, diferenciaTestigo: 0, porcentajeTestigo: 0, gjePromedio: 0 } };
    }

    const tratamientos = [...new Set(datosTrilla.map(d => d.tratamiento))].sort();

    // Identificar testigo (T1)
    const datosTestigo = datosTrilla.filter(d => d.tratamiento === 1);
    const kgHaTestigo = datosTestigo.map(d => this.parseNumerico(d.kgHa));
    const promTestigo = kgHaTestigo.length > 0 ? this.promedio(kgHaTestigo) : 0;

    for (const trat of tratamientos) {
      const datosTrat = datosTrilla.filter(d => d.tratamiento === trat);
      const kgHaValues = datosTrat.map(d => this.parseNumerico(d.kgHa));
      const gjeValues = datosTrat.map(d => this.parseNumerico(d.gje));

      const promTrat = kgHaValues.length > 0 ? this.promedio(kgHaValues) : 0;
      const porcentaje = promTestigo > 0 ? ((promTrat / promTestigo) * 100 - 100) : 0;

      resultados[`T${trat}`] = {
        promedio: parseFloat(promTrat.toFixed(1)),
        desviacion: parseFloat(this.desviacionEstandar(kgHaValues).toFixed(1)),
        minimo: kgHaValues.length > 0 ? parseFloat(Math.min(...kgHaValues).toFixed(1)) : 0,
        maximo: kgHaValues.length > 0 ? parseFloat(Math.max(...kgHaValues).toFixed(1)) : 0,
        diferenciaTestigo: parseFloat((promTrat - promTestigo).toFixed(1)),
        porcentajeTestigo: parseFloat(porcentaje.toFixed(1)),
        gjePromedio: gjeValues.length > 0 ? parseFloat(this.promedio(gjeValues).toFixed(1)) : 0,
      };
    }

    return resultados;
  }

  /**
   * Genera resumen ejecutivo con recomendaciones
   */
  generarResumenEjecutivo(
    datosCampo: any[],
    datosTrilla: any[],
    metadadosEnsayo: any,
  ) {
    try {
      const rendimientos = this.analizarRendimiento(datosTrilla);
      const fitotoxicidad = this.analizarFitotoxicidad(datosCampo);

      // Encontrar mejor tratamiento (máximo rendimiento)
      let mejorTrat = 'T1';
      let maxRendimiento = -Infinity;

      for (const [trat, datos] of Object.entries(rendimientos)) {
        const rendimiento = (datos as any)?.promedio || 0;
        if (rendimiento > maxRendimiento) {
          maxRendimiento = rendimiento;
          mejorTrat = trat;
        }
      }

      // Validar que mejorTrat existe en rendimientos
      if (!rendimientos[mejorTrat]) {
        mejorTrat = 'T1';
      }

      // Evaluar fitotoxicidad del mejor tratamiento
      const fitoMejor =
        (fitotoxicidad[mejorTrat]?.['58DDA'] || {}) as any;

      const rendimientoMejor = rendimientos[mejorTrat] || { porcentajeTestigo: 0 };

      return {
        ensayo: metadadosEnsayo?.ensayoId || 'N/A',
        fechaReporte: new Date().toLocaleDateString('es-ES'),
        tratamientoRecomendado: mejorTrat,
        rendimientoMejor: (maxRendimiento >= 0 ? maxRendimiento : 0).toFixed(
          1,
        ),
        aumentoRendimiento: (
          (rendimientoMejor as any)?.porcentajeTestigo || 0
        ).toFixed(1),
        fitotoxicidadMejor: fitoMejor?.promedio?.toFixed(1) || '0',
        observaciones: this.generarObservaciones(
          mejorTrat,
          rendimientos,
          fitotoxicidad,
        ),
        recomendaciones: this.generarRecomendaciones(
          mejorTrat,
          rendimientos,
          fitotoxicidad,
        ),
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error('Error en generarResumenEjecutivo:', errorMessage);
      return {
        ensayo: metadadosEnsayo?.ensayoId || 'N/A',
        fechaReporte: new Date().toLocaleDateString('es-ES'),
        tratamientoRecomendado: 'T1',
        rendimientoMejor: '0',
        aumentoRendimiento: '0',
        fitotoxicidadMejor: '0',
        observaciones: ['Error al generar análisis'],
        recomendaciones: ['Se requieren más datos'],
      };
    }
  }

  /**
   * Genera PDF del reporte
   */
  async generarPDF(datosCampo: any[], datosTrilla: any[], metadadatos: any) {
    try {
      console.log('🔄 Iniciando generación de PDF...');
      console.log(`   - Datos de campo: ${datosCampo?.length || 0} registros`);
      console.log(`   - Datos de trilla: ${datosTrilla?.length || 0} registros`);

      const estadisticas = this.calcularEstadisticasPorTratamiento(
        datosTrilla || [],
        'kgHa',
      );
      console.log(`   - Estadísticas calculadas: ${Object.keys(estadisticas).length} tratamientos`);

      const resumen = this.generarResumenEjecutivo(
        datosCampo || [],
        datosTrilla || [],
        metadadatos,
      );
      console.log(
        `   - Resumen generado: ${resumen.tratamientoRecomendado}`,
      );

      const pdfData = {
        metadatos: metadadatos,
        datosCampo: datosCampo || [],
        datosTrilla: datosTrilla || [],
        estadisticas,
        resumen,
      };

      console.log('   - Llamando a PdfReportGenerator...');
      const buffer = await PdfReportGenerator.generarReporteEnsayo(pdfData);
      console.log(`   ✅ PDF generado exitosamente: ${buffer.length} bytes`);

      return buffer;
    } catch (error) {
      console.error('❌ Error generando PDF:', error);
      throw error;
    }
  }

  /**
   * Genera Excel del reporte
   */
  async generarExcel(datosCampo: any[], datosTrilla: any[], metadadatos: any) {
    try {
      console.log('🔄 Iniciando generación de Excel...');
      console.log(`   - Datos de campo: ${datosCampo?.length || 0} registros`);
      console.log(`   - Datos de trilla: ${datosTrilla?.length || 0} registros`);

      const estadisticas = this.calcularEstadisticasPorTratamiento(
        datosTrilla || [],
        'kgHa',
      );
      console.log(`   - Estadísticas calculadas: ${Object.keys(estadisticas).length} tratamientos`);

      const excelData = {
        metadatos: metadadatos,
        datosCampo: datosCampo || [],
        datosTrilla: datosTrilla || [],
        estadisticas,
      };

      console.log('   - Llamando a ExcelReportGenerator...');
      const buffer = await ExcelReportGenerator.generarReporteEnsayo(
        excelData,
      );
      console.log(`   ✅ Excel generado exitosamente: ${buffer.length} bytes`);

      return buffer;
    } catch (error) {
      console.error('❌ Error generando Excel:', error);
      throw error;
    }
  }

  // ============ FUNCIONES MATEMÁTICAS ============

  private promedio(valores: number[]): number {
    if (valores.length === 0) return 0;
    return valores.reduce((a, b) => a + b, 0) / valores.length;
  }

  private desviacionEstandar(valores: number[]): number {
    if (valores.length === 0) return 0;
    const prom = this.promedio(valores);
    const varianza = valores.reduce((a, b) => a + Math.pow(b - prom, 2), 0) / valores.length;
    return Math.sqrt(varianza);
  }

  private coefVariacion(valores: number[]): number {
    if (valores.length === 0) return 0;
    const prom = this.promedio(valores);
    if (prom === 0) return 0;
    const desv = this.desviacionEstandar(valores);
    return (desv / prom) * 100;
  }

  private generarObservaciones(
    mejorTrat: string,
    rendimientos: Record<string, any>,
    fitotoxicidad: Record<string, any>,
  ): string[] {
    const obs: string[] = [];

    try {
      const tratData = rendimientos[mejorTrat];
      if (!tratData) {
        return ['No hay datos disponibles'];
      }

      const rendMejor = tratData?.porcentajeTestigo || 0;
      if (rendMejor > 10) {
        obs.push(`${mejorTrat} superó al testigo en ${rendMejor}%`);
      } else if (rendMejor > 0) {
        obs.push(`${mejorTrat} mostró ligera mejora`);
      } else {
        obs.push(`${mejorTrat} rendimiento similar al testigo`);
      }

      const fitoMejor =
        (fitotoxicidad[mejorTrat]?.['58DDA']?.promedio || 0) as number;
      if (fitoMejor === 0) {
        obs.push(`${mejorTrat} sin fitotoxicidad`);
      } else if (fitoMejor <= 2) {
        obs.push(`${mejorTrat} fitotoxicidad baja`);
      } else {
        obs.push(`${mejorTrat} fitotoxicidad moderada`);
      }
    } catch (error) {
      obs.push('Error al generar observaciones');
    }

    return obs.length > 0 ? obs : ['Sin observaciones'];
  }

  private generarRecomendaciones(
    mejorTrat: string,
    rendimientos: Record<string, any>,
    fitotoxicidad: Record<string, any>,
  ): string[] {
    const recomendaciones: string[] = [];

    try {
      const tratData = rendimientos[mejorTrat];
      if (!tratData) {
        return ['Se requieren más datos'];
      }

      const fitoMejor =
        (fitotoxicidad[mejorTrat]?.['58DDA']?.promedio || 0) as number;
      const rendMejor = tratData?.porcentajeTestigo || 0;

      if (rendMejor > 5 && fitoMejor <= 1) {
        recomendaciones.push(
          `Usar ${mejorTrat} en condiciones similares`,
        );
      } else if (rendMejor > 0 && fitoMejor <= 2) {
        recomendaciones.push(`${mejorTrat} recomendado con precaución`);
      } else {
        recomendaciones.push(`Evaluar más ensayos antes de adoptar`);
      }

      if (fitoMejor > 3) {
        recomendaciones.push(`Evaluar en estadíos más avanzados`);
      }
    } catch (error) {
      recomendaciones.push('Error al generar recomendaciones');
    }

    return recomendaciones.length > 0
      ? recomendaciones
      : ['Sin recomendaciones'];
  }
}

