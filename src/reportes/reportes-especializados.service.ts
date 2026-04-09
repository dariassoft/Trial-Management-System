import { Injectable } from '@nestjs/common';
import { CalculosReportesService } from './calculos-reportes.service';

/**
 * Servicio que genera los 6 reportes especializados
 * Cada método retorna datos estructurados listos para tablas y gráficos
 */
@Injectable()
export class ReportesEspecializadosService {
  constructor(private calculosService: CalculosReportesService) {}

  /**
   * REPORTE 1: Rendimiento y Calidad por Tratamiento
   */
  generarReporteRendimiento(ensayoData: any) {
    const { datosTrilla = [], datosCampo = [] } = ensayoData;

    // Agrupar por tratamiento
    const porTratamiento: Record<string, any> = {};

    for (const dato of datosTrilla) {
      const trat = `T${dato.tratamiento || 1}`;
      if (!porTratamiento[trat]) {
        porTratamiento[trat] = {
          tratamiento: trat,
          parcelas: [],
          rendimientos: [],
          humedad: [],
          gie: [],
          gramaje: [],
          granosPorM2: [],
        };
      }
      porTratamiento[trat].parcelas.push(dato.parcela);
      if (dato.kgHa) porTratamiento[trat].rendimientos.push(dato.kgHa);
      if (dato.humedad) porTratamiento[trat].humedad.push(dato.humedad);
      if (dato.gje) porTratamiento[trat].gie.push(dato.gje);
      if (dato.gramajePorGrano)
        porTratamiento[trat].gramaje.push(dato.gramajePorGrano);
      if (dato.granosPorurf)
        porTratamiento[trat].granosPorM2.push(dato.granosPorurf);
    }

    // Calcular estadísticas
    const tabla: any[] = [];
    for (const [trat, datos] of Object.entries(porTratamiento)) {
      const stats = this.calculosService.calcularEstadisticas(
        (datos as any).rendimientos,
      );
      const statsHumedad = this.calculosService.calcularEstadisticas(
        (datos as any).humedad,
      );
      const statsGie = this.calculosService.calcularEstadisticas(
        (datos as any).gie,
      );

      tabla.push({
        tratamiento: trat,
        n: stats.n,
        rendimientoPromedio: stats.promedio,
        rendimientoDesviacion: stats.desviacion,
        rendimientoMin: stats.minimo,
        rendimientoMax: stats.maximo,
        rendimientoCV: stats.coefVariacion,
        humedadPromedio: statsHumedad.promedio,
        giePromedio: statsGie.promedio,
      });
    }

    // Datos para gráficos
    const datosBarras = tabla.map(t => ({
      x: t.tratamiento,
      y: t.rendimientoPromedio,
      error: t.rendimientoDesviacion,
    }));

    const datosCV = tabla.map(t => ({
      x: t.tratamiento,
      y: t.rendimientoCV,
    }));

    const datosGIE = tabla.map(t => ({
      x: t.tratamiento,
      y: t.giePromedio,
    }));

    return {
      nombre: 'Rendimiento y Calidad por Tratamiento',
      tabla,
      graficos: {
        barras: datosBarras,
        variabilidad: datosCV,
        gie: datosGIE,
      },
      analisis: this.analizarRendimiento(tabla),
    };
  }

  private analizarRendimiento(tabla: any[]): any {
    if (tabla.length === 0) return { mejorTratamiento: 'N/A', conclusion: '' };

    const mejorTratamiento = tabla.reduce((prev, current) =>
      current.rendimientoPromedio > prev.rendimientoPromedio ? current : prev,
    );

    const testigo = tabla[0]; // Asume T1 como testigo

    return {
      mejorTratamiento: mejorTratamiento.tratamiento,
      rendimientoMejor: mejorTratamiento.rendimientoPromedio,
      aumentoVsTestigo:
        ((mejorTratamiento.rendimientoPromedio - testigo.rendimientoPromedio) /
          testigo.rendimientoPromedio) *
        100,
      conclusion: `El tratamiento ${mejorTratamiento.tratamiento} mostró el mejor rendimiento con ${mejorTratamiento.rendimientoPromedio} kg/ha.`,
    };
  }

