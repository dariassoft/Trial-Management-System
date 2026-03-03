import PDFKit from 'pdfkit';

/**
 * Servicio para generar reportes en PDF con gráficos y tablas
 */
export class PdfReportGenerator {
  /**
   * Genera reporte completo de ensayo en PDF
   */
  static generarReporteEnsayo(datos: {
    metadatos: any;
    datosCampo: any[];
    datosTrilla: any[];
    estadisticas: any;
    resumen: any;
  }): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      try {
        const chunks: Buffer[] = [];
        const doc: any = new PDFKit();

        doc.on('data', (chunk: Buffer) => {
          chunks.push(chunk);
        });

        doc.on('end', () => {
          resolve(Buffer.concat(chunks));
        });

        doc.on('error', (error: Error) => {
          reject(error);
        });

        // ...existing code...
        PdfReportGenerator.generarPortada(doc, datos);
        doc.addPage();

        PdfReportGenerator.generarResumenEjecutivo(doc, datos);
        doc.addPage();

        PdfReportGenerator.generarMetadata(doc, datos);
        doc.addPage();

        PdfReportGenerator.generarDatosCampo(doc, datos);
        doc.addPage();

        PdfReportGenerator.generarDatosTrilla(doc, datos);
        doc.addPage();

        PdfReportGenerator.generarEstadisticas(doc, datos);
        doc.addPage();

        PdfReportGenerator.generarConclusiones(doc, datos);

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  private static generarPortada(doc: any, datos: any): void {
    const meta = datos.metadatos || {};
    const ensayoId = meta.ensayoId || 'N/A';
    const cultivo = meta.cultivo || 'N/A';
    const provincia = meta.provincia || 'N/A';
    const departamento = meta.departamento || 'N/A';
    const fechaSiembra = meta.fechaSiembra || 'N/A';

    doc
      .fontSize(28)
      .font('Helvetica-Bold')
      .text('REPORTE DE ENSAYO', { align: 'center' });
    doc.moveDown(2);

    const hoy = new Date().toLocaleDateString('es-ES');
    doc
      .fontSize(12)
      .font('Helvetica')
      .text('Fecha: ' + hoy, { align: 'center' });
    doc.moveDown(1);

    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(2);

    doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('INFORMACIÓN GENERAL', { align: 'left' });
    doc.moveDown(1);

    doc.fontSize(11).font('Helvetica');
    doc.text('Ensayo ID: ' + ensayoId, { align: 'left' });
    doc.text('Cultivo: ' + cultivo, { align: 'left' });
    doc.text('Provincia: ' + provincia, { align: 'left' });
    doc.text('Departamento: ' + departamento, { align: 'left' });
    doc.text('Fecha Siembra: ' + fechaSiembra, { align: 'left' });

    doc.moveDown(2);
    doc
      .fontSize(10)
      .fillColor('#666666')
      .text(
        'Este reporte contiene análisis estadístico completo de los datos del ensayo.',
        { align: 'center' },
      );
    doc.fillColor('#000000');
  }

  private static generarResumenEjecutivo(doc: any, datos: any): void {
    const resumen = datos.resumen || {};
    const tratamientoRecomendado = resumen.tratamientoRecomendado || 'N/A';
    const rendimientoMejor = resumen.rendimientoMejor || 'N/A';
    const aumentoRendimiento = resumen.aumentoRendimiento || 'N/A';
    const fitotoxicidadMejor = resumen.fitotoxicidadMejor || 'N/A';
    const observaciones = resumen.observaciones || [];
    const recomendaciones = resumen.recomendaciones || [];

    doc
      .fontSize(18)
      .font('Helvetica-Bold')
      .text('RESUMEN EJECUTIVO', { align: 'left' });
    doc.moveDown(1);

    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1);

    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('Tratamiento Recomendado: ' + tratamientoRecomendado);
    doc
      .fontSize(11)
      .font('Helvetica')
      .text('Rendimiento: ' + rendimientoMejor + ' kg/ha')
      .text('Aumento vs Testigo: ' + aumentoRendimiento + '%')
      .text('Fitotoxicidad Final: ' + fitotoxicidadMejor);

    doc.moveDown(1);
    doc.fontSize(12).font('Helvetica-Bold').text('Observaciones:');
    doc.fontSize(11).font('Helvetica');
    for (const obs of observaciones) {
      doc.text('• ' + obs);
    }

    doc.moveDown(1);
    doc.fontSize(12).font('Helvetica-Bold').text('Recomendaciones:');
    doc.fontSize(11).font('Helvetica');
    for (const rec of recomendaciones) {
      doc.text('• ' + rec);
    }
  }

