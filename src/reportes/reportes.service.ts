import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExcelReportGenerator } from './excel-generator';
import { PdfReportGenerator } from './pdf-generator';
import { CalculosReportesService } from './calculos-reportes.service';
import { ReportesEspecializadosService } from './reportes-especializados.service';
import { SvgChartsService } from './svg-charts.service';
import { Ensayo } from '../entities/ensayo.entity';
import { Parcela } from '../entities/parcela.entity';
import { DatosCampo } from '../entities/datos-campo.entity';
import { DatosCampoMedicion } from '../entities/datos-campo-medicion.entity';
import { DatosCosecha } from '../entities/datos-cosecha.entity';
import { Tratamiento } from '../entities/tratamiento.entity';
import { Bloque } from '../entities/bloque.entity';
import { Aplicacion } from '../entities/aplicacion.entity';
import { MomentoEvaluacion } from '../entities/momento-evaluacion.entity';

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
    @InjectRepository(Aplicacion)
    private aplicacionRepository: Repository<Aplicacion>,
    // NUEVOS SERVICIOS
    private calculosService: CalculosReportesService,
    private reportesEspecializadosService: ReportesEspecializadosService,
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
      // 1. Obtener ensayo base CON TODAS LAS RELACIONES
      const ensayo = await this.ensayoRepository.findOne({
        where: { id: ensayoId },
        relations: [
          'laboratorio',
          'cultivo',      // ← IMPORTANTE: Cargar relación cultivo
          'variedad',     // ← IMPORTANTE: Cargar relación variedad
          'tipoSiembra',  // ← IMPORTANTE: Cargar relación tipoSiembra
          'protocolo',
          'responsable',
          'parcelas',
          'parcelas.bloque',
          'parcelas.tratamiento',
        ],
      });

      if (!ensayo) {
        return { ensayo: null, datosCampo: [], datosTrilla: [], metadadatos: {} };
      }

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

      // 3. Procesar datos de campo
      const datosCampo: any[] = [];
      const parcelaMap = new Map<number, any>();

      for (const dato of datosCampoRaw) {
        const parcelaId = dato.parcela?.id || 0;
        if (!parcelaMap.has(parcelaId)) {
          parcelaMap.set(parcelaId, {
            tratamiento: dato.parcela?.tratamiento?.id || 1,
            bloque: dato.parcela?.bloque?.nombreBloque || 'B',
            parcela: dato.parcela?.nombreParcela || `P${parcelaId}`,
          });
        }
        const fila = parcelaMap.get(parcelaId);
        for (const m of dato.mediciones || []) {
          if (m.variable?.nombre_variable && fila) {
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

      // OBTENER DATOS DE APLICACION PARA EL ENSAYO
      const aplicacion = await this.aplicacionRepository
        .createQueryBuilder('a')
        .where('a.ensayo_id_fk = :ensayoId', { ensayoId })
        .orderBy('a.aplicacion_id', 'ASC')
        .getOne();

      // 5. Procesar datos de trilla
      const datosTrilla: any[] = datosCosechaRaw.map(c => ({
        tratamiento: c.parcela?.tratamiento?.id || 1,
        bloque: c.parcela?.bloque?.nombreBloque || 'B',
        parcela: c.parcela?.nombreParcela || `P${c.parcela?.id}`,
        humedad: this.parseNumerico(c.humedadPct),
        kgHa: this.parseNumerico(c.kgHaCorregido),
        gje: this.parseNumerico(c.gie),
        // Nuevos campos para cálculo de rendimiento
        pesoGranoCosechado: this.parseNumerico(c.pesoGranoCosechado),
        humedadGranoCosechado: this.parseNumerico(c.humedadGranoCosechado),
        superficieCosechadaM2: this.parseNumerico(c.superficieCosechadaM2),
      }));

      // 6. Metadatos - USAR VALORES DIRECTAMENTE DE ENSAYO QUE YA TIENE RELACIONES CARGADAS
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
        // DATOS DE APLICACION
        fechaAplicacion: aplicacion?.fechaHora
          ? new Date(aplicacion.fechaHora).toLocaleDateString('es-ES')
          : 'N/A',
        estadio: aplicacion?.estadioCultivo || 'N/A',
        temperatura: aplicacion?.tempC ? `${aplicacion.tempC}°C` : 'N/A',
        humedad: aplicacion?.humedadPct ? `${aplicacion.humedadPct}%` : 'N/A',
        equipo: aplicacion?.equipoInfo || 'N/A',
        responsable: (ensayo.responsable as any)?.nombre || 'N/A',
        laboratorio: (ensayo.laboratorio as any)?.nombre || 'N/A',
        numeroTratamientos: [...new Set((ensayo.parcelas || []).map(p => p.tratamiento?.id))].length,
        numeroBloques: [...new Set((ensayo.parcelas || []).map(p => p.bloque?.id))].length,
      };

      return { ensayo, datosCampo, datosTrilla, metadadatos };
    } catch (error) {
      console.error(`❌ Error obtenerDatosEnsayo:`, error);
      throw error;
    }
  }

  /**
   * NUEVO MÉTODO: Obtiene datos del ensayo usando SQL nativo con nombres EXACTOS
   */
  async obtenerDatosEnsayoRaw(ensayoId: number): Promise<any> {
    console.log(`🔍 INICIANDO obtenerDatosEnsayoRaw para ensayo ${ensayoId}`);
    try {
      const manager = this.ensayoRepository.manager;
  
      // 1. ENSAYO COMPLETO - Columnas explícitas para evitar conflictos
      const ensayoRaw = await manager.query(`
        SELECT 
          e.ensayo_id,
          e.nombre_ensayo,
          e.provincia,
          e.departamento,
          e.establecimiento,
          e.lote,
          e.fecha_siembra,
          e.fecha_cosecha,
          e.cultivo_id,
          e.variedad_id,
          e.tipo_siembra_id,
          e.protocolo_id_fk,
          c.nombre as cultivo_nombre, 
          v.nombre as variedad_nombre, 
          ts.nombre as tipo_siembra_nombre,
          p.descripcion as protocolo_descripcion
        FROM Ensayo e
        LEFT JOIN Cultivo c ON e.cultivo_id = c.cultivo_id
        LEFT JOIN Cultivo_Variedad v ON e.variedad_id = v.variedad_id
        LEFT JOIN TipoSiembra ts ON e.tipo_siembra_id = ts.id
        LEFT JOIN Protocolo p ON e.protocolo_id_fk = p.protocolo_id
        WHERE e.ensayo_id = ?
      `, [ensayoId]);
  
      if (!ensayoRaw.length) return null;
      const ensayo = ensayoRaw[0];
  
      // 2. APLICACION COMPLETA
      const aplicacionRaw = await manager.query(`
        SELECT * FROM Aplicacion WHERE ensayo_id_fk = ? LIMIT 1
      `, [ensayoId]);
      const aplicacion = aplicacionRaw.length ? aplicacionRaw[0] : {};

      console.log('===== DATOS QUERY APLICACION =====');
      console.log(JSON.stringify(aplicacion, null, 2));
      console.log('==================================');

      // 3. DATOS COSECHA TODOS LOS CAMPOS
      const datosTrilla = await manager.query(`
        SELECT 
          p.nombre_parcela, t.numero_trat, b.nombre_bloque,
          dc.humedad_pct, dc.kg_ha_corregido, dc.peso_grano_cosechado,
          dc.humedad_grano_cosechado, dc.superficie_cosechada_m2, dc.gie, dc.gramaje_por_grano,
          dc.granos_porurf, dc.peso_granos_porurf, dc.granos_danados,
          dc.granos_verdes, dc.granos_vanos, dc.hojas_porurf,
          dc.larvas_porurf, dc.insectos_beneficios_porurf,
          dc.diametro_espiga, dc.altura_parcela, dc.densidad_plantas_final
        FROM Datos_Cosecha dc
        INNER JOIN Parcela p ON dc.parcela_id_fk = p.parcela_id
        INNER JOIN Tratamiento t ON p.tratamiento_id_fk = t.tratamiento_id
        INNER JOIN Bloque b ON p.bloque_id_fk = b.bloque_id
        WHERE p.ensayo_id_fk = ?
      `, [ensayoId]);
  
      // 4. DATOS CAMPO CON VARIABLES - COMPLETO CON MOMENTO INFO
      const datosCampoRaw = await manager.query(`
        SELECT
          dc.dato_campo_id, p.nombre_parcela, t.numero_trat, b.nombre_bloque,
          me.nombre_momento, me.dias_despues_aplicacion, me.fecha_evaluacion,
          pv.nombre_variable, pv.unidad_medida, dcm.valor
        FROM Datos_Campo dc
        INNER JOIN Parcela p ON dc.parcela_id_fk = p.parcela_id
        INNER JOIN Tratamiento t ON p.tratamiento_id_fk = t.tratamiento_id
        INNER JOIN Bloque b ON p.bloque_id_fk = b.bloque_id
        INNER JOIN Momento_Evaluacion me ON dc.momento_id_fk = me.momento_id
        LEFT JOIN Datos_Campo_Medicion dcm ON dc.dato_campo_id = dcm.dato_campo_id_fk
        LEFT JOIN Protocolo_Variable pv ON dcm.variable_id_fk = pv.variable_id
        WHERE p.ensayo_id_fk = ?
      `, [ensayoId]);
  
      // 5. FOTOS Y ARCHIVOS
      const fotosRaw = await manager.query(`
        SELECT 
          fr.foto_id, fr.file_name, fr.file_path, fr.mime_type, fr.fecha_subida,
          p.nombre_parcela, t.numero_trat, b.nombre_bloque
        FROM Foto_Registro fr
        INNER JOIN Datos_Campo dc ON fr.dato_campo_id_fk = dc.dato_campo_id
        INNER JOIN Parcela p ON dc.parcela_id_fk = p.parcela_id
        INNER JOIN Tratamiento t ON p.tratamiento_id_fk = t.tratamiento_id
        INNER JOIN Bloque b ON p.bloque_id_fk = b.bloque_id
        WHERE p.ensayo_id_fk = ?
      `, [ensayoId]);
  
      // 6. ESTADÍSTICAS
      const estadisticasRaw = await manager.query(`
        SELECT
          t.numero_trat,
          COUNT(*) as n,
          ROUND(AVG(dc.kg_ha_corregido), 2) as promedio,
          ROUND(STDDEV(dc.kg_ha_corregido), 2) as desviacion,
          ROUND(MIN(dc.kg_ha_corregido), 2) as minimo,
          ROUND(MAX(dc.kg_ha_corregido), 2) as maximo,
          ROUND(AVG(dc.gie), 2) as gie,
          ROUND(AVG(dc.larvas_porurf), 2) as larvas_porurf,
          ROUND(AVG(dc.insectos_beneficios_porurf), 2) as insectos_beneficios_porurf
        FROM Datos_Cosecha dc
        INNER JOIN Parcela p ON dc.parcela_id_fk = p.parcela_id
        INNER JOIN Tratamiento t ON p.tratamiento_id_fk = t.tratamiento_id
        WHERE p.ensayo_id_fk = ?
        GROUP BY t.numero_trat
      `, [ensayoId]);
  
      // Convertir estadísticas a map
      const estadisticas: any = {};
      for (const stat of estadisticasRaw as any[]) {
        const s = stat as any;
        estadisticas[`T${s.numero_trat}`] = {
          n: s.n,
          promedio: s.promedio,
          desviacion: s.desviacion,
          minimo: s.minimo,
          maximo: s.maximo,
          gie: s.gie,
          larvas_porurf: s.larvas_porurf || 0,
          insectos_beneficios_porurf: s.insectos_beneficios_porurf || 0,
        };
      }
  
      // PROCESAR DATOS COSECHA - SIN undefined
      const datosTrillaProcessed = datosTrilla.map((dt: any) => ({
        parcela: dt.nombre_parcela,
        tratamiento: dt.numero_trat,
        bloque: dt.nombre_bloque,
        humedad: dt.humedad_pct !== null ? `${dt.humedad_pct}%` : '',
        kgHa: dt.kg_ha_corregido !== null ? `${Math.round(dt.kg_ha_corregido)}` : '',
        pesoGranoCosechado: dt.peso_grano_cosechado !== null ? `${dt.peso_grano_cosechado}` : '',
        humedadGranoCosechado: dt.humedad_grano_cosechado !== null ? `${dt.humedad_grano_cosechado}%` : '',
        superficieCosechadaM2: dt.superficie_cosechada_m2 !== null ? `${dt.superficie_cosechada_m2}` : '',
        gie: dt.gie !== null ? `${parseFloat(dt.gie).toFixed(1)}%` : '',
        gramaje: dt.gramaje_por_grano !== null ? `${dt.gramaje_por_grano}` : '',
        granosUrf: dt.granos_porurf !== null ? `${Math.round(dt.granos_porurf)}` : '',
        pesoGranos: dt.peso_granos_porurf !== null ? `${dt.peso_granos_porurf}` : '',
        dañados: dt.granos_danados !== null ? `${dt.granos_danados}%` : '',
        verdes: dt.granos_verdes !== null ? `${dt.granos_verdes}%` : '',
        vanos: dt.granos_vanos !== null ? `${dt.granos_vanos}%` : '',
        hojas: dt.hojas_porurf !== null ? `${Math.round(dt.hojas_porurf)}` : '',
        larvas: dt.larvas_porurf !== null ? `${dt.larvas_porurf}` : '',
        beneficos: dt.insectos_beneficios_porurf !== null ? `${dt.insectos_beneficios_porurf}` : '',
        diametro: dt.diametro_espiga !== null ? `${dt.diametro_espiga}mm` : '',
        altura: dt.altura_parcela !== null ? `${dt.altura_parcela}cm` : '',
        densidad: dt.densidad_plantas_final !== null ? `${dt.densidad_plantas_final}` : '',
      }));
  
      // PROCESAR DATOS CAMPO - SIN undefined
      const datosCampoProcessed = datosCampoRaw.map((dc: any) => ({
        parcela: dc.nombre_parcela,
        tratamiento: dc.numero_trat,
        bloque: dc.nombre_bloque,
        momento: dc.nombre_momento,
        variable: dc.nombre_variable,
        valor: dc.valor !== null ? `${parseFloat(dc.valor).toFixed(1)}` : '',
      }));
  
      // PROCESAR FOTOS - SIN undefined
      const fotosProcessed = fotosRaw.map((f: any) => ({
        id: f.foto_id,
        nombre: f.file_name,
        ruta: f.file_path,
        tipo: f.mime_type,
        fecha: f.fecha_subida ? new Date(f.fecha_subida).toLocaleDateString('es-ES') : '',
        parcela: f.nombre_parcela,
        tratamiento: f.numero_trat,
        bloque: f.nombre_bloque,
      }));
  
      // METADATOS - Valores sin formateo, el PDF generator agrega los sufijos
      const metadadatos = {
        ensayoId: ensayo.ensayo_id,
        nombreEnsayo: this.limpiarUTF8(ensayo.nombre_ensayo ?? ''),
        cultivo: this.limpiarUTF8(ensayo.cultivo_nombre ?? ''),
        variedad: this.limpiarUTF8(ensayo.variedad_nombre ?? ''),
        tipoSiembra: this.limpiarUTF8(ensayo.tipo_siembra_nombre ?? ''),
        provincia: this.limpiarUTF8(ensayo.provincia ?? ''),
        departamento: this.limpiarUTF8(ensayo.departamento ?? ''),
        establecimiento: this.limpiarUTF8(ensayo.establecimiento ?? ''),
        lote: this.limpiarUTF8(ensayo.lote ?? ''),
        fechaSiembra: ensayo.fecha_siembra ? new Date(ensayo.fecha_siembra).toLocaleDateString('es-ES') : '',
        fechaCosecha: ensayo.fecha_cosecha ? new Date(ensayo.fecha_cosecha).toLocaleDateString('es-ES') : '',
        // APLICACION - SIN SUFIJOS, el PDF generator los agregará
        fechaAplicacion: aplicacion.fecha_hora ? new Date(aplicacion.fecha_hora).toLocaleDateString('es-ES') : '',
        estadio: this.limpiarUTF8(aplicacion.estadio_cultivo ?? ''),
        temperatura: aplicacion.temp_c ?? '',
        humedad: aplicacion.humedad_pct ?? '',
        equipo: this.limpiarUTF8(aplicacion.equipo_info ?? ''),
        viento: aplicacion.viento_kmh ?? '',
        velocidadViento: aplicacion.viento_kmh ?? '',
        pico: this.limpiarUTF8(aplicacion.pico_info ?? ''),
        presion: aplicacion.presion_bar ?? '',
        numeroTratamientos: estadisticasRaw.length,
        numeroBloques: [...new Set(datosTrilla.map((dt: any) => dt.nombre_bloque))].length,
      };

      // 7. CONSTRUIR EVALUACIONES DESDE DATOS YA CARGADOS EN datosCampoRaw
      // Agrupar por momento y recolectar variables
      const momentosPorNombre = new Map<string, { dds: number; fecha: any; variables: Set<string> }>();
  
      for (const dc of datosCampoRaw as any[]) {
        if (!(dc as any).nombre_momento) continue;
  
        if (!momentosPorNombre.has((dc as any).nombre_momento)) {
          momentosPorNombre.set((dc as any).nombre_momento, {
            dds: (dc as any).dias_despues_aplicacion || 0,
            fecha: (dc as any).fecha_evaluacion,
            variables: new Set<string>(),
          });
        }
  
        if ((dc as any).nombre_variable) {
          momentosPorNombre.get((dc as any).nombre_momento)!.variables.add((dc as any).nombre_variable);
        }
      }
  
      // Construir evaluacionesFechas - LLENO DE DATOS
      const evaluacionesFechas = Array.from(momentosPorNombre.entries())
        .sort((a, b) => (a[1].dds || 0) - (b[1].dds || 0))
        .map(([nombre, data]) => [
          String(data.dds || ''),
          data.fecha ? new Date(data.fecha).toLocaleDateString('es-ES') : '',
          Array.from(data.variables).join(', ') || 'Sin variables',
        ]);
  
      // 8. CONSTRUIR EVALUACIONES DETALLE DESDE datosCampoRaw
      // Obtener tratamientos únicos de parcelas del ensayo
      const parcelasTratamientos = await this.parcelaRepository
        .createQueryBuilder('p')
        .leftJoinAndSelect('p.tratamiento', 't')
        .leftJoinAndSelect('p.bloque', 'b')
        .where('p.ensayo_id_fk = :ensayoId', { ensayoId })
        .getMany();
  
      // Extraer únicos
      const tratamientosUnicos = new Map<string, any>();
      for (const p of parcelasTratamientos) {
        const key = `T${p.tratamiento?.numeroTrat}_B${p.bloque?.nombreBloque}`;
        if (!tratamientosUnicos.has(key)) {
          tratamientosUnicos.set(key, {
            tratamiento: String(p.tratamiento?.numeroTrat || ''),
            bloque: p.bloque?.nombreBloque || '',
          });
        }
      }
  
      // Ordenar momentos por DDS
      const momentosOrdenados = Array.from(momentosPorNombre.entries())
        .sort((a, b) => (a[1].dds || 0) - (b[1].dds || 0));
  
      // Construir header dinámico basado en momentos - MÁS DESCRIPTIVO
      const headerEvaluaciones = ['Trat', 'Bloque'];
      for (const [nombre, momento] of momentosOrdenados) {
        const dds = momento.dds;
        const fecha = momento.fecha ? new Date(momento.fecha).toLocaleDateString('es-ES', { year: '2-digit', month: '2-digit', day: '2-digit' }) : 'N/A';
        headerEvaluaciones.push(`Valor (${dds} DDS)`);
        headerEvaluaciones.push(`Fecha ${fecha}`);
        headerEvaluaciones.push(`Variable`);
      }
      headerEvaluaciones.push('Nº Var');
  
      // Construir filas de evaluaciones detalle - LLENAR CON DATOS REALES DE datosCampoRaw
      const evaluacionesDetalle: any[] = [];
  
      for (const [tratKey, tratData] of tratamientosUnicos.entries()) {
        const filaMediciones: any[] = [
          tratData.tratamiento,
          tratData.bloque,
        ];
  
        let contadorVariables = 0;
  
        // Para cada momento, buscar los valores en datosCampoRaw
        for (const [nombreMomento, momentoData] of momentosOrdenados) {
          let valorMomento = '';
          let fechaMomento = '';
          let variableMomento = '';
  
          // Buscar en datosCampoRaw - TODOS LOS REGISTROS PARA ESTA COMBINACION
          for (const dcRaw of datosCampoRaw as any[]) {
            const dc = dcRaw as any;
            // Coincidir tratamiento, bloque y momento
            if (String(dc.numero_trat) !== tratData.tratamiento) continue;
            if (dc.nombre_bloque !== tratData.bloque) continue;
            if (dc.nombre_momento !== nombreMomento) continue;
  
            // Encontrado - llenar datos
            valorMomento = dc.valor ? String(dc.valor) : '';
            variableMomento = dc.nombre_variable || '';
            fechaMomento = dc.fecha_evaluacion
              ? new Date(dc.fecha_evaluacion).toLocaleDateString('es-ES')
              : '';
            contadorVariables++;
            break;
          }
  
          filaMediciones.push(valorMomento);
          filaMediciones.push(fechaMomento);
          filaMediciones.push(variableMomento);
        }
  
        filaMediciones.push(String(contadorVariables));
        evaluacionesDetalle.push(filaMediciones);
      }
  
      // =====================================================================
      // FORMATO EXCEL (Opción B): una fila por (Trat, Bloque, Variable)
      // Las columnas son los momentos ordenados por DDS.
      // No modifica headerEvaluaciones ni evaluacionesDetalle usados por el PDF.
      // =====================================================================

      // Lookup de valores: "trat|bloque|momento|variable" → número o string
      const valorLookup = new Map<string, number | string>();
      for (const dc of datosCampoRaw as any[]) {
        if (!dc.nombre_variable) continue;
        const k = `${String(dc.numero_trat)}|${dc.nombre_bloque}|${dc.nombre_momento}|${dc.nombre_variable}`;
        if (!valorLookup.has(k) && dc.valor !== null && dc.valor !== undefined) {
          const num = parseFloat(String(dc.valor));
          valorLookup.set(k, isNaN(num) ? String(dc.valor) : num);
        }
      }

      // Variables únicas con su unidad, en orden de aparición (recorriendo momentos por DDS)
      const variablesConUnidad = new Map<string, string>(); // nombre → unidad_medida
      for (const [, momentoData] of momentosOrdenados) {
        for (const v of momentoData.variables) {
          if (!variablesConUnidad.has(v)) {
            const dcConUnidad = (datosCampoRaw as any[]).find((dc: any) => dc.nombre_variable === v);
            variablesConUnidad.set(v, dcConUnidad?.unidad_medida || '');
          }
        }
      }

      // Header Excel: Trat | Bloque | Variable | Unidad | {N DDS (DD/MM)} ...
      const headerEvaluacionesExcel: string[] = ['Trat', 'Bloque', 'Variable', 'Unidad'];
      for (const [, momento] of momentosOrdenados) {
        const dds = momento.dds;
        const fecha = momento.fecha
          ? new Date(momento.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })
          : '';
        headerEvaluacionesExcel.push(fecha ? `${dds} DDS (${fecha})` : `${dds} DDS`);
      }

      // Filas Excel: una por (Trat, Bloque, Variable)
      const evaluacionesDetalleExcel: any[] = [];
      for (const [, tratData] of tratamientosUnicos.entries()) {
        for (const [variable, unidad] of variablesConUnidad.entries()) {
          const fila: any[] = [tratData.tratamiento, tratData.bloque, variable, unidad];
          for (const [nombreMomento] of momentosOrdenados) {
            const k = `${tratData.tratamiento}|${tratData.bloque}|${nombreMomento}|${variable}`;
            fila.push(valorLookup.get(k) ?? '');
          }
          evaluacionesDetalleExcel.push(fila);
        }
      }

      // Obtener protocolo y diseño desde BD
      const protocolo = {
        descripcion: ensayo.protocolo_descripcion || 'Sin protocolo definido',
      };
  
      const diseno = {
        nombre: ensayo.nombre_ensayo || 'No especificado',
        repeticiones: [...new Set(datosTrilla.map((dt: any) => dt.nombre_bloque))].length,
        tratamientos: [...new Set(datosTrilla.map((dt: any) => dt.numero_trat))].length,
      };
  
      return {
        datosCampo: datosCampoProcessed,
        datosTrilla: datosTrillaProcessed,
        metadadatos,
        fotos: fotosProcessed,
        estadisticas,
        evaluacionesFechas,
        evaluacionesDetalle,        // usado por el PDF (formato original)
        headerEvaluaciones,         // usado por el PDF (formato original)
        evaluacionesDetalleExcel,   // exclusivo Excel: una fila por (Trat, Bloque, Variable)
        headerEvaluacionesExcel,    // exclusivo Excel: columnas = momentos por DDS
        protocolo,
        diseno,
      };
    } catch (error) {
      console.error(`❌ Error obtenerDatosEnsayoRaw:`, error);
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
   * Genera PDF del reporte - AHORA USA obtenerDatosEnsayoRaw
   */
  async generarPDFEnsayo(ensayoId: number) {
    try {
      // USAR obtenerDatosEnsayoRaw que trae TODOS los campos incluyendo larvas_porurf
      const datosRaw = await this.obtenerDatosEnsayoRaw(ensayoId);
  
      if (!datosRaw) {
        throw new Error(`Ensayo ${ensayoId} no encontrado`);
      }
  
      const resumen = this.generarResumenEjecutivo(
        datosRaw.datosCampo || [],
        datosRaw.datosTrilla || [],
        datosRaw.metadadatos,
      );
  
      const pdfData = {
        metadatos: datosRaw.metadadatos,
        datosCampo: datosRaw.datosCampo || [],
        datosTrilla: datosRaw.datosTrilla || [],
        estadisticas: datosRaw.estadisticas,
        resumen,
        fotos: datosRaw.fotos || [],
        evaluacionesFechas: datosRaw.evaluacionesFechas || [],
        evaluacionesDetalle: datosRaw.evaluacionesDetalle || [],
        headerEvaluaciones: datosRaw.headerEvaluaciones || [],
        protocolo: datosRaw.protocolo, // <-- Pasar protocolo
        diseno: datosRaw.diseno,       // <-- Pasar diseno
      };
  
      console.log('===== DATOS QUE SE PASAN AL PDF =====');
      console.log('metadatos:', JSON.stringify(pdfData.metadatos, null, 2));
      console.log('======================================');

      const buffer = await PdfReportGenerator.generarReporteEnsayo(pdfData);
  
      return buffer;
    } catch (error) {
      console.error('❌ Error generando PDF:', error);
      throw error;
    }
  }

  /**
   * Genera Excel del reporte - AHORA COMPLETO COMO EL PDF
   */
  async generarExcelEnsayo(ensayoId: number) {
    try {
      // USAR obtenerDatosEnsayoRaw que trae TODOS los datos
      const datosRaw = await this.obtenerDatosEnsayoRaw(ensayoId);

      if (!datosRaw) {
        throw new Error(`Ensayo ${ensayoId} no encontrado`);
      }

      // Construir objeto de datos completo para Excel
      const excelData = {
        metadatos: datosRaw.metadadatos,
        datosCampo: datosRaw.datosCampo || [],
        datosTrilla: datosRaw.datosTrilla || [],
        estadisticas: datosRaw.estadisticas,
        fotos: datosRaw.fotos || [],
        evaluacionesFechas: datosRaw.evaluacionesFechas || [],
        evaluacionesDetalle: datosRaw.evaluacionesDetalle || [],
        headerEvaluaciones: datosRaw.headerEvaluaciones || [],
        protocolo: datosRaw.protocolo,
        diseno: datosRaw.diseno,
      };

      const buffer = await ExcelReportGenerator.generarReporteEnsayo(excelData);

      return buffer;
    } catch (error) {
      console.error('❌ Error generando Excel:', error);
      throw error;
    }
  }

  /**
   * Genera Excel del reporte - MÉTODO LEGADO (mantener compatibilidad)
   */
  async generarExcel(datosCampo: any[], datosTrilla: any[], metadadatos: any) {
    try {
      const estadisticas = this.calcularEstadisticasPorTratamiento(
        datosTrilla || [],
        'kgHa',
      );

      const excelData = {
        metadatos: metadadatos,
        datosCampo: datosCampo || [],
        datosTrilla: datosTrilla || [],
        estadisticas,
      };

      const buffer = await ExcelReportGenerator.generarReporteEnsayo(
        excelData,
      );

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

  /**
   * NUEVO: Genera reporte completo con todos los servicios integrados
   * Incluye validación, cálculos, 6 reportes especializados y gráficos
   */
  async generarReporteCompleto(ensayoId: number) {
    try {
      // 1. Obtener datos
      const { ensayo, datosCampo, datosTrilla, metadadatos } =
        await this.obtenerDatosEnsayo(ensayoId);

      if (!ensayo) {
        throw new Error(`Ensayo ${ensayoId} no encontrado`);
      }

      // 2. Validar coherencia de datos
      const validacionGlobal = {
        advertencias: [] as string[],
        errores: [] as string[],
      };

      for (const dato of datosTrilla) {
        const validacion = this.calculosService.validarCoherenciaDatos(dato);
        validacionGlobal.advertencias.push(...validacion.advertencias);
        validacionGlobal.errores.push(...validacion.errores);
      }

      // 3. Generar 6 reportes especializados
      const reportes = {
        rendimiento: this.reportesEspecializadosService.generarReporteRendimiento({
          datosTrilla,
          datosCampo,
        }),
        sanidad: this.reportesEspecializadosService.generarReporteSanidad({
          datosTrilla,
        }),
        desarrollo: this.reportesEspecializadosService.generarReporteDesarrollo({
          datosTrilla,
        }),
        composicion: this.reportesEspecializadosService.generarReporteComposicion({
          datosTrilla,
        }),
        eficiencia: this.reportesEspecializadosService.generarReporteEficiencia({
          datosTrilla,
        }),
        resumen: this.reportesEspecializadosService.generarResumenEjecutivo({
          datosTrilla,
          metadadatos,
        }),
      };

      // 4. Generar gráficos SVG (básico)
      const graficos = {
        rendimiento: SvgChartsService.generarGraficoBarras(
          (reportes.rendimiento as any).graficos?.barras || [],
          { titulo: 'Rendimiento por Tratamiento', ancho: 800, alto: 500 }
        ),
      };

      // 5. Retornar estructura completa
      return {
        ensayo,
        metadadatos,
        datosCampo,
        datosTrilla,
        reportes,
        graficos,
        validacion: validacionGlobal,
      };
    } catch (error) {
      console.error('❌ Error generando reporte completo:', error);
      throw error;
    }
  }

  /**
   * Limpia caracteres especiales UTF-8 problemáticos
   */
  private limpiarUTF8(texto: string): string {
    if (!texto) return '';
    return texto
      .replace(/Ã¡/g, 'á')
      .replace(/Ã©/g, 'é')
      .replace(/Ã­/g, 'í')
      .replace(/Ã³/g, 'ó')
      .replace(/Ãº/g, 'ú')
      .replace(/Ã±/g, 'ñ')
      .replace(/Â/g, '')
      .replace(/Ã/g, '')
      .trim();
  }
}
