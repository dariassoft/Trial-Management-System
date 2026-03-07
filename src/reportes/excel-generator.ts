import * as ExcelJS from 'exceljs';

/**
 * Servicio para generar reportes en Excel con estilos y gráficos
 */
export class ExcelReportGenerator {
  /**
   * Genera reporte completo de ensayo en Excel
   */
  static async generarReporteEnsayo(datos: {
    metadatos: any;
    datosCampo: any[];
    datosTrilla: any[];
    estadisticas: any;
  }): Promise<Buffer> {
    const workbook: any = new (ExcelJS as any).Workbook();

    // Hoja 1: Resumen
    this.crearHojaResumen(workbook, datos);

    // Hoja 2: Datos de Campo
    this.crearHojaDatosCampo(workbook, datos.datosCampo);

    // Hoja 3: Datos de Trilla
    this.crearHojaDatosTrilla(workbook, datos.datosTrilla);

    // Hoja 4: Estadísticas
    this.crearHojaEstadisticas(workbook, datos.estadisticas);

    // Hoja 5: Gráficos
    this.crearHojaGraficos(workbook, datos.estadisticas);

    // Generar buffer
    const buffer: any = await workbook.xlsx.writeBuffer();
    return Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
  }

  private static crearHojaResumen(workbook: any, datos: any) {
    const ws = workbook.addWorksheet('Resumen');

    // Estilos
    const titleStyle: any = {
      font: { bold: true, size: 14, color: { argb: 'FFFFFFFF' } },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1F4E78' },
      },
      alignment: { horizontal: 'center', vertical: 'middle' },
    };

    // Título
    ws.getCell('A1').value = 'REPORTE DE ENSAYO';
    ws.getCell('A1').style = titleStyle;
    ws.getRow(1).height = 30;

    // Metadata
    let row = 3;
    const metadata = [
      ['DATOS DEL ENSAYO', ''],
      ['Ensayo ID', datos.metadatos?.ensayoId || ''],
      ['Fecha Siembra', datos.metadatos?.fechaSiembra || ''],
      ['Provincia', datos.metadatos?.provincia || ''],
      ['Departamento', datos.metadatos?.departamento || ''],
      ['Cultivo', datos.metadatos?.cultivo || ''],
      ['Tipo de Siembra', datos.metadatos?.tipoSiembra || ''],
      ['Estadío', datos.metadatos?.estadio || ''],
      ['Temperatura', datos.metadatos?.temperatura ? `${datos.metadatos.temperatura}°C` : ''],
      ['Humedad Relativa', datos.metadatos?.humedad ? `${datos.metadatos.humedad}%` : ''],
    ];

    for (const [label, value] of metadata) {
      ws.getCell(`A${row}`).value = label;
      if (value) {
        ws.getCell(`B${row}`).value = value;
      }
      if (label === 'DATOS DEL ENSAYO') {
        ws.getCell(`A${row}`).font = { bold: true, size: 12 };
      } else {
        ws.getCell(`A${row}`).font = { bold: true };
      }
      row++;
    }