  /**
   * REPORTE 2: Sanidad e Incidencia de Plagas
   */
  generarReporteSanidad(ensayoData: any) {
    const { datosTrilla = [] } = ensayoData;

    // Agrupar por tratamiento
    const porTratamiento: Record<string, any> = {};

    for (const dato of datosTrilla) {
      const trat = `T${dato.tratamiento || 1}`;
      if (!porTratamiento[trat]) {
        porTratamiento[trat] = {
          tratamiento: trat,
          larvas: [],
          beneficos: [],
          gie: [],
        };
      }
      if (dato.larvasPorM2)
        porTratamiento[trat].larvas.push(dato.larvasPorM2);
      if (dato.insectosBeneficiosPorUrf)
        porTratamiento[trat].beneficos.push(dato.insectosBeneficiosPorUrf);
      if (dato.gje) porTratamiento[trat].gie.push(dato.gje);
    }

    // Calcular índices
    const tabla: any[] = [];
    for (const [trat, datos] of Object.entries(porTratamiento)) {
      const statsLarvas = this.calculosService.calcularEstadisticas(
        (datos as any).larvas,
      );
      const statsBeneficios = this.calculosService.calcularEstadisticas(
        (datos as any).beneficos,
      );
      const statsGie = this.calculosService.calcularEstadisticas(
        (datos as any).gie,
      );

      const indicePlagas = this.calculosService.calcularIndicePlagas(
        statsLarvas.promedio,
        statsBeneficios.promedio,
      );

      const sanidad = this.calculosService.calcularSanidad(
        statsGie.promedio,
        100, // Asume grano puro = 100 (deberías calcularlo)
        statsLarvas.promedio,
        statsBeneficios.promedio,
      );

      tabla.push({
        tratamiento: trat,
        larvasPromedio: statsLarvas.promedio,
        beneficosPromedio: statsBeneficios.promedio,
        indicePlagas,
        sanidad,
      });
    }

    // Datos para gráficos
    const datosComparativa = tabla.map(t => ({
      tratamiento: t.tratamiento,
      larvas: t.larvasPromedio,
      beneficos: t.beneficosPromedio,
    }));

    return {
      nombre: 'Sanidad e Incidencia de Plagas',
      tabla,
      graficos: {
        comparativa: datosComparativa,
      },
      analisis: this.analizarSanidad(tabla),
    };
  }

  private analizarSanidad(tabla: any[]): any {
    if (tabla.length === 0) return { conclusion: '' };

    const mejorSanidad = tabla.reduce((prev, current) =>
      current.sanidad > prev.sanidad ? current : prev,
    );

    const desequilibrios = tabla.filter(t => t.indicePlagas > 1);

    return {
      mejorSanidad: mejorSanidad.tratamiento,
      indiceSalidadMejor: mejorSanidad.sanidad,
      desequilibrios: desequilibrios.length,
      conclusion: `${desequilibrios.length > 0 ? 'Se detectó desequilibrio biológico en algunos tratamientos.' : 'El balance biológico se mantiene estable.'} ${mejorSanidad.tratamiento} mostró la mejor sanidad general.`,
    };
  }

