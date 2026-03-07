/**
 * Test E2E para reportes
 * Valida que los reportes se generan correctamente con todos los datos
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ReportesController } from '../../reportes/reportes.controller';
import { ReportesService } from '../../reportes/reportes.service';
import { CalculosReportesService } from '../../reportes/calculos-reportes.service';
import { ReportesEspecializadosService } from '../../reportes/reportes-especializados.service';

describe('Reportes E2E (e2e)', () => {
  let app: INestApplication;
  let reportesService: ReportesService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ReportesController],
      providers: [
        ReportesService,
        CalculosReportesService,
        ReportesEspecializadosService,
        // Mock repositories
        {
          provide: 'EnsayoRepository',
          useValue: {},
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    reportesService = moduleFixture.get<ReportesService>(ReportesService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Cálculos Matemáticos', () => {
    it('debe calcular grano puro correctamente', () => {
      const calculosService = new CalculosReportesService();
      const granoPuro = calculosService.calcularGranoPuro(4.2, 2.1, 1.8);
      expect(granoPuro).toBe(91.9);
    });

    it('debe calcular calidad final correctamente', () => {
      const calculosService = new CalculosReportesService();
      const calidad = calculosService.calcularCalidadFinal(97.3, 91.9);
      expect(calidad).toBeCloseTo(89.36, 1);
    });

    it('debe calcular índice de plagas correctamente', () => {
      const calculosService = new CalculosReportesService();
      const indice = calculosService.calcularIndicePlagas(12, 28);
      expect(indice).toBeCloseTo(0.41, 1);
    });

    it('debe calcular sanidad correctamente', () => {
      const calculosService = new CalculosReportesService();
      const sanidad = calculosService.calcularSanidad(97.3, 91.9, 12, 28);
      expect(sanidad).toBeGreaterThan(0);
      expect(sanidad).toBeLessThanOrEqual(100);
    });

    it('debe calcular vigor correctamente', () => {
      const calculosService = new CalculosReportesService();
      const vigor = calculosService.calcularIndiceVigor(75.2, 8.5, 8.1);
      expect(vigor).toBeGreaterThan(0);
      expect(vigor).toBeLessThanOrEqual(100);
    });

    it('debe calcular eficiencia de conversión correctamente', () => {
      const calculosService = new CalculosReportesService();
      const eficiencia = calculosService.calcularEficienciaConversion(2182.5, 5450.2);
      expect(eficiencia).toBeCloseTo(4.0, 0);
    });

    it('debe calcular eficiencia foliar correctamente', () => {
      const calculosService = new CalculosReportesService();
      const eficiencia = calculosService.calcularEficienciaFoliar(5450.2, 4850);
      expect(eficiencia).toBeGreaterThan(0);
    });

    it('debe calcular estadísticas correctamente', () => {
      const calculosService = new CalculosReportesService();
      const valores = [5200, 5450.2, 5800];
      const stats = calculosService.calcularEstadisticas(valores);

      expect(stats.n).toBe(3);
      expect(stats.promedio).toBeGreaterThan(5200);
      expect(stats.promedio).toBeLessThan(5800);
      expect(stats.desviacion).toBeGreaterThan(0);
      expect(stats.minimo).toBe(5200);
      expect(stats.maximo).toBe(5800);
    });

    it('debe validar coherencia de datos correctamente', () => {
      const calculosService = new CalculosReportesService();
      const datos = {
        gramajePorGrano: 0.0450,
        granosPorurf: 48500,
        pesoGranosPorUrf: 2182.5,
        kgHaCorregido: 5450.2,
        granosDanados: 4.2,
        granosVerdes: 2.1,
        granosVanos: 1.8,
        alturaParcela: 75.2,
        densidadPlantasFinal: 8.1,
      };

      const validacion = calculosService.validarCoherenciaDatos(datos);
      expect(validacion.válido).toBe(true);
      expect(validacion.errores.length).toBe(0);
    });

    it('debe detectar defectos excesivos', () => {
      const calculosService = new CalculosReportesService();
      const datos = {
        granosDanados: 50,
        granosVerdes: 30,
        granosVanos: 25, // Total: 105% - ERROR
      };

      const validacion = calculosService.validarCoherenciaDatos(datos);
      expect(validacion.errores.length).toBeGreaterThan(0);
    });
  });

  describe('Reportes Especializados', () => {
    it('debe generar reporte de rendimiento correctamente', () => {
      const reportesService = new ReportesEspecializadosService(
        new CalculosReportesService()
      );

      const datosTrilla = [
        {
          tratamiento: 1,
          bloque: 'A',
          parcela: 'P1',
          kgHa: 5450,
          humedad: 12.5,
          gje: 97.3,
        },
        {
          tratamiento: 1,
          bloque: 'B',
          parcela: 'P2',
          kgHa: 5500,
          humedad: 12.5,
          gje: 97.3,
        },
      ];

      const reporte = reportesService.generarReporteRendimiento({
        datosTrilla,
        datosCampo: [],
      });

      expect(reporte).toBeDefined();
      expect(reporte.nombre).toBe('Rendimiento y Calidad por Tratamiento');
      expect(reporte.tabla).toBeDefined();
      expect(reporte.tabla.length).toBeGreaterThan(0);
      expect(reporte.analisis).toBeDefined();
    });

    it('debe generar reporte de sanidad correctamente', () => {
      const reportesService = new ReportesEspecializadosService(
        new CalculosReportesService()
      );

      const datosTrilla = [
        {
          tratamiento: 1,
          larvasPorM2: 12,
          insectosBeneficiosPorUrf: 28,
          gje: 97.3,
        },
      ];

      const reporte = reportesService.generarReporteSanidad({
        datosTrilla,
      });

      expect(reporte).toBeDefined();
      expect(reporte.nombre).toBe('Sanidad e Incidencia de Plagas');
      expect(reporte.tabla).toBeDefined();
    });

    it('debe generar resumen ejecutivo correctamente', () => {
      const reportesService = new ReportesEspecializadosService(
        new CalculosReportesService()
      );

      const datosTrilla = [
        {
          tratamiento: 1,
          kgHa: 5450,
          gje: 97.3,
          larvasPorM2: 12,
          alturaParcela: 75.2,
        },
        {
          tratamiento: 2,
          kgHa: 5600,
          gje: 98.0,
          larvasPorM2: 8,
          alturaParcela: 76.5,
        },
      ];

      const reporte = reportesService.generarResumenEjecutivo({
        datosTrilla,
        metadadatos: { cultivo: 'Poroto', provincia: 'Salta' },
      });

      expect(reporte).toBeDefined();
      expect(reporte.fichas).toBeDefined();
      expect(reporte.fichas.length).toBeGreaterThan(0);
      expect(reporte.mejorTratamiento).toBeDefined();
    });
  });

  describe('Validaciones', () => {
    it('debe validar coherencia de peso vs gramaje', () => {
      const calculosService = new CalculosReportesService();
      const datos = {
        gramajePorGrano: 0.0450,
        granosPorurf: 48500,
        pesoGranosPorUrf: 2000, // Inconsistente
      };

      const validacion = calculosService.validarCoherenciaDatos(datos);
      expect(validacion.advertencias.length).toBeGreaterThan(0);
    });

    it('debe validar coherencia de rendimiento vs peso', () => {
      const calculosService = new CalculosReportesService();
      const datos = {
        pesoGranosPorUrf: 2182.5,
        kgHaCorregido: 3000, // Inconsistente
      };

      const validacion = calculosService.validarCoherenciaDatos(datos);
      expect(validacion.advertencias.length).toBeGreaterThan(0);
    });

    it('debe validar densidad lógica', () => {
      const calculosService = new CalculosReportesService();
      const datos = {
        densidadPlantasFinal: 10,
        densidadSiembra: 8, // Error
      };

      const validacion = calculosService.validarCoherenciaDatos(datos);
      expect(validacion.errores.length).toBeGreaterThan(0);
    });
  });

  describe('Cálculos Estadísticos', () => {
    it('debe calcular percentiles correctamente', () => {
      const calculosService = new CalculosReportesService();
      const valores = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const percentiles = calculosService.calcularPercentiles(valores);

      expect(percentiles.q1).toBeGreaterThan(1);
      expect(percentiles.q2).toBeGreaterThan(percentiles.q1);
      expect(percentiles.q3).toBeGreaterThan(percentiles.q2);
      expect(percentiles.q3).toBeLessThanOrEqual(10);
    });

    it('debe calcular correlación de Pearson', () => {
      const calculosService = new CalculosReportesService();
      const x = [1, 2, 3, 4, 5];
      const y = [2, 4, 6, 8, 10]; // Correlación perfecta positiva

      const correlacion = calculosService.calcularCorrelacionPearson(x, y);
      expect(correlacion).toBeCloseTo(1, 1);
    });

    it('debe detectar correlación negativa', () => {
      const calculosService = new CalculosReportesService();
      const x = [1, 2, 3, 4, 5];
      const y = [10, 8, 6, 4, 2]; // Correlación perfecta negativa

      const correlacion = calculosService.calcularCorrelacionPearson(x, y);
      expect(correlacion).toBeCloseTo(-1, 1);
    });
  });
});

