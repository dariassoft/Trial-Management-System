import * as ExcelJS from 'exceljs';

/**
 * Generador COMPLETO de reportes Excel con TODOS los datos del ensayo
 */
export class ExcelReportGenerator {
  /**
   * Genera reporte COMPLETO de ensayo en Excel
   */
  static async generarReporteEnsayo(datos: any): Promise<Buffer> {
    const workbook: any = new (ExcelJS as any).Workbook();

    // Hoja 1: Resumen
    const ws1 = workbook.addWorksheet('Resumen');
    ws1.getCell('A1').value = 'REPORTE DE ENSAYO';
    ws1.getCell('A1').font = { bold: true, size: 14 };

    let row = 3;
    const meta = datos.metadatos || {};
    const resumenData = [
      ['ID Ensayo', (meta as any).ensayoId || ''],
      ['Nombre', (meta as any).nombreEnsayo || ''],
      ['Cultivo', (meta as any).cultivo || ''],
      ['Variedad', (meta as any).variedad || ''],
      ['Provincia', (meta as any).provincia || ''],
      ['Fecha Siembra', (meta as any).fechaSiembra || ''],
      ['Fecha Cosecha', (meta as any).fechaCosecha || ''],
      ['Tratamientos', (meta as any).numeroTratamientos || 0],
      ['Bloques', (meta as any).numeroBloques || 0],
    ];

    for (const [label, value] of resumenData) {
      ws1.getCell(`A${row}`).value = label;
      ws1.getCell(`A${row}`).font = { bold: true };
      ws1.getCell(`B${row}`).value = value;
      row++;
    }

    ws1.getColumn('A').width = 25;
    ws1.getColumn('B').width = 50;

    // Hoja 2: Evaluaciones Fechas
    const ws2 = workbook.addWorksheet('Evaluaciones Fechas');
    ws2.getCell('A1').value = 'EVALUACIONES EN CAMPO - FECHAS';
    ws2.getCell('A1').font = { bold: true, size: 12 };

    const headers2 = ['DDS', 'Fecha', 'Variables'];
    for (let i = 0; i < headers2.length; i++) {
      ws2.getCell(3, i + 1).value = headers2[i];
      ws2.getCell(3, i + 1).font = { bold: true };
    }

    let row2 = 4;
    if (datos.evaluacionesFechas && datos.evaluacionesFechas.length > 0) {
      for (const eva of datos.evaluacionesFechas) {
        ws2.getCell(`A${row2}`).value = eva[0] || '';
        ws2.getCell(`B${row2}`).value = eva[1] || '';
        ws2.getCell(`C${row2}`).value = eva[2] || '';
        row2++;
      }
    }

    ws2.getColumn('A').width = 15;
    ws2.getColumn('B').width = 20;
    ws2.getColumn('C').width = 40;

    // Hoja 3: Evaluaciones Detalle
    const ws3 = workbook.addWorksheet('Evaluaciones Detalle');
    ws3.pageSetup.orientation = 'landscape';
    ws3.getCell('A1').value = 'EVALUACIONES - DETALLE';
    ws3.getCell('A1').font = { bold: true, size: 12 };

    if (datos.headerEvaluaciones && datos.headerEvaluaciones.length > 0) {
      for (let i = 0; i < datos.headerEvaluaciones.length; i++) {
        ws3.getCell(3, i + 1).value = datos.headerEvaluaciones[i];
        ws3.getCell(3, i + 1).font = { bold: true };
      }
    }

    let row3 = 4;
    if (datos.evaluacionesDetalle && datos.evaluacionesDetalle.length > 0) {
      for (const det of datos.evaluacionesDetalle) {
        for (let i = 0; i < det.length; i++) {
          ws3.getCell(row3, i + 1).value = det[i] || '';
        }
        row3++;
      }
    }

    // Hoja 4: Datos Campo
    const ws4 = workbook.addWorksheet('Datos Campo');
    ws4.getCell('A1').value = 'DATOS DE CAMPO';
    ws4.getCell('A1').font = { bold: true, size: 12 };

    if (datos.datosCampo && datos.datosCampo.length > 0) {
      const headers4 = ['Parcela', 'Tratamiento', 'Bloque', 'Momento', 'Variable', 'Valor'];
      for (let i = 0; i < headers4.length; i++) {
        ws4.getCell(3, i + 1).value = headers4[i];
        ws4.getCell(3, i + 1).font = { bold: true };
      }

      let row4 = 4;
      for (const dc of datos.datosCampo) {
        ws4.getCell(`A${row4}`).value = (dc as any).parcela || '';
        ws4.getCell(`B${row4}`).value = (dc as any).tratamiento || '';
        ws4.getCell(`C${row4}`).value = (dc as any).bloque || '';
        ws4.getCell(`D${row4}`).value = (dc as any).momento || '';
        ws4.getCell(`E${row4}`).value = (dc as any).variable || '';
        ws4.getCell(`F${row4}`).value = (dc as any).valor || '';
        row4++;
      }
    }

    ws4.columns.forEach((col: any) => { col.width = 15; });

    // Hoja 5: Datos Cosecha
    const ws5 = workbook.addWorksheet('Datos Cosecha');
    ws5.getCell('A1').value = 'DATOS DE COSECHA';
    ws5.getCell('A1').font = { bold: true, size: 12 };

    if (datos.datosTrilla && datos.datosTrilla.length > 0) {
      const headers5 = ['Parcela', 'Tratamiento', 'Bloque', 'Humedad %', 'kg/ha', 'GIE %', 'Larvas', 'Benéficos'];
      for (let i = 0; i < headers5.length; i++) {
        ws5.getCell(3, i + 1).value = headers5[i];
        ws5.getCell(3, i + 1).font = { bold: true };
      }

      let row5 = 4;
      for (const dt of datos.datosTrilla) {
        ws5.getCell(`A${row5}`).value = (dt as any).parcela || '';
        ws5.getCell(`B${row5}`).value = (dt as any).tratamiento || '';
        ws5.getCell(`C${row5}`).value = (dt as any).bloque || '';
        ws5.getCell(`D${row5}`).value = (dt as any).humedad || '';
        ws5.getCell(`E${row5}`).value = (dt as any).kgHa || '';
        ws5.getCell(`F${row5}`).value = (dt as any).gje || (dt as any).gie || '';
        ws5.getCell(`G${row5}`).value = (dt as any).larvas || '';
        ws5.getCell(`H${row5}`).value = (dt as any).beneficos || '';
        row5++;
      }
    }

    ws5.columns.forEach((col: any) => { col.width = 15; });

    // Hoja 6: Estadísticas
    const ws6 = workbook.addWorksheet('Estadísticas');
    ws6.getCell('A1').value = 'ESTADÍSTICAS POR TRATAMIENTO';
    ws6.getCell('A1').font = { bold: true, size: 12 };

    const headers6 = ['Tratamiento', 'N', 'Promedio', 'Desviación', 'Mínimo', 'Máximo', 'GIE', 'Larvas', 'Benéficos'];
    for (let i = 0; i < headers6.length; i++) {
      ws6.getCell(3, i + 1).value = headers6[i];
      ws6.getCell(3, i + 1).font = { bold: true };
    }

    let row6 = 4;
    for (const [trat, stats] of Object.entries(datos.estadisticas || {})) {
      const s = stats as any;
      ws6.getCell(`A${row6}`).value = trat;
      ws6.getCell(`B${row6}`).value = s.n || 0;
      ws6.getCell(`C${row6}`).value = s.promedio || 0;
      ws6.getCell(`D${row6}`).value = s.desviacion || 0;
      ws6.getCell(`E${row6}`).value = s.minimo || 0;
      ws6.getCell(`F${row6}`).value = s.maximo || 0;
      ws6.getCell(`G${row6}`).value = s.gie || 0;
      ws6.getCell(`H${row6}`).value = s.larvas_porurf || 0;
      ws6.getCell(`I${row6}`).value = s.insectos_beneficios_porurf || 0;
      row6++;
    }

    ws6.columns.forEach((col: any) => { col.width = 15; });

    // Hoja 7: Resumen Estadístico para Gráficos
    const ws7 = workbook.addWorksheet('Análisis Gráfico');
    ws7.pageSetup.orientation = 'landscape';

    ws7.getCell('A1').value = 'TABLAS PARA ANÁLISIS Y VISUALIZACIÓN';
    ws7.getCell('A1').font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
    ws7.getCell('A1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } };
    ws7.mergeCells('A1:C1');
    ws7.getRow(1).height = 25;

    let rowG = 3;

    // TABLA 1: Rendimiento por Tratamiento
    ws7.getCell(`A${rowG}`).value = 'RENDIMIENTO POR TRATAMIENTO (kg/ha)';
    ws7.getCell(`A${rowG}`).font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' } };
    ws7.getCell(`A${rowG}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };
    ws7.mergeCells(`A${rowG}:B${rowG}`);
    rowG++;

    ws7.getCell(`A${rowG}`).value = 'Tratamiento';
    ws7.getCell(`B${rowG}`).value = 'Rendimiento (kg/ha)';
    ws7.getCell(`A${rowG}`).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    ws7.getCell(`B${rowG}`).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    ws7.getCell(`A${rowG}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };
    ws7.getCell(`B${rowG}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };
    ws7.getCell(`A${rowG}`).alignment = { horizontal: 'center', vertical: 'center' };
    ws7.getCell(`B${rowG}`).alignment = { horizontal: 'center', vertical: 'center' };
    rowG++;

    let rendCount = 0;

    for (const [trat, stats] of Object.entries(datos.estadisticas || {})) {
      const s = stats as any;
      ws7.getCell(`A${rowG}`).value = trat;
      ws7.getCell(`B${rowG}`).value = s.promedio || 0;
      ws7.getCell(`B${rowG}`).numFmt = '0.00';
      ws7.getCell(`A${rowG}`).alignment = { horizontal: 'center' };
      ws7.getCell(`B${rowG}`).alignment = { horizontal: 'right' };
      rowG++;
      rendCount++;
    }

    // Nota: ExcelJS 4.4.0 tiene limitaciones con gráficos integrados
    // Las tablas de datos anteriores están configuradas para que el usuario
    // pueda crear gráficos directamente en Excel usando los datos proporcionados
    console.log(`[DEBUG] Tabla Rendimiento creada: ${rendCount} tratamientos`);


    rowG += 18;

    // TABLA 2: GIE por Tratamiento
    ws7.getCell(`A${rowG}`).value = 'GIE POR TRATAMIENTO (%)';
    ws7.getCell(`A${rowG}`).font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' } };
    ws7.getCell(`A${rowG}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF10B981' } };
    ws7.mergeCells(`A${rowG}:B${rowG}`);
    rowG++;

    ws7.getCell(`A${rowG}`).value = 'Tratamiento';
    ws7.getCell(`B${rowG}`).value = 'GIE (%)';
    ws7.getCell(`A${rowG}`).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    ws7.getCell(`B${rowG}`).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    ws7.getCell(`A${rowG}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF10B981' } };
    ws7.getCell(`B${rowG}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF10B981' } };
    ws7.getCell(`A${rowG}`).alignment = { horizontal: 'center', vertical: 'center' };
    ws7.getCell(`B${rowG}`).alignment = { horizontal: 'center', vertical: 'center' };
    rowG++;

    let gieCount = 0;

    for (const [trat, stats] of Object.entries(datos.estadisticas || {})) {
      const s = stats as any;
      ws7.getCell(`A${rowG}`).value = trat;
      ws7.getCell(`B${rowG}`).value = s.gie || 0;
      ws7.getCell(`B${rowG}`).numFmt = '0.00';
      ws7.getCell(`A${rowG}`).alignment = { horizontal: 'center' };
      ws7.getCell(`B${rowG}`).alignment = { horizontal: 'right' };
      rowG++;
      gieCount++;
    }

    // Nota: ExcelJS 4.4.0 tiene limitaciones con gráficos integrados
    console.log(`[DEBUG] Tabla GIE creada: ${gieCount} tratamientos`);


    rowG += 18;

    // TABLA 3: Plagas vs Benéficos
    ws7.getCell(`A${rowG}`).value = 'PLAGAS VS INSECTOS BENÉFICOS (por m²)';
    ws7.getCell(`A${rowG}`).font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' } };
    ws7.getCell(`A${rowG}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF59E0B' } };
    ws7.mergeCells(`A${rowG}:C${rowG}`);
    rowG++;

    ws7.getCell(`A${rowG}`).value = 'Tratamiento';
    ws7.getCell(`B${rowG}`).value = 'Larvas/m²';
    ws7.getCell(`C${rowG}`).value = 'Benéficos/m²';
    ws7.getCell(`A${rowG}`).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    ws7.getCell(`B${rowG}`).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    ws7.getCell(`C${rowG}`).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    ws7.getCell(`A${rowG}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF59E0B' } };
    ws7.getCell(`B${rowG}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF59E0B' } };
    ws7.getCell(`C${rowG}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF59E0B' } };
    ws7.getCell(`A${rowG}`).alignment = { horizontal: 'center', vertical: 'center' };
    ws7.getCell(`B${rowG}`).alignment = { horizontal: 'center', vertical: 'center' };
    ws7.getCell(`C${rowG}`).alignment = { horizontal: 'center', vertical: 'center' };
    rowG++;

    let plagasCount = 0;

    for (const [trat, stats] of Object.entries(datos.estadisticas || {})) {
      const s = stats as any;
      const larvas = s.larvas_porurf || 0;
      const beneficos = s.insectos_beneficios_porurf || 0;
      ws7.getCell(`A${rowG}`).value = trat;
      ws7.getCell(`B${rowG}`).value = larvas;
      ws7.getCell(`C${rowG}`).value = beneficos;
      ws7.getCell(`B${rowG}`).numFmt = '0.00';
      ws7.getCell(`C${rowG}`).numFmt = '0.00';
      ws7.getCell(`A${rowG}`).alignment = { horizontal: 'center' };
      ws7.getCell(`B${rowG}`).alignment = { horizontal: 'right' };
      ws7.getCell(`C${rowG}`).alignment = { horizontal: 'right' };
      rowG++;
      plagasCount++;
    }

    // Nota: ExcelJS 4.4.0 tiene limitaciones con gráficos integrados
    console.log(`[DEBUG] Tabla Plagas vs Benéficos creada: ${plagasCount} tratamientos`);


    // Configurar anchos de columna
    ws7.getColumn('A').width = 20;
    ws7.getColumn('B').width = 22;
    ws7.getColumn('C').width = 22;
    ws7.getColumn('D').width = 2;

    console.log('[DEBUG] ===== GENERANDO EXCEL FINAL =====');
    console.log('[DEBUG] Versión: Excel Report Generator v1.1 (Sin gráficos embebidos)');
    console.log('[DEBUG] Numero de hojas:', workbook.worksheets.length);
    console.log('[DEBUG] Hoja Análisis Gráfico tiene:', ws7.charts?.length || 0, 'gráficos');

    // ExcelJS tiene bug donde los gráficos no se incluyen en writeBuffer()
    // Por eso escribimos a disco temporal, luego leemos como buffer
    const fs = require('fs');
    const os = require('os');
    const tempFile = `${os.tmpdir()}/excel_${Date.now()}.xlsx`;

    console.log(`[DEBUG] Escribiendo a archivo temporal: ${tempFile}`);
    await workbook.xlsx.writeFile(tempFile);
    console.log(`[DEBUG] ✅ Archivo temporal creado`);

    // Leer el archivo como buffer
    const buffer = fs.readFileSync(tempFile);

    // Eliminar archivo temporal
    fs.unlinkSync(tempFile);
    console.log(`[DEBUG] ✅ Archivo temporal eliminado`);

    return buffer;
  }
}