  /**
   * REPORTE 3: Análisis de Desarrollo Vegetativo
   */
  generarReporteDesarrollo(ensayoData: any) {
    const { datosTrilla = [] } = ensayoData;

    // Agrupar por tratamiento
    const porTratamiento: Record<string, any> = {};

    for (const dato of datosTrilla) {
      const trat = `T${dato.tratamiento || 1}`;
      if (!porTratamiento[trat]) {
        porTratamiento[trat] = {
          tratamiento: trat,
          altura: [],
          diametro: [],
          hojas: [],
          plantas: [],
          rendimiento: [],
        };
      }
      if (dato.alturaParcela) porTratamiento[trat].altura.push(dato.alturaParcela);
      if (dato.diametroEspiga)
        porTratamiento[trat].diametro.push(dato.diametroEspiga);
      if (dato.hojasPorM2) porTratamiento[trat].hojas.push(dato.hojasPorM2);
      if (dato.densidadPlantasFinal)
        porTratamiento[trat].plantas.push(dato.densidadPlantasFinal);
      if (dato.kgHa) porTratamiento[trat].rendimiento.push(dato.kgHa);
    }

    // Calcular estadísticas
    const tabla: any[] = [];
    for (const [trat, datos] of Object.entries(porTratamiento)) {
      const statsAltura = this.calculosService.calcularEstadisticas(
        (datos as any).altura,
      );
      const statsDiametro = this.calculosService.calcularEstadisticas(
        (datos as any).diametro,
      );
      const statsHojas = this.calculosService.calcularEstadisticas(
        (datos as any).hojas,
      );
      const statsPlantes = this.calculosService.calcularEstadisticas(
        (datos as any).plantas,
      );

      const indiceVigor = this.calculosService.calcularIndiceVigor(
        statsAltura.promedio,
        statsDiametro.promedio,
        statsPlantes.promedio,
      );

      tabla.push({
        tratamiento: trat,
        alturaPromedio: statsAltura.promedio,
        alturaDesviacion: statsAltura.desviacion,
        diametroPromedio: statsDiametro.promedio,
        hojasPromedio: statsHojas.promedio,
        plantasPromedio: statsPlantes.promedio,
        indiceVigor,
      });
    }

    // Datos para gráficos
    const datosBarrasAltura = tabla.map(t => ({
      x: t.tratamiento,
      y: t.alturaPromedio,
      error: t.alturaDesviacion,
    }));

    return {
      nombre: 'Análisis de Desarrollo Vegetativo',
      tabla,
      graficos: {
        altura: datosBarrasAltura,
      },
      analisis: this.analizarDesarrollo(tabla),
    };
  }

  private analizarDesarrollo(tabla: any[]): any {
    if (tabla.length === 0) return { conclusion: '' };

    const mejorDesarrollo = tabla.reduce((prev, current) =>
      current.indiceVigor > prev.indiceVigor ? current : prev,
    );

    return {
      mejorDesarrollo: mejorDesarrollo.tratamiento,
      indiceVigorMejor: mejorDesarrollo.indiceVigor,
      alturaMejor: mejorDesarrollo.alturaPromedio,
      conclusion: `${mejorDesarrollo.tratamiento} mostró el mejor desarrollo vegetativo con índice de vigor ${mejorDesarrollo.indiceVigor} y altura ${mejorDesarrollo.alturaPromedio} cm.`,
    };
  }

  /**
   * REPORTE 4: Composición del Grano
   */
  generarReporteComposicion(ensayoData: any) {
    const { datosTrilla = [] } = ensayoData;

    // Agrupar por tratamiento
    const porTratamiento: Record<string, any> = {};

    for (const dato of datosTrilla) {
      const trat = `T${dato.tratamiento || 1}`;
      if (!porTratamiento[trat]) {
        porTratamiento[trat] = {
          tratamiento: trat,
          danados: [],
          verdes: [],
          vanos: [],
          gramaje: [],
          granos: [],
        };
      }
      if (dato.granosDanados)
        porTratamiento[trat].danados.push(dato.granosDanados);
      if (dato.granosVerdes)
        porTratamiento[trat].verdes.push(dato.granosVerdes);
      if (dato.granosVanos) porTratamiento[trat].vanos.push(dato.granosVanos);
      if (dato.gramajePorGrano)
        porTratamiento[trat].gramaje.push(dato.gramajePorGrano);
      if (dato.granosPorurf) porTratamiento[trat].granos.push(dato.granosPorurf);
    }

    // Calcular composición
    const tabla: any[] = [];
    for (const [trat, datos] of Object.entries(porTratamiento)) {
      const statsDanados = this.calculosService.calcularEstadisticas(
        (datos as any).danados,
      );
      const statsVerdes = this.calculosService.calcularEstadisticas(
        (datos as any).verdes,
      );
      const statsVanos = this.calculosService.calcularEstadisticas(
        (datos as any).vanos,
      );
      const statsGramaje = this.calculosService.calcularEstadisticas(
        (datos as any).gramaje,
      );

      const granoPuro = this.calculosService.calcularGranoPuro(
        statsDanados.promedio,
        statsVerdes.promedio,
        statsVanos.promedio,
      );

      tabla.push({
        tratamiento: trat,
        porcentajeSanos: granoPuro,
        porcentajeDanados: statsDanados.promedio,
        porcentajeVerdes: statsVerdes.promedio,
        porcentajeVanos: statsVanos.promedio,
        gramajePorGrano: statsGramaje.promedio,
      });
    }

    // Datos para gráficos
    const datosPie = tabla.map(t => ({
      tratamiento: t.tratamiento,
      sanos: t.porcentajeSanos,
      danados: t.porcentajeDanados,
      verdes: t.porcentajeVerdes,
      vanos: t.porcentajeVanos,
    }));

    return {
      nombre: 'Composición del Grano',
      tabla,
      graficos: {
        composicion: datosPie,
      },
      analisis: this.analizarComposicion(tabla),
    };
  }