  private static generarMetadata(doc: any, datos: any): void {
    const meta = datos.metadatos || {};
    const provincia = meta.provincia || 'N/A';
    const departamento = meta.departamento || 'N/A';
    const establecimiento = meta.establecimiento || 'N/A';
    const lote = meta.lote || 'N/A';
    const cultivo = meta.cultivo || 'N/A';
    const tipoSiembra = meta.tipoSiembra || 'N/A';
    const fechaSiembra = meta.fechaSiembra || 'N/A';
    const fechaAplicacion = meta.fechaAplicacion || 'N/A';
    const equipo = meta.equipo || 'N/A';
    const temperatura = meta.temperatura || 'N/A';
    const humedad = meta.humedad || 'N/A';
    const estadio = meta.estadio || 'N/A';

    doc
      .fontSize(18)
      .font('Helvetica-Bold')
      .text('DATOS DEL ENSAYO', { align: 'left' });
    doc.moveDown(1);

    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1);

    doc.fontSize(12).font('Helvetica-Bold').text('Ubicación:');
    doc.fontSize(11).font('Helvetica');
    doc.text('Provincia: ' + provincia);
    doc.text('Departamento: ' + departamento);
    doc.text('Establecimiento: ' + establecimiento);
    doc.text('Lote: ' + lote);

    doc.moveDown(1);
    doc.fontSize(12).font('Helvetica-Bold').text('Cultivo:');
    doc.fontSize(11).font('Helvetica');
    doc.text('Cultivo: ' + cultivo);
    doc.text('Tipo de Siembra: ' + tipoSiembra);
    doc.text('Fecha Siembra: ' + fechaSiembra);
    doc.text('Fecha Aplicación: ' + fechaAplicacion);

