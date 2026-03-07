"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfReportGenerator = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
class PdfReportGenerator {
    static generarReporteEnsayo(datos) {
        return new Promise((resolve, reject) => {
            try {
                const chunks = [];
                const doc = new pdfkit_1.default({ size: 'A4', margin: 40 });
                doc.on('data', (chunk) => chunks.push(chunk));
                doc.on('end', () => resolve(Buffer.concat(chunks)));
                doc.on('error', (error) => reject(error));
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
                PdfReportGenerator.generarEstadisticas(doc, datos);
                doc.addPage();
                // Página 10: Fotos (si existen)
                if (datos.fotos && datos.fotos.length > 0) {
                    PdfReportGenerator.generarFotos(doc, datos);
                    doc.addPage();
                }
                // Páginas 11+: Gráficos
                PdfReportGenerator.generarGraficosPNG(doc, datos);
                doc.end();
            }
            catch (error) {
                reject(error);
            }
        });
    }
    static generarPortada(doc, datos) {
        const meta = datos.metadatos || {};
        doc.fontSize(32).font('Helvetica-Bold').text('REPORTE DE ENSAYO', { align: 'center' });
        doc.moveDown(2);
        doc.fontSize(18).font('Helvetica').text(`Ensayo ${meta.ensayoId || ''}`, { align: 'center' });
        doc.fontSize(14).text(`${meta.nombreEnsayo || ''}`, { align: 'center' });
        doc.moveDown(3);
        doc.fontSize(12).font('Helvetica-Bold').text('Información del Ensayo:', { align: 'left' });
        doc.fontSize(11).font('Helvetica');
        doc.text(`Cultivo: ${meta.cultivo || ''}`);
        doc.text(`Provincia: ${meta.provincia || ''}`);
        doc.text(`Departamento: ${meta.departamento || ''}`);
        doc.text(`Establecimiento: ${meta.establecimiento || ''}`);
        doc.moveDown(2);
        doc.fontSize(10).text(`Generado: ${new Date().toLocaleDateString('es-ES')}`);
    }
    static generarResumen(doc, datos) {
        doc.fontSize(20).font('Helvetica-Bold').text('RESUMEN EJECUTIVO');
        doc.moveDown(1);
        const meta = datos.metadatos || {};
        const stats = datos.estadisticas || {};
        doc.fontSize(11).font('Helvetica');
        doc.text(`Cultivo: ${meta.cultivo}`);
        doc.text(`Tipo de Siembra: ${meta.tipoSiembra}`);
        doc.text(`Fecha Siembra: ${meta.fechaSiembra}`);
        doc.text(`Fecha Cosecha: ${meta.fechaCosecha}`);
        doc.moveDown(1);
        doc.fontSize(10).font('Helvetica-Bold').text('Estadísticas Generales:');
        Object.keys(stats).forEach((trat) => {
            const s = stats[trat];
            doc.fontSize(9).font('Helvetica').text(`${trat}: Rendimiento promedio ${s.promedio || 0} kg/ha`);
        });
    }
    static generarDatosEnsayo(doc, datos) {
        doc.fontSize(18).font('Helvetica-Bold').text('DATOS DEL ENSAYO');
        doc.moveDown(0.8);
        const meta = datos.metadatos || {};
        // Tabla de datos del ensayo
        const tableData = [
            ['Campo', 'Valor'],
            ['Cultivo', meta.cultivo || ''],
            ['Tipo de Siembra', meta.tipoSiembra || ''],
            ['Provincia', meta.provincia || ''],
            ['Departamento', meta.departamento || ''],
            ['Establecimiento', meta.establecimiento || ''],
            ['Lote', meta.lote || ''],
            ['Fecha Siembra', meta.fechaSiembra || ''],
            ['Fecha Cosecha', meta.fechaCosecha || ''],
        ];
        PdfReportGenerator.dibujarTabla(doc, tableData, 450);
        doc.moveDown(1);
        doc.fontSize(14).font('Helvetica-Bold').fillColor('#000000').text('Aplicación', doc.page.margins.left, doc.y);
        doc.moveDown(0.5);
        const appData = [
            ['Parámetro', 'Valor'],
            ['Equipo', meta.equipo || ''],
            ['Temperatura', meta.temperatura || ''],
            ['Humedad Relativa', meta.humedad || ''],
            ['Estadío', meta.estadio || ''],
            ['Fecha Aplicación', meta.fechaAplicacion || ''],
        ];
        PdfReportGenerator.dibujarTabla(doc, appData, 450);
    }
    static generarProtocoloYCondiciones(doc, datos) {
        doc.fontSize(18).font('Helvetica-Bold').fillColor('#000000').text('PROTOCOLO, CONDICIONES Y DISTRIBUCIÓN');
        doc.moveDown(0.8);
        const meta = datos.metadatos || {};
        const protocolo = datos.protocolo || {};
        // PROTOCOLO - Traer de DB
        doc.fontSize(12).font('Helvetica-Bold').fillColor('#000000').text('Protocolo');
        doc.moveDown(0.3);
        doc.fontSize(10).font('Helvetica').fillColor('#000000').text(protocolo.descripcion || 'Sin descripción de protocolo');
        doc.moveDown(0.8);
        // CONDICIONES DE APLICACION - Traer de DB
        const condicionesData = [
            ['Parámetro', 'Valor'],
            ['Temperatura', (meta.temperatura || 'N/A') + '°C'],
            ['Humedad Relativa', (meta.humedad || 'N/A') + '%'],
            ['Viento', (meta.velocidadViento || 'N/A') + ' km/h'],
            ['Presión', (meta.presion || 'N/A') + ' bar'],
            ['Equipo', meta.equipo || 'N/A'],
        ];
        doc.fontSize(12).font('Helvetica-Bold').fillColor('#000000').text('Condiciones de Aplicación', doc.page.margins.left, doc.y);
        doc.moveDown(0.4);
        PdfReportGenerator.dibujarTabla(doc, condicionesData, 500, 9);
        doc.moveDown(0.5);
        // DISTRIBUCION - Alineado a la izquierda - Traer de DB
        doc.fontSize(12).font('Helvetica-Bold').fillColor('#000000').text('Distribución de Tratamientos', doc.page.margins.left, doc.y);
        doc.moveDown(0.3);
        const diseno = datos.diseno || {};
        doc.fontSize(10).font('Helvetica').fillColor('#000000').text('Diseño: ' + (diseno.nombre || 'Bloques Completos al Azar (BCA)'), doc.page.margins.left);
        doc.fontSize(10).font('Helvetica').fillColor('#000000').text('Repeticiones: ' + (diseno.repeticiones || '5') + ' bloques', doc.page.margins.left);
        doc.fontSize(10).font('Helvetica').fillColor('#000000').text('Tratamientos: ' + (diseno.tratamientos || '3'), doc.page.margins.left);
    }
    static generarEvaluacionesFechas(doc, datos) {
        doc.fontSize(14).font('Helvetica-Bold').fillColor('#000000').text('EVALUACIONES EN CAMPO');
        doc.moveDown(0.6);
        doc.fontSize(10).font('Helvetica').fillColor('#000000').text('Fechas de evaluación desde siembra (DDS):');
        doc.moveDown(0.3);
        // TRAER DESDE DB, NO HARDCODE
        const evaluacionesFechas = datos.evaluacionesFechas || [];
        if (evaluacionesFechas.length === 0) {
            doc.fontSize(10).text('Sin evaluaciones programadas');
            return;
        }
        const headerFechas = [['DDS', 'Fecha', 'Variables']];
        const fechasData = [...headerFechas, ...evaluacionesFechas];
        PdfReportGenerator.dibujarTabla(doc, fechasData, 500, 9);
    }
    static generarTablaEvaluacionesDetalle(doc, datos) {
        doc.fontSize(14).font('Helvetica-Bold').fillColor('#000000').text('DETALLE DE EVALUACIONES POR TRATAMIENTO Y BLOQUE');
        doc.moveDown(0.6);
        // TRAER DESDE DB, NO HARDCODE
        const evaluaciones = datos.evaluacionesDetalle || [];
        if (evaluaciones.length === 0) {
            doc.fontSize(10).text('Sin evaluaciones registradas');
            return;
        }
        // Construir tabla dinámicamente desde datos
        const headerRow = ['T', 'B', 'V12', 'F12', 'S12', 'V21', 'F21', 'S21', 'V28', 'F28', 'V35', 'F35', 'V57', 'F57', 'V76', 'F76', 'NVI'];
        const datosEvaluacion = [headerRow, ...evaluaciones];
        PdfReportGenerator.dibujarTabla(doc, datosEvaluacion, 760, 5);
    }
    static generarTablaDatosCampo(doc, datos) {
        doc.fontSize(18).font('Helvetica-Bold').text('DATOS DE CAMPO');
        doc.moveDown(0.8);
        const datosCampo = datos.datosCampo || [];
        if (datosCampo.length === 0) {
            doc.fontSize(10).text('Sin datos de campo registrados');
            return;
        }
        const tableData = [
            ['Parcela', 'Trat', 'Bloque', 'Momento', 'Variable', 'Valor'],
            ...datosCampo.slice(0, 15).map((dc) => [
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
    static generarTablaDatosTrilla(doc, datos) {
        doc.fontSize(18).font('Helvetica-Bold').text('DATOS DE COSECHA (TRILLA)');
        doc.moveDown(0.8);
        const datosTrilla = datos.datosTrilla || [];
        if (datosTrilla.length === 0) {
            doc.fontSize(10).text('Sin datos de trilla registrados');
            return;
        }
        const tableData = [
            ['Parc', 'Trat', 'Bloque', 'H%', 'kg/ha', 'GIE', 'Larvas', 'Benef', 'Altura', 'Dens'],
            ...datosTrilla.slice(0, 12).map((dt) => [
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
    static generarEstadisticas(doc, datos) {
        doc.fontSize(18).font('Helvetica-Bold').text('ESTADÍSTICAS POR TRATAMIENTO');
        doc.moveDown(0.8);
        const estadisticas = datos.estadisticas || {};
        if (Object.keys(estadisticas).length === 0) {
            doc.fontSize(10).text('Sin estadísticas disponibles');
            return;
        }
        const tableData = [
            ['Trat', 'N', 'Promedio', 'Desv', 'Mín', 'Máx', 'GIE'],
            ...Object.keys(estadisticas).sort().map((trat) => {
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
    static generarFotos(doc, datos) {
        doc.fontSize(18).font('Helvetica-Bold').text('FOTOS Y ARCHIVOS');
        doc.moveDown(0.8);
        const fotos = datos.fotos || [];
        if (fotos.length === 0)
            return;
        const tableData = [
            ['Parcela', 'Trat', 'Archivo', 'Tipo', 'Fecha'],
            ...fotos.slice(0, 10).map((f) => [
                f.parcela || '',
                String(f.tratamiento || ''),
                (f.nombre || '').substring(0, 25),
                f.tipo || '',
                f.fecha || '',
            ]),
        ];
        PdfReportGenerator.dibujarTabla(doc, tableData, 500, 9);
    }
    static generarGraficosPNG(doc, datos) {
        const estadisticas = datos.estadisticas || {};
        if (Object.keys(estadisticas).length === 0)
            return;
        const labels = Object.keys(estadisticas).sort();
        // GRÁFICO 1: RENDIMIENTO
        doc.fontSize(14).font('Helvetica-Bold').fillColor('#000000').text('Rendimiento Promedio por Tratamiento (kg/ha)', doc.page.margins.left, doc.y);
        doc.moveDown(0.8);
        const rendimientos = labels.map(t => parseFloat(String(estadisticas[t].promedio || 0)));
        PdfReportGenerator.dibujarGraficoBarras(doc, labels, rendimientos, 5200, 5900, 350, 180);
        doc.moveDown(1);
        // GRÁFICO 2: GIE - NUEVA PÁGINA CON COORDENADAS FIJAS
        doc.addPage();
        doc.moveDown(1);
        doc.fontSize(16).font('Helvetica-Bold').fillColor('#000000')
            .text('GIE Promedio por Tratamiento (%)', 50, doc.y);
        doc.moveDown(0.5);
        const gieValues = labels.map(t => parseFloat(String(estadisticas[t].gie || 0)));
        PdfReportGenerator.dibujarGraficoGIESimple(doc, labels, gieValues);
        // GRÁFICO 3: PLAGAS VS BENÉFICOS - NUEVA PÁGINA CON COORDENADAS FIJAS
        doc.addPage();
        doc.moveDown(1);
        doc.fontSize(16).font('Helvetica-Bold').fillColor('#000000')
            .text('Plagas vs Insectos Benéficos (por m²)', 50, doc.y);
        doc.moveDown(0.5);
        const larvas = labels.map(t => parseFloat(String(estadisticas[t].larvas_porurf || 0)));
        const beneficos = labels.map(t => parseFloat(String(estadisticas[t].insectos_beneficios_porurf || 0)));
        console.log(`🐛 GRÁFICO PLAGAS - Labels: ${JSON.stringify(labels)}`);
        console.log(`🐛 GRÁFICO PLAGAS - Larvas: ${JSON.stringify(larvas)}`);
        console.log(`🐛 GRÁFICO PLAGAS - Benéficos: ${JSON.stringify(beneficos)}`);
        PdfReportGenerator.dibujarGraficoPlayasSimple(doc, labels, larvas, beneficos);
    }
    /**
     * Dibuja una tabla REAL con bordes
     */
    static dibujarTabla(doc, data, width = 500, fontSize = 9) {
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
                }
                else {
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
    static dibujarGraficoGIESimple(doc, labels, valores) {
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
    static dibujarGraficoPlayasSimple(doc, labels, larvas, beneficos) {
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
        // Leyenda
        doc.moveDown(20);
        doc.fontSize(9).font('Helvetica');
        doc.fillColor('#FF6B6B').rect(x, doc.y, 12, 12).fill();
        doc.fillColor('#000000').text('Larvas/m²', x + 20, doc.y + 2);
        doc.fillColor('#10B981').rect(x + 150, doc.y - 12, 12, 12).fill();
        doc.fillColor('#000000').text('Benéficos/m²', x + 170, doc.y - 10);
    }
    /**
     * Dibuja gráfico de barras con COORDENADAS FIJAS para evitar saltos de página
     */
    static dibujarGraficoBarrasGIE(doc, labels, valores, minVal = 94, maxVal = 100, x = 50, y = 100, width = 400, height = 200) {
        // ... Este método ya no se usa. Mantener para compatibilidad.
    }
    static dibujarGraficoBarras(doc, labels, valores, minVal = 0, maxVal = 100, width = 300, height = 120) {
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
    static dibujarGraficoComparativo(doc, labels, valores1, valores2, width = 300, height = 120) {
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
exports.PdfReportGenerator = PdfReportGenerator;