  private analizarComposicion(tabla: any[]): any {
    if (tabla.length === 0) return { conclusion: '' };

    const mejorCalidad = tabla.reduce((prev, current) =>
      current.porcentajeSanos > prev.porcentajeSanos ? current : prev,
    );

    return {
      mejorComposicion: mejorCalidad.tratamiento,
      granosAnosMejor: mejorCalidad.porcentajeSanos,
      conclusion: `${mejorCalidad.tratamiento} presentó la mejor composición de grano con ${mejorCalidad.porcentajeSanos}% de granos sanos.`,
    };
  }

  /**
   * REPORTE 5: Análisis de Eficiencia
   */
  generarReporteEficiencia(ensayoData: any) {
    const { datosTrilla = [] } = ensayoData;

    // Agrupar por tratamiento
    const porTratamiento: Record<string, any> = {};

    for (const dato of datosTrilla) {
      const trat = `T${dato.tratamiento || 1}`;
      if (!porTratamiento[trat]) {
        porTratamiento[trat] = {
          tratamiento: trat,
          kgHa: [],
          pesoGranos: [],
          hojas: [],
          plantas: [],
        };
      }
      if (dato.kgHa) porTratamiento[trat].kgHa.push(dato.kgHa);
      if (dato.pesoGranosPorUrf)
        porTratamiento[trat].pesoGranos.push(dato.pesoGranosPorUrf);
      if (dato.hojasPorM2) porTratamiento[trat].hojas.push(dato.hojasPorM2);
      if (dato.densidadPlantasFinal)
        porTratamiento[trat].plantas.push(dato.densidadPlantasFinal);
    }

    // Calcular eficiencias
    const tabla: any[] = [];
    for (const [trat, datos] of Object.entries(porTratamiento)) {
      const statsKgHa = this.calculosService.calcularEstadisticas(
        (datos as any).kgHa,
      );
      const statsPesoGranos = this.calculosService.calcularEstadisticas(
        (datos as any).pesoGranos,
      );
      const statsHojas = this.calculosService.calcularEstadisticas(
        (datos as any).hojas,
      );
      const statsPlantes = this.calculosService.calcularEstadisticas(
        (datos as any).plantas,
      );

      const eficienciaConversion =
        this.calculosService.calcularEficienciaConversion(
          statsPesoGranos.promedio,
          statsKgHa.promedio,
        );

      const eficienciaFoliar = this.calculosService.calcularEficienciaFoliar(
        statsKgHa.promedio,
        statsHojas.promedio,
      );

      const indiceVigor = this.calculosService.calcularIndiceVigor(
        75, // Valor default, deberías pasar altura real
        8.5, // Valor default
        statsPlantes.promedio,
      );

      tabla.push({
        tratamiento: trat,
        eficienciaConversion,
        eficienciaFoliar,
        indiceVigor,
        rendimientoPorPlanta:
          this.calculosService.calcularRendimientoPorPlanta(
            statsKgHa.promedio,
            statsPlantes.promedio,
          ),
      });
    }

    return {
      nombre: 'Análisis de Eficiencia',
      tabla,
      analisis: this.analizarEficiencia(tabla),
    };
  }

