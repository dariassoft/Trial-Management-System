"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SvgChartsService = void 0;
const common_1 = require("@nestjs/common");
/**
 * Servicio para generar gráficos en SVG
 * Retorna código SVG que puede ser integrado en PDF o Excel
 */
let SvgChartsService = class SvgChartsService {
    /**
     * Genera gráfico de líneas (para evoluciones)
     */
    static generarGraficoLineas(datos, config = {}) {
        const { titulo = 'Gráfico', ancho = 800, alto = 500, ejeX = 'Eje X', ejeY = 'Eje Y', } = config;
        const svg = `
      <svg width="${ancho}" height="${alto}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <style>
            .titulo { font-size: 16px; font-weight: bold; }
            .etiqueta { font-size: 12px; }
            .grid { stroke: #e0e0e0; }
          </style>
        </defs>
        
        <!-- Título -->
        <text x="${ancho / 2}" y="25" text-anchor="middle" class="titulo">
          ${titulo}
        </text>
        
        <!-- Ejes -->
        <line x1="50" y1="${alto - 50}" x2="${ancho - 20}" y2="${alto - 50}" stroke="black" stroke-width="2"/>
        <line x1="50" y1="30" x2="50" y2="${alto - 50}" stroke="black" stroke-width="2"/>
        
        <!-- Etiquetas ejes -->
        <text x="${(ancho - 20 + 50) / 2}" y="${alto - 10}" text-anchor="middle" class="etiqueta">
          ${ejeX}
        </text>
        <text x="15" y="${(alto + 30) / 2}" text-anchor="middle" transform="rotate(-90 15 ${(alto + 30) / 2})" class="etiqueta">
          ${ejeY}
        </text>
        
        <!-- Grid y datos simplificados -->
        <line x1="50" y1="${alto - 50}" x2="${ancho - 20}" y2="${alto - 50}" stroke="black" stroke-width="1"/>
      </svg>
    `;
        return svg;
    }
    /**
     * Genera gráfico de barras
     */
    static generarGraficoBarras(datos, config = {}) {
        const { titulo = 'Gráfico de Barras', ancho = 800, alto = 500, ejeY = 'Valor', } = config;
        const padding = 60;
        const anchoGrafico = ancho - padding * 2;
        const altoGrafico = alto - padding * 2;
        // Determinar el rango de datos (mínimo y máximo)
        const valoresY = datos.map(d => d.y);
        const minVal = Math.min(0, ...valoresY); // Asegurarse de que el 0 esté incluido
        const maxVal = Math.max(...valoresY.map((y, i) => y + (datos[i].error || 0)));
        const rango = maxVal - minVal;
        // Si el rango es 0, evitar división por cero
        const escala = rango === 0 ? 1 : altoGrafico / rango;
        // Posición del eje Y cero
        const yCero = alto - padding - (-minVal * escala);
        // Ancho de cada barra
        const anchoBarraItem = anchoGrafico / (datos.length * 1.5);
        // Colores
        const colores = [
            '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b',
        ];
        let svg = `
      <svg width="${ancho}" height="${alto}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <style>
            .titulo { font-size: 16px; font-weight: bold; }
            .etiqueta { font-size: 11px; }
            .grid { stroke: #e0e0e0; }
          </style>
        </defs>
        
        <!-- Fondo -->
        <rect width="${ancho}" height="${alto}" fill="white" stroke="none"/>
        
        <!-- Título -->
        <text x="${ancho / 2}" y="30" text-anchor="middle" class="titulo">${titulo}</text>
        
        <!-- Eje Y -->
        <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${alto - padding}" stroke="black" stroke-width="2"/>
        
        <!-- Eje X (línea del cero) -->
        <line x1="${padding}" y1="${yCero}" x2="${ancho - padding}" y2="${yCero}" stroke="black" stroke-width="2"/>
        
        <!-- Etiqueta eje Y -->
        <text x="20" y="${(alto + padding) / 2}" text-anchor="middle" transform="rotate(-90 20 ${(alto + padding) / 2})" class="etiqueta">${ejeY}</text>
    `;
        // Generar barras
        datos.forEach((punto, indice) => {
            const x = padding + (indice + 0.5) * (anchoGrafico / datos.length);
            const altoBarra = Math.abs(punto.y * escala);
            let y;
            if (punto.y < 0) {
                y = yCero;
            }
            else {
                y = yCero - altoBarra;
            }
            const color = colores[indice % colores.length];
            // Barra
            svg += `
        <rect 
          x="${x - anchoBarraItem / 2}" y="${y}" 
          width="${anchoBarraItem}" height="${altoBarra}" 
          fill="${color}" 
          stroke="#333" stroke-width="1"
        />
      `;
            // Valor encima o debajo de la barra
            const yTexto = punto.y >= 0 ? y - 10 : y + altoBarra + 20;
            svg += `
        <text x="${x}" y="${yTexto}" text-anchor="middle" class="etiqueta" font-weight="bold">
          ${punto.y.toFixed(0)}
        </text>
      `;
            // Etiqueta eje X
            svg += `
        <text x="${x}" y="${alto - padding + 20}" text-anchor="middle" class="etiqueta">
          ${punto.x}
        </text>
      `;
        });
        svg += `</svg>`;
        return svg;
    }
    /**
     * Genera gráfico de cajas (Box Plot)
     */
    static generarGraficoBoxPlot(datos, config = {}) {
        const { titulo = 'Box Plot', ancho = 800, alto = 500, } = config;
        const padding = 60;
        const anchoGrafico = ancho - padding * 2;
        const altoGrafico = alto - padding * 2;
        // Encontrar máximo para escala
        const maximo = Math.max(...datos.map(d => d.max));
        const escala = altoGrafico / maximo;
        let svg = `
      <svg width="${ancho}" height="${alto}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <style>
            .titulo { font-size: 16px; font-weight: bold; }
            .etiqueta { font-size: 11px; }
          </style>
        </defs>
        
        <!-- Fondo -->
        <rect width="${ancho}" height="${alto}" fill="white" stroke="none"/>
        
        <!-- Título -->
        <text x="${ancho / 2}" y="30" text-anchor="middle" class="titulo">
          ${titulo}
        </text>
        
        <!-- Ejes -->
        <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${alto - padding}" stroke="black" stroke-width="2"/>
        <line x1="${padding}" y1="${alto - padding}" x2="${ancho - padding}" y2="${alto - padding}" stroke="black" stroke-width="2"/>
    `;
        const anchoGraficoItem = anchoGrafico / datos.length;
        datos.forEach((punto, indice) => {
            const x = padding + (indice + 0.5) * anchoGraficoItem;
            const yMin = alto - padding - punto.min * escala;
            const yQ1 = alto - padding - punto.q1 * escala;
            const yMediana = alto - padding - punto.mediana * escala;
            const yQ3 = alto - padding - punto.q3 * escala;
            const yMax = alto - padding - punto.max * escala;
            const anchoBoxA = 30;
            // Línea mín-Q1
            svg += `
        <line x1="${x}" y1="${yMin}" x2="${x}" y2="${yQ1}" stroke="#333" stroke-width="1"/>
      `;
            // Caja Q1-Q3
            svg += `
        <rect 
          x="${x - anchoBoxA / 2}" y="${yQ3}" 
          width="${anchoBoxA}" height="${yQ1 - yQ3}" 
          fill="#b3d9ff" stroke="#333" stroke-width="2"
        />
      `;
            // Línea mediana (dentro de caja)
            svg += `
        <line 
          x1="${x - anchoBoxA / 2}" y1="${yMediana}" 
          x2="${x + anchoBoxA / 2}" y2="${yMediana}" 
          stroke="#d62728" stroke-width="2"
        />
      `;
            // Línea Q3-Max
            svg += `
        <line x1="${x}" y1="${yQ3}" x2="${x}" y2="${yMax}" stroke="#333" stroke-width="1"/>
      `;
            // Etiqueta X
            svg += `
        <text x="${x}" y="${alto - padding + 20}" text-anchor="middle" class="etiqueta">
          ${punto.x}
        </text>
      `;
        });
        svg += `
      </svg>
    `;
        return svg;
    }
    /**
     * Genera gráfico de pastel (Pie Chart)
     */
    static generarGraficoPastel(datos, config = {}) {
        const { titulo = 'Gráfico de Pastel', ancho = 600, alto = 600, } = config;
        const centerX = ancho / 2;
        const centerY = alto / 2;
        const radio = Math.min(ancho, alto) / 3;
        // Colores por defecto
        const coloresDefault = [
            '#2ca02c',
            '#d62728',
            '#ff7f0e',
            '#1f77b4',
            '#9467bd',
        ];
        // Calcular total
        const total = datos.reduce((sum, d) => sum + d.valor, 0);
        let svg = `
      <svg width="${ancho}" height="${alto}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <style>
            .titulo { font-size: 16px; font-weight: bold; }
            .etiqueta { font-size: 12px; }
          </style>
        </defs>
        
        <!-- Fondo -->
        <rect width="${ancho}" height="${alto}" fill="white" stroke="none"/>
        
        <!-- Título -->
        <text x="${centerX}" y="30" text-anchor="middle" class="titulo">
          ${titulo}
        </text>
    `;
        let anguloActual = -Math.PI / 2; // Comienza arriba
        datos.forEach((punto, indice) => {
            const porcentaje = punto.valor / total;
            const anguloSector = porcentaje * 2 * Math.PI;
            const color = punto.color || coloresDefault[indice % coloresDefault.length];
            // Puntos del arco
            const x1 = centerX + radio * Math.cos(anguloActual);
            const y1 = centerY + radio * Math.sin(anguloActual);
            const anguloFinal = anguloActual + anguloSector;
            const x2 = centerX + radio * Math.cos(anguloFinal);
            const y2 = centerY + radio * Math.sin(anguloFinal);
            // Flag para arco grande
            const largeArc = anguloSector > Math.PI ? 1 : 0;
            // Crear sector
            const ruta = `
        M ${centerX} ${centerY}
        L ${x1} ${y1}
        A ${radio} ${radio} 0 ${largeArc} 1 ${x2} ${y2}
        Z
      `;
            svg += `
        <path d="${ruta}" fill="${color}" stroke="white" stroke-width="2"/>
      `;
            // Etiqueta de porcentaje (opcional)
            const anguloMedio = anguloActual + anguloSector / 2;
            const xEtiqueta = centerX + (radio * 0.6) * Math.cos(anguloMedio);
            const yEtiqueta = centerY + (radio * 0.6) * Math.sin(anguloMedio);
            if (porcentaje > 0.05) {
                // Solo mostrar si es >= 5%
                svg += `
          <text 
            x="${xEtiqueta}" y="${yEtiqueta}" 
            text-anchor="middle" 
            dominant-baseline="central"
            class="etiqueta" 
            fill="white" 
            font-weight="bold"
          >
            ${(porcentaje * 100).toFixed(0)}%
          </text>
        `;
            }
            anguloActual = anguloFinal;
        });
        // Leyenda
        let leyendaY = 70;
        datos.forEach((punto, indice) => {
            const color = punto.color || coloresDefault[indice % coloresDefault.length];
            svg += `
        <rect x="${centerX + radio + 30}" y="${leyendaY - 10}" width="15" height="15" fill="${color}"/>
        <text x="${centerX + radio + 50}" y="${leyendaY}" class="etiqueta">
          ${punto.nombre}: ${punto.valor.toFixed(1)}
        </text>
      `;
            leyendaY += 25;
        });
        svg += `
      </svg>
    `;
        return svg;
    }
    /**
     * Genera gráfico de dispersión (Scatter)
     */
    static generarGraficoDispersion(datos, config = {}) {
        const { titulo = 'Gráfico de Dispersión', ancho = 800, alto = 500, ejeX = 'Eje X', ejeY = 'Eje Y', } = config;
        const padding = 60;
        const anchoGrafico = ancho - padding * 2;
        const altoGrafico = alto - padding * 2;
        // Encontrar rango
        const maxX = Math.max(...datos.map(d => d.x));
        const minX = Math.min(...datos.map(d => d.x));
        const maxY = Math.max(...datos.map(d => d.y));
        const minY = Math.min(...datos.map(d => d.y));
        const escalaX = anchoGrafico / (maxX - minX || 1);
        const escalaY = altoGrafico / (maxY - minY || 1);
        // Agrupar por serie
        const series = {};
        datos.forEach(d => {
            const s = d.serie || 'Default';
            if (!series[s])
                series[s] = [];
            series[s].push(d);
        });
        const colores = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd'];
        let svg = `
      <svg width="${ancho}" height="${alto}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <style>
            .titulo { font-size: 16px; font-weight: bold; }
            .etiqueta { font-size: 11px; }
          </style>
        </defs>
        
        <!-- Fondo -->
        <rect width="${ancho}" height="${alto}" fill="white" stroke="none"/>
        
        <!-- Título -->
        <text x="${ancho / 2}" y="30" text-anchor="middle" class="titulo">
          ${titulo}
        </text>
        
        <!-- Ejes -->
        <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${alto - padding}" stroke="black" stroke-width="2"/>
        <line x1="${padding}" y1="${alto - padding}" x2="${ancho - padding}" y2="${alto - padding}" stroke="black" stroke-width="2"/>
        
        <!-- Etiquetas ejes -->
        <text x="${(ancho - 20 + 50) / 2}" y="${alto - 10}" text-anchor="middle" class="etiqueta">
          ${ejeX}
        </text>
        <text x="20" y="${(alto + 30) / 2}" text-anchor="middle" transform="rotate(-90 20 ${(alto + 30) / 2})" class="etiqueta">
          ${ejeY}
        </text>
    `;
        let indiceColor = 0;
        Object.entries(series).forEach(([nombreSerie, puntos]) => {
            const color = colores[indiceColor % colores.length];
            puntos.forEach(punto => {
                const x = padding + (punto.x - minX) * escalaX;
                const y = alto - padding - (punto.y - minY) * escalaY;
                svg += `
          <circle cx="${x}" cy="${y}" r="4" fill="${color}" stroke="#333" stroke-width="1"/>
        `;
            });
            indiceColor++;
        });
        svg += `
      </svg>
    `;
        return svg;
    }
    /**
     * Genera tabla HTML embebida en SVG
     */
    static generarTabla(datos, columnas, config = {}) {
        const { titulo = 'Tabla', ancho = 800, altoFila = 30, } = config;
        const alturaEncabezado = 40;
        const altoTotal = alturaEncabezado + datos.length * altoFila + 40;
        const anchoColumna = ancho / columnas.length;
        let svg = `
      <svg width="${ancho}" height="${altoTotal}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <style>
            .titulo { font-size: 14px; font-weight: bold; }
            .encabezado { font-size: 12px; font-weight: bold; }
            .dato { font-size: 11px; }
          </style>
        </defs>
        
        <!-- Fondo -->
        <rect width="${ancho}" height="${altoTotal}" fill="white" stroke="1px solid #ccc"/>
        
        <!-- Título -->
        <text x="${ancho / 2}" y="25" text-anchor="middle" class="titulo">
          ${titulo}
        </text>
    `;
        // Encabezados
        columnas.forEach((col, i) => {
            const x = i * anchoColumna;
            svg += `
        <rect x="${x}" y="35" width="${anchoColumna}" height="${alturaEncabezado}" fill="#e0e0e0" stroke="#999" stroke-width="1"/>
        <text x="${x + anchoColumna / 2}" y="65" text-anchor="middle" class="encabezado">
          ${col}
        </text>
      `;
        });
        // Datos
        datos.forEach((fila, filaIdx) => {
            const y = 35 + alturaEncabezado + filaIdx * altoFila;
            columnas.forEach((col, colIdx) => {
                const x = colIdx * anchoColumna;
                const valor = fila[col] || '';
                // Alternar color de fila
                const fillColor = filaIdx % 2 === 0 ? 'white' : '#f5f5f5';
                svg += `
          <rect x="${x}" y="${y}" width="${anchoColumna}" height="${altoFila}" fill="${fillColor}" stroke="#ddd" stroke-width="1"/>
          <text x="${x + 5}" y="${y + altoFila / 2 + 5}" class="dato">
            ${String(valor).substring(0, 20)}
          </text>
        `;
            });
        });
        svg += `
      </svg>
    `;
        return svg;
    }
};
exports.SvgChartsService = SvgChartsService;
exports.SvgChartsService = SvgChartsService = __decorate([
    (0, common_1.Injectable)()
], SvgChartsService);
