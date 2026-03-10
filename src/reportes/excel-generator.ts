import * as ExcelJS from 'exceljs';
import { SvgChartsService } from './svg-charts.service';

/**
 * Generador de reportes Excel profesional usando ExcelJS
 * Incrusta gráficos como imágenes SVG generadas por SvgChartsService
 */
export class ExcelReportGenerator {
  static async generarReporteEnsayo(datos: any): Promise<Buffer> {
    const wb = new ExcelJS.Workbook();

    // Estilos comunes
    const headerFill: ExcelJS.Fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' },
    };
    const headerFont: Partial<ExcelJS.Font> = {
      bold: true,
      color: { argb: 'FFFFFFFF' },
      size: 12,
    };
    const titleFont: Partial<ExcelJS.Font> = {
      bold: true,
      size: 14,
      color: { argb: 'FF4472C4' },
    };
    const borderStyle: Partial<ExcelJS.Borders> = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    // ===== HOJA 1: RESUMEN =====
    const ws1 = wb.addWorksheet('Resumen');
    const meta = datos.metadatos || {};
    
    // Título de la hoja
    ws1.mergeCells('A1:B1');
    const titleCell = ws1.getCell('A1');
    titleCell.value = 'RESUMEN DEL ENSAYO';
    titleCell.font = titleFont;
    titleCell.alignment = { horizontal: 'center' };

    ws1.columns = [
      { key: 'concepto', width: 30 },
      { key: 'valor', width: 60 },
    ];

    const resumenData = [
      { concepto: 'ID Ensayo', valor: (meta as any).ensayoId || '' },
      { concepto: 'Nombre', valor: (meta as any).nombreEnsayo || '' },
      { concepto: 'Cultivo', valor: (meta as any).cultivo || '' },
      { concepto: 'Variedad', valor: (meta as any).variedad || '' },
      { concepto: 'Provincia', valor: (meta as any).provincia || '' },
      { concepto: 'Fecha Siembra', valor: (meta as any).fechaSiembra || '' },
      { concepto: 'Fecha Cosecha', valor: (meta as any).fechaCosecha || '' },
      { concepto: 'Tratamientos', valor: (meta as any).numeroTratamientos || 0 },
      { concepto: 'Bloques', valor: (meta as any).numeroBloques || 0 },
    ];

    let currentRow = 3;
    resumenData.forEach((row) => {
      const r = ws1.getRow(currentRow);
      r.values = [row.concepto, row.valor];
      
      // Estilo para la columna de concepto
      const cellConcepto = ws1.getCell(`A${currentRow}`);
      cellConcepto.font = { bold: true };
      cellConcepto.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE9E9E9' } };
      cellConcepto.border = borderStyle as ExcelJS.Borders;

      // Estilo para la columna de valor
      const cellValor = ws1.getCell(`B${currentRow}`);
      cellValor.border = borderStyle as ExcelJS.Borders;
      
      currentRow++;
    });

    // ===== HOJA 2: EVALUACIONES FECHAS =====
    const ws2 = wb.addWorksheet('Evaluaciones Fechas');
    ws2.columns = [
      { header: 'DDS', key: 'dds', width: 15 },
      { header: 'Fecha', key: 'fecha', width: 20 },
      { header: 'Variables', key: 'variables', width: 80 },
    ];
    
    // Estilo encabezado
    const headerRow2 = ws2.getRow(1);
    headerRow2.font = headerFont;
    headerRow2.fill = headerFill;
    headerRow2.alignment = { horizontal: 'center' };