    doc.moveDown(1);
    doc.fontSize(12).font('Helvetica-Bold').text('Aplicación:');
    doc.fontSize(11).font('Helvetica');
    doc.text('Equipo: ' + equipo);
    doc.text('Temperatura: ' + temperatura + '°C');
    doc.text('Humedad Relativa: ' + humedad + '%');
    doc.text('Estadío: ' + estadio);
  }

  private static generarDatosCampo(doc: any, datos: any): void {
    doc
      .fontSize(18)
      .font('Helvetica-Bold')
      .text('DATOS DE CAMPO', { align: 'left' });
    doc.moveDown(1);

    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1);

    doc.fontSize(9).font('Helvetica-Bold');
    doc.text('TRAT | BLOQUE | 3DDA FITO | VIGOR | 7DDA FITO | VIGOR | ...');

    doc.fontSize(8).font('Helvetica');
    const datosCampo = datos.datosCampo || [];
    for (const dato of datosCampo.slice(0, 16)) {
      const trat = dato.tratamiento || 'N/A';
      const bloque = dato.bloque || 'N/A';
      const fito3dda = dato['3DDA_FITO'] || 'N/A';
      const vigor3dda = dato['3DDA_VIGOR'] || 'N/A';
      const fito7dda = dato['7DDA_FITO'] || 'N/A';
      const vigor7dda = dato['7DDA_VIGOR'] || 'N/A';
      const row =
        trat +
        ' | ' +
        bloque +
        ' | ' +
        fito3dda +
        ' | ' +
        vigor3dda +
        ' | ' +
        fito7dda +
        ' | ' +
        vigor7dda +
        ' | ...';
      doc.text(row, { width: 500, ellipsis: true });
    }
  }

  private static generarDatosTrilla(doc: any, datos: any): void {
    doc
      .fontSize(18)
      .font('Helvetica-Bold')
      .text('DATOS DE TRILLA', { align: 'left' });
    doc.moveDown(1);

    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1);

    doc.fontSize(9).font('Helvetica-Bold');
    doc.text('TRAT | BLOQUE | H% | PESO (g) | KG/HA | GJE');

    doc.fontSize(8).font('Helvetica');
    const datosTrilla = datos.datosTrilla || [];
    for (const dato of datosTrilla.slice(0, 16)) {
      const trat = dato.tratamiento || 'N/A';
      const bloque = dato.bloque || 'N/A';
      const humedad = dato.humedad || 'N/A';
      const peso = dato.peso || 'N/A';
      const kgha = dato.kgHa || 'N/A';
      const gje = dato.gje || 'N/A';
      const row =
        trat + ' | ' + bloque + ' | ' + humedad + ' | ' + peso + ' | ' + kgha + ' | ' + gje;
      doc.text(row, { width: 500, ellipsis: true });
    }
  }

  private static generarEstadisticas(doc: any, datos: any): void {
    doc
      .fontSize(18)
      .font('Helvetica-Bold')
      .text('ESTADÍSTICAS', { align: 'left' });
    doc.moveDown(1);

    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1);

    doc.fontSize(9).font('Helvetica-Bold');
    doc.text('TRAT | N | Promedio | Desviación | Mín | Máx | CV%');

    doc.fontSize(8).font('Helvetica');
    const estadisticas = datos.estadisticas || {};
    for (const [trat, stats] of Object.entries(estadisticas)) {
      const statsData = stats as any;
      const n = statsData.n || 0;
      const promedio = statsData.promedio
        ? statsData.promedio.toFixed(2)
        : 'N/A';
      const desviacion = statsData.desviacion
        ? statsData.desviacion.toFixed(2)
        : 'N/A';
      const minimo = statsData.minimo ? statsData.minimo.toFixed(2) : 'N/A';
      const maximo = statsData.maximo ? statsData.maximo.toFixed(2) : 'N/A';
      const coefVar = statsData.coefVariacion
        ? statsData.coefVariacion.toFixed(2)
        : 'N/A';
      const row =
        trat +
        ' | ' +
        n +
        ' | ' +
        promedio +
        ' | ' +
        desviacion +
        ' | ' +
        minimo +
        ' | ' +
        maximo +
        ' | ' +
        coefVar;
      doc.text(row, { width: 500, ellipsis: true });
    }
  }

  private static generarConclusiones(doc: any, datos: any): void {
    const resumen = datos.resumen || {};
    const observaciones = resumen.observaciones || [];
    const recomendaciones = resumen.recomendaciones || [];

    doc
      .fontSize(18)
      .font('Helvetica-Bold')
      .text('CONCLUSIONES Y RECOMENDACIONES', { align: 'left' });
    doc.moveDown(1);

    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1);

    doc.fontSize(12).font('Helvetica-Bold').text('Conclusiones:');
    doc.fontSize(11).font('Helvetica');
    for (const obs of observaciones) {
      doc.text('• ' + obs);
    }

    doc.moveDown(1);
    doc.fontSize(12).font('Helvetica-Bold').text('Recomendaciones:');
    doc.fontSize(11).font('Helvetica');
    for (const rec of recomendaciones) {
      doc.text('• ' + rec);
    }

    doc.moveDown(2);
    doc
      .fontSize(10)
      .fillColor('#999999')
      .text(
        'Este documento fue generado automáticamente por el Sistema de Gestión de Ensayos.',
        { align: 'center' },
      );
    doc.fillColor('#000000');
  }
}
