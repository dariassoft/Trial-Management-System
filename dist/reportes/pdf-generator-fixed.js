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
                doc.addPage();
                // Página 6: Tabla "Detalle de Evaluaciones" - HORIZONTAL
                doc.addPage({ size: 'A4', layout: 'landscape', margin: 30 });
                PdfReportGenerator.generarTablaEvaluacionesDetalle(doc, datos);
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
    // ...MÉTODOS EXISTENTES SIN CAMBIOS...
    static generarGraficosPNG(doc, datos) {
        const estadisticas = datos.estadisticas || {};
        if (Object.keys(estadisticas).length === 0)
            return;
        const labels = Object.keys(estadisticas).sort();
        // GRÁFICO 1: RENDIMIENTO
        doc.fontSize(14).font('Helvetica-Bold').fillColor('#000000').text('Rendimiento Promedio por Tratamiento (kg/ha)', doc.page.margins.left, doc.y);
        doc.moveDown(0.8);
        const rendimientos = labels.map(t => parseFloat(estadisticas[t].promedio || 0));
        PdfReportGenerator.dibujarGraficoBarras(doc, labels, rendimientos, 5200, 5900, 350, 180);
        doc.moveDown(1);
        // GRÁFICO 2: GIE - NUEVA PÁGINA LIMPIA
        doc.addPage();
        doc.moveDown(1);
        doc.fontSize(14).font('Helvetica-Bold').fillColor('#000000').text('GIE Promedio por Tratamiento (%)', doc.page.margins.left, doc.y);
        doc.moveDown(1);
        const gieValues = labels.map(t => parseFloat(estadisticas[t].gie || 0));
        PdfReportGenerator.dibujarGraficoBarras(doc, labels, gieValues, 94, 100, 350, 200);
        doc.moveDown(2);
        // GRÁFICO 3: PLAGAS VS BENÉFICOS - NUEVA PÁGINA LIMPIA
        doc.addPage();
        doc.moveDown(1);
        doc.fontSize(14).font('Helvetica-Bold').fillColor('#000000').text('Plagas vs Insectos Benéficos (por m²)', doc.page.margins.left, doc.y);
        doc.moveDown(1);
        const larvas = labels.map(t => {
            const val = parseFloat(estadisticas[t].larvas_porurf || 0);
            console.log(`DEBUG Plagas: ${t} = Larvas: ${val}`);
            return val;
        });
        const beneficos = labels.map(t => {
            const val = parseFloat(estadisticas[t].insectos_beneficios_porurf || 0);
            console.log(`DEBUG Plagas: ${t} = Benéficos: ${val}`);
            return val;
        });
        console.log(`DEBUG - Larvas array: ${JSON.stringify(larvas)}`);
        console.log(`DEBUG - Benéficos array: ${JSON.stringify(beneficos)}`);
        PdfReportGenerator.dibujarGraficoComparativo(doc, labels, larvas, beneficos, 350, 200);
        doc.moveDown(2);
    }
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
            doc.strokeColor('#cccccc').moveTo(x, gridY).lineTo(x + width, gridY).dash(1, { space: 2 }).stroke();
            doc.undash();
            const val = minVal + (range / gridLines) * i;
            doc.fillColor('#000000').fontSize(7).text(`${val.toFixed(0)}`, x - 25, gridY - 3, { width: 20, align: 'right' });
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
            doc.fillColor('#FF6B6B').strokeColor('#000000').lineWidth(1.5).rect(bar1X, y1, barWidth, h1).fill().stroke();
            doc.fillColor('#000000').fontSize(8).font('Helvetica-Bold').text(`${val1.toFixed(1)}`, bar1X, y1 - 14, { width: barWidth, align: 'center' });
            const h2 = (val2 / range) * height;
            const y2 = y + height - h2;
            doc.fillColor('#10B981').strokeColor('#000000').lineWidth(1.5).rect(bar2X, y2, barWidth, h2).fill().stroke();
            doc.fillColor('#000000').fontSize(8).font('Helvetica-Bold').text(`${val2.toFixed(1)}`, bar2X, y2 - 14, { width: barWidth, align: 'center' });
            doc.fillColor('#000000').fontSize(8).font('Helvetica-Bold').text(labels[idx], groupX, y + height + 12, {
                width: groupWidth,
                align: 'center',
            });
        });
        const legendX = x + width + 20;
        const legendY = y + 20;
        doc.strokeColor('#000000').lineWidth(2).fillColor('#ffffff').rect(legendX, legendY, 110, 60).fill().stroke();
        doc.fillColor('#FF6B6B').rect(legendX + 8, legendY + 10, 15, 15).fill();
        doc.strokeColor('#000000').lineWidth(1).rect(legendX + 8, legendY + 10, 15, 15).stroke();
        doc.fillColor('#000000').fontSize(9).font('Helvetica-Bold').text('Larvas/m²', legendX + 30, legendY + 13);
        doc.fillColor('#10B981').rect(legendX + 8, legendY + 35, 15, 15).fill();
        doc.strokeColor('#000000').lineWidth(1).rect(legendX + 8, legendY + 35, 15, 15).stroke();
        doc.fillColor('#000000').fontSize(9).font('Helvetica-Bold').text('Benéficos/m²', legendX + 30, legendY + 38);
        doc.fillColor('#000000');
        doc.y = y + height + 45;
    }
}
exports.PdfReportGenerator = PdfReportGenerator;