    if (datos.evaluacionesFechas && datos.evaluacionesFechas.length > 0) {
      const evalRows = datos.evaluacionesFechas.map((eva: any) => ({
        dds: eva[0] || '',
        fecha: eva[1] || '',
        variables: eva[2] || '',
      }));
      ws2.addRows(evalRows);
      
      // Bordes para datos
      ws2.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
          row.eachCell((cell) => {
            cell.border = borderStyle as ExcelJS.Borders;
            cell.alignment = { vertical: 'middle', wrapText: true };
          });
        }
      });
    }

    // ===== HOJA 3: EVALUACIONES DETALLE =====
    const ws3 = wb.addWorksheet('Evaluaciones Detalle');
    if (datos.headerEvaluaciones && datos.headerEvaluaciones.length > 0) {
      // Usar índices únicos para las claves de columna para evitar colisiones con nombres duplicados como "Variable"
      ws3.columns = datos.headerEvaluaciones.map((h: any, i: number) => ({
        header: h,
        key: `col_${i}`,
        width: 20,
      }));
      
      const headerRow3 = ws3.getRow(1);
      headerRow3.font = headerFont;
      headerRow3.fill = headerFill;
      headerRow3.alignment = { horizontal: 'center' };

      if (datos.evaluacionesDetalle && datos.evaluacionesDetalle.length > 0) {
        // Agregar filas directamente como arrays, ya que datos.evaluacionesDetalle es un array de arrays
        ws3.addRows(datos.evaluacionesDetalle);
        
        ws3.eachRow((row, rowNumber) => {
          if (rowNumber > 1) {
            row.eachCell((cell) => {
              cell.border = borderStyle as ExcelJS.Borders;
            });
          }
        });
      }
    }

    // ===== HOJA 4: DATOS CAMPO =====
    const ws4 = wb.addWorksheet('Datos Campo');
    ws4.columns = [
      { header: 'Parcela', key: 'parcela', width: 20 },
      { header: 'Tratamiento', key: 'tratamiento', width: 15 },
      { header: 'Bloque', key: 'bloque', width: 10 },
      { header: 'Momento', key: 'momento', width: 20 },
      { header: 'Variable', key: 'variable', width: 25 },
      { header: 'Valor', key: 'valor', width: 15 },
    ];
    
    const headerRow4 = ws4.getRow(1);
    headerRow4.font = headerFont;
    headerRow4.fill = headerFill;
    headerRow4.alignment = { horizontal: 'center' };

    if (datos.datosCampo && datos.datosCampo.length > 0) {
      const campoRows = datos.datosCampo.map((dc: any) => ({
        parcela: (dc as any).parcela || '',
        tratamiento: (dc as any).tratamiento || '',
        bloque: (dc as any).bloque || '',
        momento: (dc as any).momento || '',
        variable: (dc as any).variable || '',
        valor: (dc as any).valor || '',
      }));
      ws4.addRows(campoRows);
      
      ws4.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
          row.eachCell((cell) => {
            cell.border = borderStyle as ExcelJS.Borders;
          });
        }
      });
    }

    // ===== HOJA 5: DATOS COSECHA =====
    const ws5 = wb.addWorksheet('Datos Cosecha');
    ws5.columns = [
      { header: 'Parcela', key: 'parcela', width: 20 },
      { header: 'Tratamiento', key: 'tratamiento', width: 15 },
      { header: 'Bloque', key: 'bloque', width: 10 },
      { header: 'Humedad %', key: 'humedad', width: 15 },
      { header: 'kg/ha', key: 'kgha', width: 15 },
      { header: 'GIE %', key: 'gie', width: 15 },
      { header: 'Larvas', key: 'larvas', width: 15 },
      { header: 'Benéficos', key: 'beneficos', width: 15 },
    ];
    
    const headerRow5 = ws5.getRow(1);
    headerRow5.font = headerFont;
    headerRow5.fill = headerFill;
    headerRow5.alignment = { horizontal: 'center' };

    if (datos.datosTrilla && datos.datosTrilla.length > 0) {
      const trillaRows = datos.datosTrilla.map((dt: any) => ({
        parcela: (dt as any).parcela || '',
        tratamiento: (dt as any).tratamiento || '',
        bloque: (dt as any).bloque || '',
        humedad: (dt as any).humedad || '',
        kgha: (dt as any).kgHa || '',
        gie: (dt as any).gje || (dt as any).gie || '',
        larvas: (dt as any).larvas || '',
        beneficos: (dt as any).beneficos || '',
      }));
      ws5.addRows(trillaRows);
      
      ws5.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
          row.eachCell((cell) => {
            cell.border = borderStyle as ExcelJS.Borders;
          });
        }
      });
    }

    // ===== HOJA 6: ESTADÍSTICAS =====
    const ws6 = wb.addWorksheet('Estadísticas');
    ws6.columns = [
      { header: 'Tratamiento', key: 'tratamiento', width: 15 },
      { header: 'N', key: 'n', width: 10 },
      { header: 'Promedio', key: 'promedio', width: 15 },
      { header: 'Desviación', key: 'desviacion', width: 15 },
      { header: 'Mínimo', key: 'minimo', width: 12 },
      { header: 'Máximo', key: 'maximo', width: 12 },
      { header: 'GIE', key: 'gie', width: 12 },
      { header: 'Larvas', key: 'larvas', width: 12 },
      { header: 'Benéficos', key: 'beneficos', width: 12 },
    ];
    
    const headerRow6 = ws6.getRow(1);
    headerRow6.font = headerFont;
    headerRow6.fill = headerFill;
    headerRow6.alignment = { horizontal: 'center' };

    const statsRows: any[] = [];
    for (const [trat, stats] of Object.entries(datos.estadisticas || {})) {
      const s = stats as any;
      statsRows.push({
        tratamiento: trat,
        n: s.n || 0,
        promedio: s.promedio || 0,
        desviacion: s.desviacion || 0,
        minimo: s.minimo || 0,
        maximo: s.maximo || 0,
        gie: s.gie || 0,
        larvas: s.larvas_porurf || 0,
        beneficos: s.insectos_beneficios_porurf || 0,
      });
    }
    if (statsRows.length > 0) {
      ws6.addRows(statsRows);
      
      ws6.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
          row.eachCell((cell) => {
            cell.border = borderStyle as ExcelJS.Borders;
            if (cell.type === ExcelJS.ValueType.Number) {
              cell.numFmt = '0.00';
            }
          });
        }
      });
    }

    // ===== HOJA 7: ANÁLISIS GRÁFICO =====
    const ws7 = wb.addWorksheet('Análisis Gráfico');
    currentRow = 2;

    // Preparar datos para gráficos
    const dataRendimiento: any[] = [];
    const dataGie: any[] = [];
    const dataLarvas: any[] = [];

    for (const [trat, stats] of Object.entries(datos.estadisticas || {})) {
      const s = stats as any;
      dataRendimiento.push({ x: trat, y: Number(s.promedio || 0) });
      dataGie.push({ x: trat, y: Number(s.gie || 0) });
      dataLarvas.push({ x: trat, y: Number(s.larvas_porurf || 0) });
    }

    // --- SECCIÓN 1: RENDIMIENTO ---
    const rendHeader = ws7.getCell(currentRow, 2);
    rendHeader.value = 'RENDIMIENTO POR TRATAMIENTO (kg/ha)';
    rendHeader.font = headerFont;
    rendHeader.fill = headerFill;
    rendHeader.alignment = { horizontal: 'center' };
    ws7.mergeCells(currentRow, 2, currentRow, 3);
    currentRow++;

    ws7.getCell(currentRow, 2).value = 'Tratamiento';
    ws7.getCell(currentRow, 3).value = 'Rendimiento (kg/ha)';
    ws7.getCell(currentRow, 2).font = { bold: true };
    ws7.getCell(currentRow, 3).font = { bold: true };
    ws7.getCell(currentRow, 2).border = borderStyle as ExcelJS.Borders;
    ws7.getCell(currentRow, 3).border = borderStyle as ExcelJS.Borders;
    currentRow++;

    for (const [trat, stats] of Object.entries(datos.estadisticas || {})) {
      const s = stats as any;
      ws7.getCell(currentRow, 2).value = trat;
      ws7.getCell(currentRow, 3).value = Number(s.promedio || 0);
      ws7.getCell(currentRow, 3).numFmt = '0.00';
      ws7.getCell(currentRow, 2).border = borderStyle as ExcelJS.Borders;
      ws7.getCell(currentRow, 3).border = borderStyle as ExcelJS.Borders;
      currentRow++;
    }

    // GRÁFICO RENDIMIENTO (SVG)
    if (dataRendimiento.length > 0) {
      try {
        const svgString = SvgChartsService.generarGraficoBarras(dataRendimiento, {
          titulo: 'Rendimiento (kg/ha)',
          ancho: 600,
          alto: 350,
          ejeY: 'kg/ha'
        });
        
        const imageId = wb.addImage({
          buffer: Buffer.from(svgString) as any,
          extension: 'png',
        });

        // Colocar gráfico a la derecha de la tabla, sin solapar
        ws7.addImage(imageId, {
          tl: { col: 4, row: 1 }, // Columna E, Fila 2
          ext: { width: 600, height: 350 }
        });
      } catch (e) {
        // Silencioso
      }
    }

    // Espacio suficiente para el siguiente gráfico (altura del gráfico + margen)
    currentRow = Math.max(currentRow, 2 + 18); 

    // --- SECCIÓN 2: GIE ---
    const gieHeader = ws7.getCell(currentRow, 2);
    gieHeader.value = 'GIE POR TRATAMIENTO (%)';
    gieHeader.font = headerFont;
    gieHeader.fill = headerFill;
    gieHeader.alignment = { horizontal: 'center' };
    ws7.mergeCells(currentRow, 2, currentRow, 3);
    currentRow++;

    ws7.getCell(currentRow, 2).value = 'Tratamiento';
    ws7.getCell(currentRow, 3).value = 'GIE (%)';
    ws7.getCell(currentRow, 2).font = { bold: true };
    ws7.getCell(currentRow, 3).font = { bold: true };
    ws7.getCell(currentRow, 2).border = borderStyle as ExcelJS.Borders;
    ws7.getCell(currentRow, 3).border = borderStyle as ExcelJS.Borders;
    currentRow++;

    const gieDataStart = currentRow;
    let gieCount = 0;
    for (const [trat, stats] of Object.entries(datos.estadisticas || {})) {
      const s = stats as any;
      ws7.getCell(currentRow, 2).value = trat;
      ws7.getCell(currentRow, 3).value = Number(s.gie || 0);
      ws7.getCell(currentRow, 3).numFmt = '0.00';
      ws7.getCell(currentRow, 2).border = borderStyle as ExcelJS.Borders;
      ws7.getCell(currentRow, 3).border = borderStyle as ExcelJS.Borders;
      currentRow++;
      gieCount++;
    }

    // GRÁFICO GIE (SVG)
    if (dataGie.length > 0) {
      try {
        const svgString = SvgChartsService.generarGraficoBarras(dataGie, {
          titulo: 'GIE (%)',
          ancho: 600,
          alto: 350,
          ejeY: '%'
        });
        
        const imageId = wb.addImage({
          buffer: Buffer.from(svgString) as any,
          extension: 'png',
        });

        const rowStart = currentRow - dataGie.length - 3;
        ws7.addImage(imageId, {
          tl: { col: 4, row: rowStart }, 
          ext: { width: 600, height: 350 }
        });
      } catch (e) {
        // Silencioso
      }
    }

    currentRow = Math.max(currentRow, currentRow + 15);

    // --- SECCIÓN 3: PLAGAS ---
    const plagasHeader = ws7.getCell(currentRow, 2);
    plagasHeader.value = 'PLAGAS (Larvas/m²)';
    plagasHeader.font = headerFont;
    plagasHeader.fill = headerFill;
    plagasHeader.alignment = { horizontal: 'center' };
    ws7.mergeCells(currentRow, 2, currentRow, 3);
    currentRow++;

    ws7.getCell(currentRow, 2).value = 'Tratamiento';
    ws7.getCell(currentRow, 3).value = 'Larvas/m²';
    ws7.getCell(currentRow, 2).font = { bold: true };
    ws7.getCell(currentRow, 3).font = { bold: true };
    ws7.getCell(currentRow, 2).border = borderStyle as ExcelJS.Borders;
    ws7.getCell(currentRow, 3).border = borderStyle as ExcelJS.Borders;
    currentRow++;

    const plagasDataStart = currentRow;
    let plagasCount = 0;
    for (const [trat, stats] of Object.entries(datos.estadisticas || {})) {
      const s = stats as any;
      ws7.getCell(currentRow, 2).value = trat;
      ws7.getCell(currentRow, 3).value = Number(s.larvas_porurf || 0);
      ws7.getCell(currentRow, 3).numFmt = '0.00';
      ws7.getCell(currentRow, 2).border = borderStyle as ExcelJS.Borders;
      ws7.getCell(currentRow, 3).border = borderStyle as ExcelJS.Borders;
      currentRow++;
      plagasCount++;
    }

    // GRÁFICO PLAGAS (SVG)
    if (dataLarvas.length > 0) {
      try {
        const svgString = SvgChartsService.generarGraficoBarras(dataLarvas, {
          titulo: 'Larvas por m²',
          ancho: 600,
          alto: 350,
          ejeY: 'Larvas/m²'
        });
        
        const imageId = wb.addImage({
          buffer: Buffer.from(svgString) as any,
          extension: 'png',
        });

        const rowStart = currentRow - dataLarvas.length - 3;
        ws7.addImage(imageId, {
          tl: { col: 4, row: rowStart },
          ext: { width: 600, height: 350 }
        });
      } catch (e) {
        // Silencioso
      }
    }

    // Ajustar anchos de columna en hoja de gráficos
    ws7.getColumn(2).width = 20;
    ws7.getColumn(3).width = 20;

    return await wb.xlsx.writeBuffer() as any;
  }
}
