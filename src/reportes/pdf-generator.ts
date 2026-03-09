import PDFKit from 'pdfkit';

export class PdfReportGenerator {
  static generarReporteEnsayo(datos: any): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      try {
        const chunks: Buffer[] = [];
        const doc: any = new PDFKit({ size: 'A4', margin: 40 });

        doc.on('data', (chunk: Buffer) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', (error: Error) => reject(error));

        // Página 1: Portada
        PdfReportGenerator.generarPortada(doc, datos);
        doc.addPage();

        // Página 2: Resumen
        PdfReportGenerator.generarResumen(doc, datos);
        doc.addPage();

        // Página 3: Datos del Ensayo
        PdfReportGenerator.generarDatosEnsayo(doc, datos);
        doc.addPage();

        // Página 4: Protocolo, Condiciones, Distribución
        PdfReportGenerator.generarProtocoloYCondiciones(doc, datos);
        doc.addPage();

        // Página 5: Evaluaciones en Campo (SOLO FECHAS)
        PdfReportGenerator.generarEvaluacionesFechas(doc, datos);

        // Página 6: Tabla "Detalle de Evaluaciones" - HORIZONTAL
        doc.addPage({ size: 'A4', layout: 'landscape', margin: 30 });
        PdfReportGenerator.generarTablaEvaluacionesDetalle(doc, datos);

        // Volver a portrait sin agregar página en blanco
        doc.addPage({ size: 'A4', margin: 40 });

        // Página 7: Datos de Campo
        PdfReportGenerator.generarTablaDatosCampo(doc, datos);
        doc.addPage();

        // Página 8: Datos de Cosecha
        PdfReportGenerator.generarTablaDatosTrilla(doc, datos);
        doc.addPage();

        // Página 9: Estadísticas
        const tieneEstadisticas = datos.estadisticas && Object.keys(datos.estadisticas).length > 0;
        if (tieneEstadisticas) {
          PdfReportGenerator.generarEstadisticas(doc, datos);
          doc.addPage();
        }

        // Página 10: Fotos (si existen)
        if (datos.fotos && datos.fotos.length > 0) {
          PdfReportGenerator.generarFotos(doc, datos);
          doc.addPage();
        }

        // Páginas 11+: Gráficos - SOLO SI HAY DATOS SUFICIENTES
        // Verificar si hay estadísticas
        if (tieneEstadisticas) {
          PdfReportGenerator.generarGraficosPNG(doc, datos);
        } else {
          // Si no hay datos para gráficos, agregar página con info útil
          doc.fontSize(14).font('Helvetica-Bold').text('INFORMACIÓN ADICIONAL');
          doc.moveDown(1);
          doc.fontSize(11).font('Helvetica').text('No hay datos de cosecha suficientes para generar gráficos de rendimiento.', doc.page.margins.left);
          doc.moveDown(0.5);
          doc.text('Para generar gráficos de análisis, se requiere registrar datos de cosecha (Datos de Trilla) para cada parcela del ensayo.');
        }

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  private static generarPortada(doc: any, datos: any): void {
    const meta = datos.metadatos || {} as any;

    doc.fontSize(32).font('Helvetica-Bold').text('REPORTE DE ENSAYO', { align: 'center' });
    doc.moveDown(2);

    doc.fontSize(18).font('Helvetica').text(`Ensayo ${(meta as any).ensayoId || ''}`, { align: 'center' });
    doc.fontSize(14).text(`${(meta as any).nombreEnsayo || ''}`, { align: 'center' });
    doc.moveDown(3);

    doc.fontSize(12).font('Helvetica-Bold').text('Información del Ensayo:', { align: 'left' });
    doc.fontSize(11).font('Helvetica');
    doc.text(`Cultivo: ${(meta as any).cultivo || ''}`);
    doc.text(`Provincia: ${(meta as any).provincia || ''}`);
    doc.text(`Departamento: ${(meta as any).departamento || ''}`);
    doc.text(`Establecimiento: ${(meta as any).establecimiento || ''}`);
    doc.moveDown(2);

    doc.fontSize(10).text(`Generado: ${new Date().toLocaleDateString('es-ES')}`);
  }

  private static generarResumen(doc: any, datos: any): void {
    doc.fontSize(20).font('Helvetica-Bold').text('RESUMEN EJECUTIVO');
    doc.moveDown(1);

    const meta = datos.metadatos || {} as any;
    const stats = datos.estadisticas || {};

    doc.fontSize(11).font('Helvetica');
    doc.text(`Cultivo: ${(meta as any).cultivo}`);
    doc.text(`Tipo de Siembra: ${(meta as any).tipoSiembra}`);
    doc.text(`Fecha Siembra: ${(meta as any).fechaSiembra}`);
    doc.text(`Fecha Cosecha: ${(meta as any).fechaCosecha}`);
    doc.moveDown(1);

    doc.fontSize(10).font('Helvetica-Bold').text('Estadísticas Generales:');
    Object.keys(stats).forEach((trat: string) => {
      const s = (stats as any)[trat];
      doc.fontSize(9).font('Helvetica').text(`${trat}: Rendimiento promedio ${s.promedio || 0} kg/ha`);
    });
  }

  private static generarDatosEnsayo(doc: any, datos: any): void {
    doc.fontSize(18).font('Helvetica-Bold').text('DATOS DEL ENSAYO');
    doc.moveDown(0.8);

    const meta = datos.metadatos || {} as any;

    // Tabla de datos del ensayo
    const tableData = [
      ['Campo', 'Valor'],
      ['Cultivo', (meta as any).cultivo || ''],
      ['Tipo de Siembra', (meta as any).tipoSiembra || ''],
      ['Provincia', (meta as any).provincia || ''],
      ['Departamento', (meta as any).departamento || ''],
      ['Establecimiento', (meta as any).establecimiento || ''],
      ['Lote', (meta as any).lote || ''],
      ['Fecha Siembra', (meta as any).fechaSiembra || ''],
      ['Fecha Cosecha', (meta as any).fechaCosecha || ''],
    ];

    PdfReportGenerator.dibujarTabla(doc, tableData, 450);
    doc.moveDown(1);

    doc.fontSize(14).font('Helvetica-Bold').fillColor('#000000').text('Aplicación', doc.page.margins.left, doc.y);
    doc.moveDown(0.5);

    const appData = [
      ['Parámetro', 'Valor'],
      ['Equipo', (meta as any).equipo || ''],
      ['Temperatura', (meta as any).temperatura || ''],
      ['Humedad Relativa', (meta as any).humedad || ''],
      ['Estadío', (meta as any).estadio || ''],
      ['Fecha Aplicación', (meta as any).fechaAplicacion || ''],
    ];

    PdfReportGenerator.dibujarTabla(doc, appData, 450);
  }

  private static generarProtocoloYCondiciones(doc: any, datos: any): void {
    doc.fontSize(18).font('Helvetica-Bold').fillColor('#000000').text('PROTOCOLO, CONDICIONES Y DISTRIBUCIÓN');
    doc.moveDown(0.8);

    const meta = datos.metadatos || {} as any;
    const protocolo = datos.protocolo || {} as any;

    // PROTOCOLO - Traer de DB
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#000000').text('Protocolo');
    doc.moveDown(0.3);
    doc.fontSize(10).font('Helvetica').fillColor('#000000').text(
      (protocolo as any).descripcion || 'Sin descripción de protocolo'
    );
    doc.moveDown(0.8);

    // CONDICIONES DE APLICACION - Todos desde BD
    const condicionesData = [
      ['Parámetro', 'Valor'],
      ['Temperatura', ((meta as any).temperatura !== undefined ? (meta as any).temperatura + '°C' : 'No registrado')],
      ['Humedad Relativa', ((meta as any).humedad !== undefined ? (meta as any).humedad + '%' : 'No registrado')],
      ['Velocidad Viento', ((meta as any).velocidadViento !== undefined ? (meta as any).velocidadViento + ' km/h' : 'No registrado')],
      ['Presión', ((meta as any).presion !== undefined ? (meta as any).presion + ' bar' : 'No registrado')],
      ['Equipo', (meta as any).equipo || 'No registrado'],
    ];

    doc.fontSize(12).font('Helvetica-Bold').fillColor('#000000').text('Condiciones de Aplicación', doc.page.margins.left, doc.y);
    doc.moveDown(0.4);
    PdfReportGenerator.dibujarTabla(doc, condicionesData, 500, 9);
    doc.moveDown(0.5);

    // DISTRIBUCION - Todos desde BD - Dinamico
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#000000').text('Distribución de Tratamientos', doc.page.margins.left, doc.y);
    doc.moveDown(0.3);
    const diseno = datos.diseno || {} as any;
    doc.fontSize(10).font('Helvetica').fillColor('#000000').text(
      'Diseño: ' + ((diseno as any).nombre || 'No especificado'), doc.page.margins.left
    );
    doc.fontSize(10).font('Helvetica').fillColor('#000000').text(
      'Repeticiones: ' + ((diseno as any).repeticiones || '0') + ' bloques', doc.page.margins.left
    );
    doc.fontSize(10).font('Helvetica').fillColor('#000000').text(
      'Tratamientos: ' + ((diseno as any).tratamientos || '0'), doc.page.margins.left
    );
  }

  private static generarEvaluacionesFechas(doc: any, datos: any): void {
    doc.fontSize(14).font('Helvetica-Bold').fillColor('#000000').text('EVALUACIONES EN CAMPO');
    doc.moveDown(0.6);

    doc.fontSize(11).font('Helvetica-Bold').fillColor('#000000').text('Momentos de evaluación:');
    doc.fontSize(9).font('Helvetica').fillColor('#333333').text(
      'DDS (Días Después de Siembra) = Días transcurridos desde la siembra. Indica cuándo se realizó cada evaluación.'
    );
    doc.moveDown(0.3);

    const evaluacionesFechas = datos.evaluacionesFechas || [];
    if (evaluacionesFechas.length === 0) {
      doc.fontSize(10).text('Sin evaluaciones programadas');
      return;
    }

    const headerFechas = [['DDS', 'Fecha Evaluación', 'Variables Medidas']];
    const fechasData = [...headerFechas, ...evaluacionesFechas];

    PdfReportGenerator.dibujarTabla(doc, fechasData, 500, 9);
  }

  private static generarTablaEvaluacionesDetalle(doc: any, datos: any): void {
    doc.fontSize(14).font('Helvetica-Bold').fillColor('#000000').text('EVALUACIONES EN CAMPO - DETALLE POR TRATAMIENTO Y BLOQUE');
    doc.moveDown(0.3);

    doc.fontSize(9).font('Helvetica-Bold').fillColor('#333333').text('¿Qué significan las columnas?');
    doc.fontSize(8).font('Helvetica').fillColor('#555555');
    doc.text('• Trat = Número de Tratamiento');
    doc.text('• Bloque = Letra del bloque (A, B, C, etc.)');
    doc.text('• Valor (X DDS) = Valor medido X días después de siembra');
    doc.text('• Fecha = Fecha cuando se realizó la medición');
    doc.text('• Variable = Nombre de la variable medida');
    doc.text('• Nº Var = Cantidad de variables medidas');
    doc.moveDown(0.4);

    const evaluaciones = datos.evaluacionesDetalle || [];
    const headerEvaluaciones = datos.headerEvaluaciones || ['Trat', 'Bloque', 'Nº Var'];

    if (evaluaciones.length === 0) {
      doc.fontSize(10).text('Sin evaluaciones registradas');
      return;
    }

    const datosEvaluacion = [headerEvaluaciones, ...evaluaciones];

    // Usar tamaño de fuente más pequeño para más columnas
    const fontSize = headerEvaluaciones.length > 10 ? 5 : 6;
    const width = headerEvaluaciones.length > 10 ? 750 : 700;

    PdfReportGenerator.dibujarTabla(doc, datosEvaluacion, width, fontSize);
  }

  private static generarTablaDatosCampo(doc: any, datos: any): void {
    doc.fontSize(18).font('Helvetica-Bold').text('DATOS DE CAMPO');
    doc.moveDown(0.8);

    const datosCampo = datos.datosCampo || [];
    if (datosCampo.length === 0) {
      doc.fontSize(10).text('Sin datos de campo registrados');
      return;
    }

    const tableData = [
      ['Parcela', 'Trat', 'Bloque', 'Momento', 'Variable', 'Valor'],
      ...datosCampo.slice(0, 15).map((dc: any) => [
        dc.parcela || '',
        String(dc.tratamiento || ''),
        dc.bloque || '',
        dc.momento || '',
        dc.variable || '',
        String(dc.valor || ''),
      ]),
    ];

    PdfReportGenerator.dibujarTabla(doc, tableData, 500, 8);
  }

  private static generarTablaDatosTrilla(doc: any, datos: any): void {
    doc.fontSize(18).font('Helvetica-Bold').text('DATOS DE COSECHA (TRILLA)');
    doc.moveDown(0.8);

    const datosTrilla = datos.datosTrilla || [];
    if (datosTrilla.length === 0) {
      doc.fontSize(10).text('Sin datos de trilla registrados');
      return;
    }

    const tableData = [
      ['Parc', 'Trat', 'Bloque', 'H%', 'kg/ha', 'GIE', 'Larvas', 'Benef', 'Altura', 'Dens'],
      ...datosTrilla.slice(0, 12).map((dt: any) => [
        (dt.parcela || '').substring(0, 8),
        String(dt.tratamiento || ''),
        dt.bloque || '',
        String(dt.humedad || '').replace('%', ''),
        String(dt.kgHa || ''),
        String(dt.gie || '').replace('%', ''),
        String(dt.larvas || ''),
        String(dt.beneficos || ''),
        String(dt.altura || ''),
        String(dt.densidad || ''),
      ]),
    ];

    PdfReportGenerator.dibujarTabla(doc, tableData, 520, 7);
  }

  private static generarEstadisticas(doc: any, datos: any): void {
    doc.fontSize(18).font('Helvetica-Bold').text('ESTADÍSTICAS POR TRATAMIENTO');
    doc.moveDown(0.8);

    const estadisticas = datos.estadisticas || {};
    if (Object.keys(estadisticas).length === 0) {
      doc.fontSize(10).text('Sin estadísticas disponibles');
      return;
    }

    const tableData = [
      ['Trat', 'N', 'Promedio', 'Desv', 'Mín', 'Máx', 'GIE'],
      ...Object.keys(estadisticas).sort().map((trat: string) => {
        const s = estadisticas[trat];
        const promedio = parseFloat(s.promedio) || 0;
        const desviacion = parseFloat(s.desviacion) || 0;
        const minimo = parseFloat(s.minimo) || 0;
        const maximo = parseFloat(s.maximo) || 0;
        const gie = parseFloat(s.gie) || 0;
        return [
          trat,
          String(s.n || 0),
          String(promedio.toFixed(0)),
          String(desviacion.toFixed(1)),
          String(minimo.toFixed(0)),
          String(maximo.toFixed(0)),
          String(gie.toFixed(1)),
        ];
      }),
    ];

    PdfReportGenerator.dibujarTabla(doc, tableData, 500);
  }

  private static generarFotos(doc: any, datos: any): void {
    doc.fontSize(18).font('Helvetica-Bold').text('FOTOS Y ARCHIVOS');
    doc.moveDown(0.8);

    const fotos = datos.fotos || [];
    if (fotos.length === 0) return;

    const tableData = [
      ['Parcela', 'Trat', 'Archivo', 'Tipo', 'Fecha'],
      ...fotos.slice(0, 10).map((f: any) => [
        f.parcela || '',
        String(f.tratamiento || ''),
        (f.nombre || '').substring(0, 25),
        f.tipo || '',
        f.fecha || '',
      ]),
    ];

    PdfReportGenerator.dibujarTabla(doc, tableData, 500, 9);
  }

  private static generarGraficosPNG(doc: any, datos: any): void {
    const estadisticas = datos.estadisticas || {};
    if (Object.keys(estadisticas).length === 0) return;

    const labels = Object.keys(estadisticas).sort();
    let paginasGeneradas = 0;

    // GRÁFICO 1: RENDIMIENTO
    const rendimientos = labels.map(t => parseFloat(String((estadisticas as any)[t].promedio || 0)));
    if (rendimientos.some(v => v > 0)) {
      doc.fontSize(14).font('Helvetica-Bold').fillColor('#000000').text('Rendimiento Promedio por Tratamiento (kg/ha)', doc.page.margins.left, doc.y);
      doc.moveDown(0.8);
      PdfReportGenerator.dibujarGraficoBarras(doc, labels, rendimientos, 5200, 5900, 350, 180);
      doc.moveDown(1);
      paginasGeneradas++;
    }

    // GRÁFICO 2: GIE - NUEVA PÁGINA SOLO SI HAY DATOS
    const gieValues = labels.map(t => parseFloat(String((estadisticas as any)[t].gie || 0)));
    if (gieValues.some(v => v > 0)) {
      if (paginasGeneradas > 0) {
        doc.addPage();
      }
      doc.moveDown(1);
      doc.fontSize(16).font('Helvetica-Bold').fillColor('#000000')
        .text('GIE Promedio por Tratamiento (%)', 50, doc.y);
      doc.moveDown(0.5);

      PdfReportGenerator.dibujarGraficoGIESimple(doc, labels, gieValues);
      paginasGeneradas++;
    }

    // GRÁFICO 3: PLAGAS VS BENÉFICOS - NUEVA PÁGINA SOLO SI HAY DATOS
    const larvas = labels.map(t => parseFloat(String((estadisticas as any)[t].larvas_porurf || 0)));
    const beneficos = labels.map(t => parseFloat(String((estadisticas as any)[t].insectos_beneficios_porurf || 0)));

    if (larvas.some(v => v > 0) || beneficos.some(v => v > 0)) {
      if (paginasGeneradas > 0) {
        doc.addPage();
      }
      doc.moveDown(1);
      doc.fontSize(16).font('Helvetica-Bold').fillColor('#000000')
        .text('Plagas vs Insectos Benéficos (por m²)', 50, doc.y);
      doc.moveDown(0.5);

      console.log(`🐛 GRÁFICO PLAGAS - Labels: ${JSON.stringify(labels)}`);
      console.log(`🐛 GRÁFICO PLAGAS - Larvas: ${JSON.stringify(larvas)}`);
      console.log(`🐛 GRÁFICO PLAGAS - Benéficos: ${JSON.stringify(beneficos)}`);

      PdfReportGenerator.dibujarGraficoPlayasSimple(doc, labels, larvas, beneficos);
      paginasGeneradas++;
    }

    // Si no se generó ningún gráfico, no agregues nada (no dejar página en blanco)
    console.log(`📊 Gráficos generados: ${paginasGeneradas}`);
  }

  /**
   * Dibuja una tabla REAL con bordes
   */
  private static dibujarTabla(doc: any, data: string[][], width: number = 500, fontSize: number = 9): void {
    const cellPadding = 4;
    const colCount = data[0].length;
    const colWidth = width / colCount;
    let y = doc.y;
    const x = doc.page.margins.left;
    const rowHeight = 20;

    // BORDE SUPERIOR
    doc.strokeColor('#000000').lineWidth(1.5).moveTo(x, y).lineTo(x + width, y).stroke();

    // Dibujar tabla
    data.forEach((row, rowIdx) => {
      const isHeader = rowIdx === 0;
      const bgColor = isHeader ? '#e0e0e0' : rowIdx % 2 === 0 ? '#ffffff' : '#f5f5f5';

      // Fondo de fila
      doc.rect(x, y, width, rowHeight).fill(bgColor).stroke();

      // Celdas
      row.forEach((cell, colIdx) => {
        const cellX = x + colIdx * colWidth;
        const cellY = y + cellPadding;

        if (isHeader) {
          doc.fontSize(fontSize).font('Helvetica-Bold').fillColor('#000000');
        } else {
          doc.fontSize(fontSize).font('Helvetica').fillColor('#000000');
        }

        doc.text(String(cell).substring(0, 20), cellX + cellPadding, cellY, {
          width: colWidth - cellPadding * 2,
          align: 'left',
          ellipsis: true,
        });
      });

      // Líneas verticales
      for (let i = 0; i <= colCount; i++) {
        const lineX = x + i * colWidth;
        doc.strokeColor('#000000').moveTo(lineX, y).lineTo(lineX, y + rowHeight).stroke();
      }

      y += rowHeight;
    });

    // Línea final horizontal
    doc.strokeColor('#000000').moveTo(x, y).lineTo(x + width, y).stroke();
    doc.fillColor('#000000');
    doc.y = y + 10;
  }

  /**
   * Gráfico GIE - Simple y funcional
   */
  private static dibujarGraficoGIESimple(
    doc: any,
    labels: string[],
    valores: number[],
  ): void {
    const x = 50;
    const y = doc.y;
    const w = 450;
    const h = 220;
    const minVal = 94;
    const maxVal = 100;
    const range = maxVal - minVal;

    // Marco
    doc.strokeColor('#000000').lineWidth(2).rect(x, y, w, h).stroke();
    doc.fillColor('#ffffff').rect(x, y, w, h).fill();

    // Grillas horizontales
    for (let i = 1; i <= 4; i++) {
      const gy = y + (h / 4) * i;
      doc.strokeColor('#e0e0e0').lineWidth(0.5).moveTo(x, gy).lineTo(x + w, gy).stroke();
      const val = minVal + (range / 4) * i;
      doc.fillColor('#333333').fontSize(8).text(`${val}%`, x - 40, gy - 4, { width: 35, align: 'right' });
    }

    // Etiqueta eje Y
    doc.fillColor('#333333').fontSize(8).text(`${minVal}%`, x - 40, y + h - 4, { width: 35, align: 'right' });

    // Barras
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1'];
    const barWidth = (w / labels.length) * 0.6;
    const spacing = (w / labels.length - barWidth) / 2;

    valores.forEach((valor, idx) => {
      const bh = (valor - minVal) / range * h;
      const bx = x + idx * (w / labels.length) + spacing;
      const by = y + h - bh;

      doc.fillColor(colors[idx % colors.length]).strokeColor('#000000').lineWidth(1.5)
        .rect(bx, by, barWidth, bh).fill().stroke();

      // Valor
      doc.fillColor('#000000').fontSize(10).font('Helvetica-Bold')
        .text(`${valor.toFixed(1)}%`, bx, by - 15, { width: barWidth, align: 'center' });

      // Etiqueta
      doc.fontSize(10).font('Helvetica-Bold')
        .text(labels[idx], bx, y + h + 10, { width: barWidth, align: 'center' });
    });

    doc.moveDown(20);
  }

  /**
   * Gráfico Plagas vs Benéficos - Simple y funcional
   */
  private static dibujarGraficoPlayasSimple(
    doc: any,
    labels: string[],
    larvas: number[],
    beneficos: number[],
  ): void {
    const x = 50;
    const y = doc.y;
    const w = 450;
    const h = 220;

    // Calcular rango dinámicamente
    const allValues = [...larvas, ...beneficos];
    const maxVal = Math.max(...allValues, 1);
    const range = maxVal * 1.2;

    // Marco
    doc.strokeColor('#000000').lineWidth(2).rect(x, y, w, h).stroke();
    doc.fillColor('#ffffff').rect(x, y, w, h).fill();

    // Grillas horizontales
    for (let i = 1; i <= 4; i++) {
      const gy = y + (h / 4) * i;
      doc.strokeColor('#e0e0e0').lineWidth(0.5).moveTo(x, gy).lineTo(x + w, gy).stroke();
      const val = (range / 4) * i;
      doc.fillColor('#333333').fontSize(8).text(`${val.toFixed(1)}`, x - 40, gy - 4, { width: 35, align: 'right' });
    }

    // Barras por grupo
    const barWidth = (w / labels.length) * 0.35;
    const spacing = (w / labels.length) * 0.1;

    labels.forEach((label, idx) => {
      const groupX = x + idx * (w / labels.length);
      const bar1X = groupX + spacing;
      const bar2X = bar1X + barWidth + 5;

      const larva = larvas[idx] || 0;
      const benef = beneficos[idx] || 0;

      // Barra larvas (rojo)
      const h1 = (larva / range) * h;
      const y1 = y + h - h1;
      doc.fillColor('#FF6B6B').strokeColor('#000000').lineWidth(1).rect(bar1X, y1, barWidth, h1).fill().stroke();
      doc.fillColor('#000000').fontSize(8).text(`${larva.toFixed(1)}`, bar1X, y1 - 12, { width: barWidth, align: 'center' });

      // Barra benéficos (verde)
      const h2 = (benef / range) * h;
      const y2 = y + h - h2;
      doc.fillColor('#10B981').strokeColor('#000000').lineWidth(1).rect(bar2X, y2, barWidth, h2).fill().stroke();
      doc.fillColor('#000000').fontSize(8).text(`${benef.toFixed(1)}`, bar2X, y2 - 12, { width: barWidth, align: 'center' });

      // Etiqueta tratamiento
      doc.fontSize(10).font('Helvetica-Bold')
        .text(label, groupX, y + h + 10, { width: w / labels.length, align: 'center' });
    });

    // Leyenda - Pegada debajo del gráfico
    const legendY = y + h + 35;
    doc.fontSize(9).font('Helvetica');
    doc.fillColor('#FF6B6B').rect(x, legendY, 12, 12).fill();
    doc.fillColor('#000000').text('Larvas/m²', x + 20, legendY + 2);

    doc.fillColor('#10B981').rect(x + 150, legendY, 12, 12).fill();
    doc.fillColor('#000000').text('Benéficos/m²', x + 170, legendY);

    // Actualizar posición del documento
    doc.y = legendY + 20;
  }

  /**
   * Dibuja gráfico de barras con COORDENADAS FIJAS para evitar saltos de página
   */
  private static dibujarGraficoBarrasGIE(
    doc: any,
    labels: string[],
    valores: number[],
    minVal: number = 94,
    maxVal: number = 100,
    x: number = 50,
    y: number = 100,
    width: number = 400,
    height: number = 200,
  ): void {
    // ... Este método ya no se usa. Mantener para compatibilidad.
  }
  private static dibujarGraficoBarras(
    doc: any,
    labels: string[],
    valores: number[],
    minVal: number = 0,
    maxVal: number = 100,
    width: number = 300,
    height: number = 120,
  ): void {
    const x = doc.page.margins.left;
    const y = doc.y;

    const range = maxVal - minVal || 1;
    const barWidth = width / labels.length * 0.7;
    const spacing = (width / labels.length - barWidth) / 2;

    doc.strokeColor('#000000').lineWidth(1).rect(x, y, width, height).stroke();

    const gridLines = 4;
    for (let i = 1; i < gridLines; i++) {
      const gridY = y + (height / gridLines) * i;
      doc.strokeColor('#e0e0e0').lineWidth(0.5).moveTo(x, gridY).lineTo(x + width, gridY).stroke();

      const val = minVal + (range / gridLines) * i;
      doc.fillColor('#666666').fontSize(8).text(`${val.toFixed(1)}`, x - 30, gridY - 5, { width: 25, align: 'right' });
    }

    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];
    valores.forEach((valor, idx) => {
      const barHeight = ((valor - minVal) / range) * height;
      const barX = x + idx * (width / labels.length) + spacing;
      const barY = y + height - barHeight;

      const color = colors[idx % colors.length];

      doc.fillColor(color).strokeColor('#000000').rect(barX, barY, barWidth, barHeight).fill().stroke();

      doc.fillColor('#000000').fontSize(7).font('Helvetica-Bold').text(`${valor.toFixed(0)}`, barX, barY - 12, {
        width: barWidth,
        align: 'center',
      });

      doc.fillColor('#000000').fontSize(7).font('Helvetica').text(labels[idx], barX, y + height + 8, {
        width: barWidth,
        align: 'center',
      });
    });

    doc.fillColor('#000000');
    doc.y = y + height + 45;
  }

  /**
        width: barWidth,
        align: 'center',
      });

      doc.fillColor('#000000').fontSize(7).font('Helvetica').text(labels[idx], barX, y + height + 8, {
        width: barWidth,
        align: 'center',
      });
    });

    doc.fillColor('#000000');
    doc.y = y + height + 45;
  }

  /**
   * Dibuja gráfico comparativo con doble barra (redimensionable)
   */
  private static dibujarGraficoComparativo(
    doc: any,
    labels: string[],
    valores1: number[],
    valores2: number[],
    width: number = 300,
    height: number = 120,
  ): void {
    const x = doc.page.margins.left;
    const y = doc.y;

    const allValues = [...valores1, ...valores2];
    const maxVal = Math.max(...allValues) || 1;
    const range = Math.max(maxVal * 1.3, 10);

    const groupWidth = width / labels.length;
    const barWidth = groupWidth * 0.35;
    const spacing = 2;

    doc.strokeColor('#000000').lineWidth(1).rect(x, y, width, height).stroke();

    const gridLines = 4;
    for (let i = 1; i < gridLines; i++) {
      const gridY = y + (height / gridLines) * i;
      doc.strokeColor('#cccccc').moveTo(x, gridY).lineTo(x + width, gridY).dash(1, { space: 2 }).stroke();
      doc.undash();

      const val = (range / gridLines) * i;
      doc.fillColor('#000000').fontSize(7).text(`${val.toFixed(1)}`, x - 25, gridY - 3, { width: 20, align: 'right' });
    }

    valores1.forEach((val1, idx) => {
      const val2 = valores2[idx];
      const groupX = x + idx * groupWidth;
      const bar1X = groupX + (groupWidth - barWidth * 2 - spacing) / 2;
      const bar2X = bar1X + barWidth + spacing;

      const h1 = (val1 / range) * height;
      const y1 = y + height - h1;
      doc.fillColor('#FF6B6B').strokeColor('#000000').lineWidth(1).rect(bar1X, y1, barWidth, h1).fill().stroke();
      if (h1 > 15) {
        doc.fillColor('#000000').fontSize(6).text(`${val1.toFixed(1)}`, bar1X, y1 - 10, { width: barWidth, align: 'center' });
      }

      const h2 = (val2 / range) * height;
      const y2 = y + height - h2;
      doc.fillColor('#10B981').strokeColor('#000000').lineWidth(1).rect(bar2X, y2, barWidth, h2).fill().stroke();
      if (h2 > 15) {
        doc.fillColor('#000000').fontSize(6).text(`${val2.toFixed(1)}`, bar2X, y2 - 10, { width: barWidth, align: 'center' });
      }

      doc.fillColor('#000000').fontSize(7).font('Helvetica').text(labels[idx], groupX, y + height + 8, {
        width: groupWidth,
        align: 'center',
      });
    });

    const legendX = x + width + 15;
    const legendY = y + 10;
    doc.strokeColor('#000000').lineWidth(1).fillColor('#ffffff').rect(legendX, legendY, 95, 45).fill().stroke();

    doc.fillColor('#FF6B6B').rect(legendX + 5, legendY + 5, 10, 10).fill();
    doc.fillColor('#000000').fontSize(7).font('Helvetica').text('Larvas/m²', legendX + 18, legendY + 7);

    doc.fillColor('#10B981').rect(legendX + 5, legendY + 22, 10, 10).fill();
    doc.fillColor('#000000').fontSize(7).font('Helvetica').text('Benéficos/m²', legendX + 18, legendY + 24);

    doc.fillColor('#000000');
    doc.y = y + height + 45;
  }
}

