"use strict";
// Servicio para generar gráficos SVG reales para reportes
// Genera gráficos de barras, líneas y comparativos en formato SVG
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraficosRealesService = void 0;
class GraficosRealesService {
    /**
     * Genera SVG con gráfico de barras
     */
    static generarGraficoBarras(labels, valores, titulo, unidad = '') {
        if (!labels || labels.length === 0)
            return '';
        const width = 500;
        const height = 300;
        const padding = { top: 40, right: 30, bottom: 50, left: 50 };
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;
        const maxVal = Math.max(...valores);
        const minVal = 0;
        const range = maxVal - minVal || 1;
        const barWidth = chartWidth / labels.length;
        const barActualWidth = barWidth * 0.7;
        const barSpacing = (barWidth - barActualWidth) / 2;
        let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
        // Fondo blanco
        svg += `<rect width="${width}" height="${height}" fill="white" stroke="black" stroke-width="1"/>`;
        // Título
        svg += `<text x="${width / 2}" y="25" font-size="16" font-weight="bold" text-anchor="middle" fill="black">${titulo}</text>`;
        // Líneas de grid
        const gridLines = 5;
        for (let i = 0; i <= gridLines; i++) {
            const y = padding.top + (chartHeight * i) / gridLines;
            const val = maxVal - (maxVal * i) / gridLines;
            svg += `<line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="#e0e0e0" stroke-width="1"/>`;
            svg += `<text x="${padding.left - 10}" y="${y + 4}" font-size="10" text-anchor="end" fill="#666">${val.toFixed(0)}</text>`;
        }
        // Barras
        const colores = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
        valores.forEach((valor, idx) => {
            const x = padding.left + idx * barWidth + barSpacing;
            const barHeight = (valor / range) * chartHeight;
            const y = padding.top + chartHeight - barHeight;
            const color = colores[idx % colores.length];
            // Barra
            svg += `<rect x="${x}" y="${y}" width="${barActualWidth}" height="${barHeight}" fill="${color}" stroke="black" stroke-width="0.5"/>`;
            // Valor en la barra
            svg += `<text x="${x + barActualWidth / 2}" y="${y - 5}" font-size="11" font-weight="bold" text-anchor="middle" fill="black">${valor.toFixed(0)}</text>`;
            // Etiqueta X
            svg += `<text x="${x + barActualWidth / 2}" y="${height - 20}" font-size="12" font-weight="bold" text-anchor="middle" fill="black">${labels[idx]}</text>`;
        });
        // Eje Y
        svg += `<line x1="${padding.left}" y1="${padding.top}" x2="${padding.left}" y2="${height - padding.bottom}" stroke="black" stroke-width="2"/>`;
        // Eje X
        svg += `<line x1="${padding.left}" y1="${height - padding.bottom}" x2="${width - padding.right}" y2="${height - padding.bottom}" stroke="black" stroke-width="2"/>`;
        // Etiqueta Y
        svg += `<text x="15" y="${height / 2}" font-size="12" text-anchor="middle" fill="black" transform="rotate(-90 15 ${height / 2})">${unidad}</text>`;
        svg += `</svg>`;
        return svg;
    }
    /**
     * Genera SVG con gráfico comparativo (barras dobles)
     */
    static generarGraficoComparativo(labels, valores1, valores2, titulo, etiqueta1, etiqueta2) {
        if (!labels || labels.length === 0)
            return '';
        const width = 500;
        const height = 300;
        const padding = { top: 40, right: 30, bottom: 50, left: 50 };
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;
        const allValues = [...valores1, ...valores2];
        const maxVal = Math.max(...allValues);
        const minVal = 0;
        const range = maxVal - minVal || 1;
        const groupWidth = chartWidth / labels.length;
        const barWidth = groupWidth * 0.35;
        const spacing = 5;
        let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
        // Fondo blanco
        svg += `<rect width="${width}" height="${height}" fill="white" stroke="black" stroke-width="1"/>`;
        // Título
        svg += `<text x="${width / 2}" y="25" font-size="16" font-weight="bold" text-anchor="middle" fill="black">${titulo}</text>`;
        // Líneas de grid
        const gridLines = 5;
        for (let i = 0; i <= gridLines; i++) {
            const y = padding.top + (chartHeight * i) / gridLines;
            const val = maxVal - (maxVal * i) / gridLines;
            svg += `<line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="#e0e0e0" stroke-width="1"/>`;
            svg += `<text x="${padding.left - 10}" y="${y + 4}" font-size="10" text-anchor="end" fill="#666">${val.toFixed(1)}</text>`;
        }
        // Barras
        const color1 = '#FF6B6B'; // Rojo para plagas
        const color2 = '#4ECDC4'; // Verde para benéficos
        valores1.forEach((valor1, idx) => {
            const valor2 = valores2[idx];
            const groupX = padding.left + idx * groupWidth;
            const x1 = groupX + (groupWidth - barWidth * 2 - spacing) / 2;
            const x2 = x1 + barWidth + spacing;
            // Barra 1
            const barHeight1 = (valor1 / range) * chartHeight;
            const y1 = padding.top + chartHeight - barHeight1;
            svg += `<rect x="${x1}" y="${y1}" width="${barWidth}" height="${barHeight1}" fill="${color1}" stroke="black" stroke-width="0.5"/>`;
            svg += `<text x="${x1 + barWidth / 2}" y="${y1 - 5}" font-size="9" text-anchor="middle" fill="black">${valor1.toFixed(1)}</text>`;
            // Barra 2
            const barHeight2 = (valor2 / range) * chartHeight;
            const y2 = padding.top + chartHeight - barHeight2;
            svg += `<rect x="${x2}" y="${y2}" width="${barWidth}" height="${barHeight2}" fill="${color2}" stroke="black" stroke-width="0.5"/>`;
            svg += `<text x="${x2 + barWidth / 2}" y="${y2 - 5}" font-size="9" text-anchor="middle" fill="black">${valor2.toFixed(1)}</text>`;
            // Etiqueta X
            svg += `<text x="${groupX + groupWidth / 2}" y="${height - 20}" font-size="12" font-weight="bold" text-anchor="middle" fill="black">${labels[idx]}</text>`;
        });
        // Eje Y
        svg += `<line x1="${padding.left}" y1="${padding.top}" x2="${padding.left}" y2="${height - padding.bottom}" stroke="black" stroke-width="2"/>`;
        // Eje X
        svg += `<line x1="${padding.left}" y1="${height - padding.bottom}" x2="${width - padding.right}" y2="${height - padding.bottom}" stroke="black" stroke-width="2"/>`;
        // Leyenda
        svg += `<rect x="${width - 200}" y="50" width="190" height="50" fill="white" stroke="black" stroke-width="1"/>`;
        svg += `<rect x="${width - 190}" y="60" width="15" height="15" fill="${color1}"/>`;
        svg += `<text x="${width - 170}" y="72" font-size="11" fill="black">${etiqueta1}</text>`;
        svg += `<rect x="${width - 190}" y="82" width="15" height="15" fill="${color2}"/>`;
        svg += `<text x="${width - 170}" y="94" font-size="11" fill="black">${etiqueta2}</text>`;
        svg += `</svg>`;
        return svg;
    }
    /**
     * Genera SVG con gráfico de líneas (evolución)
     */
    static generarGraficoLineas(labels, series, titulo, unidad = '') {
        if (!labels || labels.length === 0)
            return '';
        const width = 500;
        const height = 300;
        const padding = { top: 40, right: 30, bottom: 50, left: 50 };
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;
        const allValues = series.flatMap(s => s.valores);
        const maxVal = Math.max(...allValues);
        const minVal = Math.min(...allValues);
        const range = maxVal - minVal || 1;
        const pointSpacing = chartWidth / (labels.length - 1 || 1);
        let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
        // Fondo blanco
        svg += `<rect width="${width}" height="${height}" fill="white" stroke="black" stroke-width="1"/>`;
        // Título
        svg += `<text x="${width / 2}" y="25" font-size="16" font-weight="bold" text-anchor="middle" fill="black">${titulo}</text>`;
        // Grid
        const gridLines = 5;
        for (let i = 0; i <= gridLines; i++) {
            const y = padding.top + (chartHeight * i) / gridLines;
            const val = maxVal - (maxVal - minVal) * (i / gridLines);
            svg += `<line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="#e0e0e0" stroke-width="1"/>`;
            svg += `<text x="${padding.left - 10}" y="${y + 4}" font-size="10" text-anchor="end" fill="#666">${val.toFixed(1)}</text>`;
        }
        const colores = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];
        // Dibujar series
        series.forEach((s, seriesIdx) => {
            const color = colores[seriesIdx % colores.length];
            let pathData = '';
            s.valores.forEach((valor, idx) => {
                const x = padding.left + idx * pointSpacing;
                const y = padding.top + chartHeight - ((valor - minVal) / range) * chartHeight;
                if (idx === 0) {
                    pathData += `M${x},${y}`;
                }
                else {
                    pathData += `L${x},${y}`;
                }
            });
            // Línea
            svg += `<path d="${pathData}" stroke="${color}" stroke-width="2" fill="none"/>`;
            // Puntos
            s.valores.forEach((valor, idx) => {
                const x = padding.left + idx * pointSpacing;
                const y = padding.top + chartHeight - ((valor - minVal) / range) * chartHeight;
                svg += `<circle cx="${x}" cy="${y}" r="3" fill="${color}" stroke="black" stroke-width="0.5"/>`;
            });
        });
        // Etiquetas X
        labels.forEach((label, idx) => {
            const x = padding.left + idx * pointSpacing;
            svg += `<text x="${x}" y="${height - 20}" font-size="11" text-anchor="middle" fill="black">${label}</text>`;
        });
        // Eje Y
        svg += `<line x1="${padding.left}" y1="${padding.top}" x2="${padding.left}" y2="${height - padding.bottom}" stroke="black" stroke-width="2"/>`;
        // Eje X
        svg += `<line x1="${padding.left}" y1="${height - padding.bottom}" x2="${width - padding.right}" y2="${height - padding.bottom}" stroke="black" stroke-width="2"/>`;
        // Leyenda
        let legendY = 50;
        series.forEach((s, idx) => {
            const color = colores[idx % colores.length];
            svg += `<line x1="${width - 190}" y1="${legendY + 8}" x2="${width - 170}" y2="${legendY + 8}" stroke="${color}" stroke-width="2"/>`;
            svg += `<circle cx="${width - 180}" cy="${legendY + 8}" r="3" fill="${color}"/>`;
            svg += `<text x="${width - 160}" y="${legendY + 12}" font-size="10" fill="black">${s.nombre}</text>`;
            legendY += 20;
        });
        svg += `</svg>`;
        return svg;
    }
}
exports.GraficosRealesService = GraficosRealesService;