    ws.getColumn('A').width = 25;
    ws.getColumn('B').width = 35;
  }

  private static crearHojaDatosCampo(workbook: any, datos: any[]) {
    const ws = workbook.addWorksheet('Datos Campo');

    if (!datos || datos.length === 0) {
      ws.addRow(['No hay datos de campo']);
      return;
    }

    // Headers
    const headers = Object.keys(datos[0]);
    const headerRow = ws.addRow(headers);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD9E1F2' },
    };

    // Datos
    for (const dato of datos) {
      ws.addRow(Object.values(dato));
    }

    // Auto-width
    ws.columns.forEach((column: any) => {
      column.width = 15;
    });
  }

  private static crearHojaDatosTrilla(workbook: any, datos: any[]) {
    const ws = workbook.addWorksheet('Datos Trilla');

    if (!datos || datos.length === 0) {
      ws.addRow(['No hay datos de trilla']);
      return;
    }

    // Headers
    const headers = Object.keys(datos[0]);
    const headerRow = ws.addRow(headers);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD9E1F2' },
    };

    // Datos
    for (const dato of datos) {
      ws.addRow(Object.values(dato));
    }

    // Auto-width
    ws.columns.forEach((column: any) => {
      column.width = 15;
    });
  }

  private static crearHojaEstadisticas(workbook: any, estadisticas: any) {
    const ws = workbook.addWorksheet('Estadísticas');

    const headers = [
      'Tratamiento',
      'N',
      'Promedio',
      'Desviación',
      'Mínimo',
      'Máximo',
      'CV %',
    ];
    const headerRow = ws.addRow(headers);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD9E1F2' },
    };

    // Datos
    for (const [trat, stats] of Object.entries(estadisticas)) {
      const statsData = stats as any;
      ws.addRow([
        trat,
        statsData.n,
        statsData.promedio,
        statsData.desviacion,
        statsData.minimo,
        statsData.maximo,
        statsData.coefVariacion,
      ]);
    }

    ws.columns.forEach((column: any) => {
      column.width = 15;
    });
  }

  private static crearHojaGraficos(workbook: any, estadisticas: any) {
    const ws = workbook.addWorksheet('Gráficos');

    if (!estadisticas || Object.keys(estadisticas).length === 0) {
      ws.addRow(['No hay datos para gráficos']);
      return;
    }

    // Título
    const titleCell = ws.getCell('A1');
    titleCell.value = 'GRÁFICOS Y VISUALIZACIONES';
    titleCell.font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
    titleCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1F4E78' },
    };
    ws.getRow(1).height = 25;

    // Tabla 1: Rendimiento promedio
    let row = 3;
    ws.getCell(`A${row}`).value = 'Rendimiento Promedio por Tratamiento';
    ws.getCell(`A${row}`).font = { bold: true, size: 12 };
    row++;

    ws.getCell(`A${row}`).value = 'Tratamiento';
    ws.getCell(`B${row}`).value = 'Rendimiento (kg/ha)';
    const headerRow1 = ws.getRow(row);
    headerRow1.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow1.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF3b82f6' } };
    row++;

    Object.keys(estadisticas).sort().forEach((trat, idx) => {
      const stats = estadisticas[trat] as any;
      ws.getCell(`A${row}`).value = `T${idx + 1}`;
      ws.getCell(`B${row}`).value = stats.promedio ? Number(stats.promedio.toFixed(2)) : 0;
      ws.getCell(`B${row}`).numFmt = '0.00';
      row++;
    });

    // Crear gráfico de barras para rendimiento
    try {
      const chartRend: any = workbook.addChart('bar');
      chartRend.title = { richText: [{ font: { bold: true, size: 14 }, text: 'Rendimiento por Tratamiento' }] };
      chartRend.series[0].title = { v: 'Rendimiento (kg/ha)', t: 's' };
      chartRend.series[0].val = `'Gráficos'!B5:B${row - 1}`;
      chartRend.xAxis.val = `'Gráficos'!A5:A${row - 1}`;
      chartRend.xAxis.type = 'cat';
      chartRend.yAxis.type = 'val';
      chartRend.plotArea = { layout: { x: 0.13, y: 0.13, w: 0.75, h: 0.75 } };
      ws.addChart(chartRend, `A${row + 3}:H${row + 13}`);
    } catch (e) {
      // Si falla, continuar sin gráfico
    }

    row += 16;

    // Tabla 2: GIE promedio
    ws.getCell(`A${row}`).value = 'GIE Promedio por Tratamiento';
    ws.getCell(`A${row}`).font = { bold: true, size: 12 };
    row++;

    ws.getCell(`A${row}`).value = 'Tratamiento';
    ws.getCell(`B${row}`).value = 'GIE (%)';
    const headerRow2 = ws.getRow(row);
    headerRow2.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow2.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF10b981' } };
    row++;

    let dataStartRow = row;
    Object.keys(estadisticas).sort().forEach((trat, idx) => {
      const stats = estadisticas[trat] as any;
      ws.getCell(`A${row}`).value = `T${idx + 1}`;
      ws.getCell(`B${row}`).value = stats.gie ? Number(stats.gie.toFixed(2)) : 0;
      ws.getCell(`B${row}`).numFmt = '0.00';
      row++;
    });

    // Crear gráfico de barras para GIE
    try {
      const chartGie: any = workbook.addChart('bar');
      chartGie.title = { richText: [{ font: { bold: true, size: 14 }, text: 'GIE por Tratamiento' }] };
      chartGie.series[0].title = { v: 'GIE (%)', t: 's' };
      chartGie.series[0].val = `'Gráficos'!B${dataStartRow}:B${row - 1}`;
      chartGie.xAxis.val = `'Gráficos'!A${dataStartRow}:A${row - 1}`;
      chartGie.xAxis.type = 'cat';
      chartGie.yAxis.type = 'val';
      chartGie.plotArea = { layout: { x: 0.13, y: 0.13, w: 0.75, h: 0.75 } };
      ws.addChart(chartGie, `A${row + 3}:H${row + 13}`);
    } catch (e) {
      // Si falla, continuar sin gráfico
    }

    row += 16;

    // Tabla 3: Plagas vs Benéficos
    ws.getCell(`A${row}`).value = 'Comparativa: Plagas vs Benéficos';
    ws.getCell(`A${row}`).font = { bold: true, size: 12 };
    row++;

    ws.getCell(`A${row}`).value = 'Tratamiento';
    ws.getCell(`B${row}`).value = 'Larvas/m²';
    ws.getCell(`C${row}`).value = 'Benéficos/m²';
    const headerRow3 = ws.getRow(row);
    headerRow3.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow3.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFf59e0b' } };
    row++;

    dataStartRow = row;
    Object.keys(estadisticas).sort().forEach((trat, idx) => {
      const stats = estadisticas[trat] as any;
      ws.getCell(`A${row}`).value = `T${idx + 1}`;
      ws.getCell(`B${row}`).value = stats.larvas_porurf || stats.larvasPorurf || 0;
      ws.getCell(`C${row}`).value = stats.insectos_beneficios_porurf || stats.insectosBeneficiosPorurf || 0;
      row++;
    });

    ws.getColumn('A').width = 20;
    ws.getColumn('B').width = 20;
    ws.getColumn('C').width = 20;
  }
}