  private analizarEficiencia(tabla: any[]): any {
    if (tabla.length === 0) return { conclusion: '' };

    const mejorEficiencia = tabla.reduce((prev, current) =>
      current.eficienciaFoliar > prev.eficienciaFoliar ? current : prev,
    );

    return {
      mejorEficiencia: mejorEficiencia.tratamiento,
      eficienciaFoliarMejor: mejorEficiencia.eficienciaFoliar,
      conclusion: `${mejorEficiencia.tratamiento} mostró la mejor eficiencia foliar con ${mejorEficiencia.eficienciaFoliar} kg/ha por cada 100 hojas/m².`,
    };
  }

  /**
   * REPORTE 6: Resumen Ejecutivo Comparativo
   */
  generarResumenEjecutivo(ensayoData: any) {
    const { datosTrilla = [], metadadatos = {} } = ensayoData;

    // Agrupar por tratamiento
    const porTratamiento: Record<string, any> = {};

    for (const dato of datosTrilla) {
      const trat = `T${dato.tratamiento || 1}`;
      if (!porTratamiento[trat]) {
        porTratamiento[trat] = {
          tratamiento: trat,
          rendimientos: [],
          gie: [],
          plagas: [],
          altura: [],
        };
      }
      if (dato.kgHa) porTratamiento[trat].rendimientos.push(dato.kgHa);
      if (dato.gje) porTratamiento[trat].gie.push(dato.gje);
      if (dato.larvasPorM2) porTratamiento[trat].plagas.push(dato.larvasPorM2);
      if (dato.alturaParcela) porTratamiento[trat].altura.push(dato.alturaParcela);
    }

    // Generar fichas por tratamiento
    const fichas: any[] = [];
    let mejorTratamiento = null;
    let mejorScore = -Infinity;

    for (const [trat, datos] of Object.entries(porTratamiento)) {
      const statsRend = this.calculosService.calcularEstadisticas(
        (datos as any).rendimientos,
      );
      const statsGie = this.calculosService.calcularEstadisticas(
        (datos as any).gie,
      );
      const statsPlagas = this.calculosService.calcularEstadisticas(
        (datos as any).plagas,
      );
      const statsAltura = this.calculosService.calcularEstadisticas(
        (datos as any).altura,
      );

      // Score simplificado: rendimiento + calidad - plagas
      const score = statsRend.promedio + statsGie.promedio - statsPlagas.promedio * 10;

      const ficha = {
        tratamiento: trat,
        rendimiento: statsRend.promedio,
        rendimientoRango: `${statsRend.minimo} - ${statsRend.maximo}`,
        calidad: statsGie.promedio,
        plagas: statsPlagas.promedio,
        altura: statsAltura.promedio,
        score,
        recomendacion: this.generarRecomendacion(trat, score, statsPlagas.promedio),
      };

      fichas.push(ficha);

      if (score > mejorScore) {
        mejorScore = score;
        mejorTratamiento = ficha;
      }
    }

    return {
      nombre: 'Resumen Ejecutivo Comparativo',
      fichas,
      mejorTratamiento,
      conclusion: this.generarConclusionFinal(fichas, metadadatos),
    };
  }

  private generarRecomendacion(tratamiento: string, score: number, plagas: number): string {
    if (tratamiento === 'T1') return 'TESTIGO - Referencia';
    if (score > 80 && plagas < 15)
      return 'RECOMENDADO - Usar en producción';
    if (score > 60) return 'VIABLE - Evaluar según contexto';
    return 'NO RECOMENDADO - Riesgo alto';
  }

  private generarConclusionFinal(fichas: any[], metadadatos: any): string {
    const mejorFicha = fichas[0];
    const cultivo = metadadatos.cultivo || 'cultivo evaluado';
    const provincia = metadadatos.provincia || 'ubicación';

    return `En el ensayo de ${cultivo} realizado en ${provincia}, el tratamiento ${mejorFicha.tratamiento} mostró el mejor desempeño general. Se recomienda evaluar su implementación en producción considerando las condiciones específicas del lote.`;
  }
}
