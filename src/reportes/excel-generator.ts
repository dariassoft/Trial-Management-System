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
      ['Ensayo ID', datos.metadatos?.ensayoId || 'N/A'],
      ['Fecha Siembra', datos.metadatos?.fechaSiembra || 'N/A'],
      ['Provincia', datos.metadatos?.provincia || 'N/A'],
      ['Departamento', datos.metadatos?.departamento || 'N/A'],
      ['Cultivo', datos.metadatos?.cultivo || 'N/A'],
      ['Tipo de Siembra', datos.metadatos?.tipoSiembra || 'N/A'],
      ['Estadío', datos.metadatos?.estadio || 'N/A'],
      ['Temperatura', `${datos.metadatos?.temperatura || 'N/A'}°C`],
      ['Humedad Relativa', `${datos.metadatos?.humedad || 'N/A'}%`],
    ];

    for (const [label, value] of metadata) {
      ws.getCell(`A${row}`).value = label;
      ws.getCell(`B${row}`).value = value;
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
}
