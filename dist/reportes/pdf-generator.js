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
                }
                else {
                    // Si no hay datos para gráficos, agregar página con info útil
                    doc.fontSize(14).font('Helvetica-Bold').text('INFORMACIÓN ADICIONAL');
                    doc.moveDown(1);
                    doc.fontSize(11).font('Helvetica').text('No hay datos de cosecha suficientes para generar gráficos de rendimiento.', doc.page.margins.left);
                    doc.moveDown(0.5);
                    doc.text('Para generar gráficos de análisis, se requiere registrar datos de cosecha (Datos de Trilla) para cada parcela del ensayo.');
                }
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
            ['Temperatura', meta.temperatura ? `${meta.temperatura}°C` : ''],
            ['Humedad Relativa', meta.humedad ? `${meta.humedad}%` : ''],
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
        // CONDICIONES DE APLICACION - Extraer valores primero
        const temperatura = meta.temperatura;
        const humedad = meta.humedad;
        const velocidadViento = meta.velocidadViento || meta.viento;
        const presion = meta.presion;
        const equipo = meta.equipo;
        const condicionesData = [
            ['Parámetro', 'Valor'],
            ['Temperatura', (temperatura && temperatura !== '' ? `${temperatura}°C` : 'No registrado')],
            ['Humedad Relativa', (humedad && humedad !== '' ? `${humedad}%` : 'No registrado')],
            ['Velocidad Viento', (velocidadViento && velocidadViento !== '' ? `${velocidadViento} km/h` : 'No registrado')],
            ['Presión', (presion && presion !== '' ? `${presion} bar` : 'No registrado')],
            ['Equipo', (equipo && equipo !== '' ? equipo : 'No registrado')],
        ];
        doc.fontSize(12).font('Helvetica-Bold').fillColor('#000000').text('Condiciones de Aplicación', doc.page.margins.left, doc.y);
        doc.moveDown(0.4);
        PdfReportGenerator.dibujarTabla(doc, condicionesData, 500, 9);
        doc.moveDown(0.5);
        // DISTRIBUCION - Todos desde BD - Dinamico
        doc.fontSize(12).font('Helvetica-Bold').fillColor('#000000').text('Distribución de Tratamientos', doc.page.margins.left, doc.y);
        doc.moveDown(0.3);
        const diseno = datos.diseno || {};
        doc.fontSize(10).font('Helvetica').fillColor('#000000').text('Diseño: ' + (diseno.nombre || 'No especificado'), doc.page.margins.left);
        doc.fontSize(10).font('Helvetica').fillColor('#000000').text('Repeticiones: ' + (diseno.repeticiones || '0') + ' bloques', doc.page.margins.left);
        doc.fontSize(10).font('Helvetica').fillColor('#000000').text('Tratamientos: ' + (diseno.tratamientos || '0'), doc.page.margins.left);
    }
    static generarEvaluacionesFechas(doc, datos) {
        doc.fontSize(14).font('Helvetica-Bold').fillColor('#000000').text('EVALUACIONES EN CAMPO');
        doc.moveDown(0.6);
        doc.fontSize(11).font('Helvetica-Bold').fillColor('#000000').text('Momentos de evaluación:');
        doc.fontSize(9).font('Helvetica').fillColor('#333333').text('DDS (Días Después de Siembra) = Días transcurridos desde la siembra. Indica cuándo se realizó cada evaluación.');
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
    static generarTablaEvaluacionesDetalle(doc, datos) {
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
        let paginasGeneradas = 0;
        // GRÁFICO 1: RENDIMIENTO
        const rendimientos = labels.map(t => parseFloat(String(estadisticas[t].promedio || 0)));
        if (rendimientos.some(v => v > 0)) {
            const maxRendimiento = Math.max(...rendimientos);
            const minRendimiento = Math.min(...rendimientos);
            const rangoRendimiento = maxRendimiento - minRendimiento;
            const margen = rangoRendimiento * 0.1 || 100;
            const minVal = Math.max(0, minRendimiento - margen);
            const maxVal = maxRendimiento + margen;
            if (doc.y > 550)
                doc.addPage();
            doc.fontSize(14).font('Helvetica-Bold').fillColor('#000000').text('Rendimiento Promedio por Tratamiento (kg/ha)', doc.page.margins.left, doc.y);
            doc.moveDown(0.8);
            PdfReportGenerator.dibujarGraficoBarras(doc, labels, rendimientos, minVal, maxVal, 450, 200);
            doc.moveDown(1);
            paginasGeneradas++;
        }
        // GRÁFICO 2: GIE
        const gieValues = labels.map(t => parseFloat(String(estadisticas[t].gie || 0)));
        if (gieValues.some(v => !isNaN(v))) {
            doc.addPage();
            const maxGie = Math.max(...gieValues);
            const minGie = Math.min(...gieValues);
            const rangoGie = maxGie - minGie;
            const margen = rangoGie * 0.1 || 5;
            const minVal = minGie - margen;
            const maxVal = maxGie + margen;
            doc.fontSize(14).font('Helvetica-Bold').fillColor('#000000').text('GIE Promedio por Tratamiento (%)', doc.page.margins.left, doc.y);
            doc.moveDown(0.8);
            PdfReportGenerator.dibujarGraficoBarras(doc, labels, gieValues, minVal, maxVal, 450, 200);
            doc.moveDown(1);
            paginasGeneradas++;
        }
        // GRÁFICO 3: PLAGAS VS BENÉFICOS
        const larvas = labels.map(t => parseFloat(String(estadisticas[t].larvas_porurf || 0)));
        const beneficos = labels.map(t => parseFloat(String(estadisticas[t].insectos_beneficios_porurf || 0)));
        if (larvas.some(v => v > 0) || beneficos.some(v => v > 0)) {
            doc.addPage();
            doc.fontSize(16).font('Helvetica-Bold').fillColor('#000000').text('Plagas vs Insectos Benéficos (por m²)', 50, 80);
            doc.moveDown(0.5);
            PdfReportGenerator.dibujarGraficoPlayasSimple(doc, labels, larvas, beneficos);
            paginasGeneradas++;
        }
        console.log(`📊 Gráficos generados: ${paginasGeneradas}`);
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
     * Gráfico GIE - Simple y funcional con rango dinámico
     */
    static dibujarGraficoGIESimple(doc, labels, valores) {
        const x = 50;
        const y = 120; // Posición fija para evitar saltos
        const w = 450;
        const h = 240;
        // Calcular rango dinámico basado en los valores reales
        const maxGie = Math.max(...valores);
        const minGie = Math.min(...valores);
        const rangoGie = maxGie - minGie;
        // Si el rango es muy pequeño (valores muy similares), usar rango fijo
        let minVal;
        let maxVal;
        if (rangoGie < 2) {
            // Valores muy similares, centrar en el promedio
            const promedio = valores.reduce((a, b) => a + b, 0) / valores.length;
            minVal = Math.max(0, promedio - 3);
            maxVal = Math.min(100, promedio + 3);
        }
        else {
            // Rango normal, agregar 5% de margen
            const margen = rangoGie * 0.1;
            minVal = Math.max(0, minGie - margen);
            maxVal = Math.min(100, maxGie + margen);
        }
        const range = maxVal - minVal;
        // Marco
        doc.strokeColor('#000000').lineWidth(2).rect(x, y, w, h).stroke();
        doc.fillColor('#ffffff').rect(x, y, w, h).fill();
        // Grillas horizontales
        for (let i = 1; i <= 4; i++) {
            const gy = y + (h / 4) * i;
            doc.strokeColor('#e0e0e0').lineWidth(0.5).moveTo(x, gy).lineTo(x + w, gy).stroke();
            const val = minVal + (range / 4) * i;
            doc.fillColor('#333333').fontSize(8).text(`${val.toFixed(1)}%`, x - 40, gy - 4, { width: 35, align: 'right' });
        }
        // Etiqueta eje Y (valor mínimo)
        doc.fillColor('#333333').fontSize(8).text(`${minVal.toFixed(1)}%`, x - 40, y + h - 4, { width: 35, align: 'right' });
        // Barras
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
        const barWidth = Math.min((w / labels.length) * 0.6, 80); // Limitar ancho máximo
        const spacing = (w / labels.length - barWidth) / 2;
        valores.forEach((valor, idx) => {
            const bh = ((valor - minVal) / range) * h;
            const bx = x + idx * (w / labels.length) + spacing;
            const by = y + h - bh;
            doc.fillColor(colors[idx % colors.length]).strokeColor('#000000').lineWidth(1.5)
                .rect(bx, by, barWidth, bh).fill().stroke();
            // Valor encima de la barra
            doc.fillColor('#000000').fontSize(10).font('Helvetica-Bold')
                .text(`${valor.toFixed(1)}%`, bx, by - 15, { width: barWidth, align: 'center' });
            // Etiqueta debajo del gráfico
            doc.fontSize(10).font('Helvetica-Bold')
                .text(labels[idx], bx, y + h + 10, { width: barWidth, align: 'center' });
        });
        // Actualizar posición del cursor
        doc.y = y + h + 50;
    }
    /**
     * Gráfico Plagas vs Benéficos - Simple y funcional con posición fija
     */
    static dibujarGraficoPlayasSimple(doc, labels, larvas, beneficos) {
        const x = 50;
        const y = 120; // Posición fija para evitar saltos
        const w = 450;
        const h = 240;
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
        const groupWidth = w / labels.length;
        const barWidth = Math.min(groupWidth * 0.35, 40); // Limitar ancho máximo
        const spacing = 5;
        labels.forEach((label, idx) => {
            const groupX = x + idx * groupWidth + (groupWidth - barWidth * 2 - spacing) / 2;
            const bar1X = groupX;
            const bar2X = bar1X + barWidth + spacing;
            const larva = larvas[idx] || 0;
            const benef = beneficos[idx] || 0;
            // Barra larvas (rojo)
            const h1 = (larva / range) * h;
            const y1 = y + h - h1;
            doc.fillColor('#FF6B6B').strokeColor('#000000').lineWidth(1).rect(bar1X, y1, barWidth, h1).fill().stroke();
            if (h1 > 15) {
                doc.fillColor('#000000').fontSize(8).text(`${larva.toFixed(1)}`, bar1X, y1 - 12, { width: barWidth, align: 'center' });
            }
            // Barra benéficos (verde)
            const h2 = (benef / range) * h;
            const y2 = y + h - h2;
            doc.fillColor('#10B981').strokeColor('#000000').lineWidth(1).rect(bar2X, y2, barWidth, h2).fill().stroke();
            if (h2 > 15) {
                doc.fillColor('#000000').fontSize(8).text(`${benef.toFixed(1)}`, bar2X, y2 - 12, { width: barWidth, align: 'center' });
            }
            // Etiqueta tratamiento
            doc.fontSize(9).font('Helvetica-Bold').fillColor('#000000')
                .text(label, groupX, y + h + 10, { width: barWidth * 2 + spacing, align: 'center' });
        });
        // Leyenda - Pegada debajo del gráfico
        const legendY = y + h + 35;
        doc.fontSize(9).font('Helvetica');
        doc.fillColor('#FF6B6B').rect(x, legendY, 12, 12).fill();
        doc.fillColor('#000000').text('Larvas/m²', x + 20, legendY + 2);
        doc.fillColor('#10B981').rect(x + 150, legendY, 12, 12).fill();
        doc.fillColor('#000000').text('Benéficos/m²', x + 170, legendY + 2);
        // Actualizar posición del documento
        doc.y = legendY + 30;
    }
    static dibujarGraficoBarras(doc, labels, valores, minVal = 0, maxVal = 100, width = 450, height = 200) {
        const x = doc.page.margins.left;
        const y = doc.y;
        // Asegurar que hay espacio suficiente en la página
        if (y + height + 60 > doc.page.height - doc.page.margins.bottom) {
            doc.addPage();
            doc.y = doc.page.margins.top;
        }
        const range = maxVal - minVal || 1;
        const barWidth = Math.min((width / labels.length) * 0.6, 70); // Limitar ancho máximo a 70px
        const spacing = (width / labels.length - barWidth) / 2;
        // Marco del gráfico
        doc.strokeColor('#000000').lineWidth(1.5).rect(x, y, width, height).stroke();
        // Fondo blanco
        doc.fillColor('#ffffff').rect(x + 1, y + 1, width - 2, height - 2).fill();
        // Grillas horizontales con etiquetas
        const gridLines = 5;
        for (let i = 0; i <= gridLines; i++) {
            const gridY = y + (height / gridLines) * i;
            // Línea de grilla
            if (i > 0 && i < gridLines) {
                doc.strokeColor('#e0e0e0').lineWidth(0.5).moveTo(x, gridY).lineTo(x + width, gridY).stroke();
            }
            // Etiqueta del valor
            const val = maxVal - (range / gridLines) * i;
            doc.fillColor('#666666').fontSize(8).text(`${val.toFixed(0)}`, x - 40, gridY - 5, { width: 35, align: 'right' });
        }
        // Dibujar barras
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA15E'];
        valores.forEach((valor, idx) => {
            // Asegurar que el valor está dentro del rango
            const valorAjustado = Math.max(minVal, Math.min(maxVal, valor));
            const barHeight = ((valorAjustado - minVal) / range) * height;
            const barX = x + idx * (width / labels.length) + spacing;
            const barY = y + height - barHeight;
            const color = colors[idx % colors.length];
            // Dibujar barra
            doc.fillColor(color).strokeColor('#000000').lineWidth(1)
                .rect(barX, barY, barWidth, barHeight).fill().stroke();
            // Valor encima de la barra
            doc.fillColor('#000000').fontSize(9).font('Helvetica-Bold')
                .text(`${valor.toFixed(0)}`, barX, barY - 15, {
                width: barWidth,
                align: 'center',
            });
            // Etiqueta del tratamiento debajo del gráfico
            doc.fillColor('#000000').fontSize(9).font('Helvetica-Bold')
                .text(labels[idx], barX, y + height + 8, {
                width: barWidth,
                align: 'center',
            });
        });
        // Restaurar color
        doc.fillColor('#000000');
        // Actualizar posición del cursor
        doc.y = y + height + 50;
    }
}
exports.PdfReportGenerator = PdfReportGenerator;
