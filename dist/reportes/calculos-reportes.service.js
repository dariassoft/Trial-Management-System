"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculosReportesService = void 0;
const common_1 = require("@nestjs/common");
/**
 * Servicio para calcular métricas derivadas en reportes
 * Incluye: índices de calidad, sanidad, eficiencia, etc.
 */
let CalculosReportesService = class CalculosReportesService {
    /**
     * Calcula porcentaje de grano puro (sin defectos)
     * Formula: 100 - (dañados + verdes + vanos)
     */
    calcularGranoPuro(granosDañados = 0, granosVerdes = 0, granosVanos = 0) {
        const totalDefectos = granosDañados + granosVerdes + granosVanos;
        const granoPuro = Math.max(0, Math.min(100, 100 - totalDefectos));
        return Math.round(granoPuro * 100) / 100; // 2 decimales
    }
    /**
     * Calcula índice de calidad final (0-100)
     * Formula: (GIE × GranoPuro) / 100
     * Donde GIE es germinación/integridad (0-100)
     */
    calcularCalidadFinal(gie = 0, granoPuro = 0) {
        const calidad = (gie * granoPuro) / 100;
        return Math.round(calidad * 100) / 100;
    }
    /**
     * Calcula índice de plagas
     * Formula: larvas/m² / (benéficos/m² + 1)
     * Resultado cercano a 0 = bien; > 1 = desequilibrio
     */
    calcularIndicePlagas(larvasPorm2 = 0, benéficosPorM2 = 0) {
        const indice = larvasPorm2 / (benéficosPorM2 + 1);
        return Math.round(indice * 100) / 100;
    }
    /**
     * Calcula índice de sanidad general (0-100)
     * Formula: (GIE × GranoPuro) / (IndicePlagas + 1)
     * Mayor valor = mejor
     */
    calcularSanidad(gie = 0, granoPuro = 0, larvasPorM2 = 0, benéficosPorM2 = 0) {
        const calidadBase = (gie * granoPuro) / 100;
        const indicePlagas = larvasPorM2 / (benéficosPorM2 + 1);
        const sanidad = calidadBase / (indicePlagas + 1);
        return Math.round(Math.min(100, sanidad) * 100) / 100;
    }
    /**
     * Calcula índice de vigor del cultivo (0-100)
     * Formula: (altura × diámetroEspiga × densidad) / 1000
     * Escala normalizada a 100
     */
    calcularIndiceVigor(alturaCm = 0, diámetroMm = 0, densidadPlantasM2 = 0) {
        if (alturaCm <= 0 || diámetroMm <= 0 || densidadPlantasM2 <= 0) {
            return 0;
        }
        // Base: altura (75-100 cm) × diámetro (7-10 mm) × densidad (7-10 plantas/m²)
        const vigorBase = (alturaCm * diámetroMm * densidadPlantasM2) / 1000;
        // Normalizar a escala 0-100 (esperado ~6-10)
        const vigorNormalizado = (vigorBase / 10) * 100;
        return Math.round(Math.min(100, vigorNormalizado) * 100) / 100;
    }
    /**
     * Calcula eficiencia de conversión
     * Formula: (pesoGranos/m² × 10) / kgHa
     * Esperado: cercano a 100% (validación de coherencia)
     */
    calcularEficienciaConversion(pesoGranosPorM2 = 0, kgHaCorregido = 0) {
        if (kgHaCorregido <= 0)
            return 0;
        const eficiencia = (pesoGranosPorM2 * 10) / kgHaCorregido;
        return Math.round(eficiencia * 100) / 100;
    }
    /**
     * Calcula eficiencia foliar
     * Formula: kgHa / (hojas/m² / 100)
     * Mayor valor = mejor productividad por unidad de área foliar
     */
    calcularEficienciaFoliar(kgHaCorregido = 0, hojasPorM2 = 0) {
        if (hojasPorM2 <= 0)
            return 0;
        const eficiencia = kgHaCorregido / (hojasPorM2 / 100);
        return Math.round(eficiencia * 100) / 100;
    }
    /**
     * Calcula rendimiento por planta individual
     * Formula: kgHa / densidad plantas
     */
    calcularRendimientoPorPlanta(kgHaCorregido = 0, densidadPlantasM2 = 0) {
        if (densidadPlantasM2 <= 0)
            return 0;
        const rendimientoPorPlanta = kgHaCorregido / densidadPlantasM2;
        return Math.round(rendimientoPorPlanta * 100) / 100;
    }
    /**
     * Calcula evolución del vigor entre dos momentos
     * Usado para comparar vigor inicial vs final
     */
    calcularEvolucionVigor(vigorInicial, vigorFinal) {
        const cambio = vigorFinal - vigorInicial;
        return Math.round(cambio * 100) / 100;
    }
    /**
     * Calcula recuperación de fitotoxicidad
     * Retorna: % de recuperación (0-100)
     */
    calcularRecuperacionFitotoxicidad(fitotoxicidadInicial, fitotoxicidadFinal) {
        if (fitotoxicidadInicial <= 0)
            return 100;
        const recuperacion = ((fitotoxicidadInicial - fitotoxicidadFinal) / fitotoxicidadInicial) *
            100;
        return Math.round(Math.max(0, Math.min(100, recuperacion)) * 100) / 100;
    }
    /**
     * Estadísticas básicas para un conjunto de datos
     */
    calcularEstadisticas(valores) {
        if (!valores || valores.length === 0) {
            return {
                n: 0,
                promedio: 0,
                desviacion: 0,
                minimo: 0,
                maximo: 0,
                mediana: 0,
                coefVariacion: 0,
            };
        }
        const n = valores.length;
        const valoresOrdenados = [...valores].sort((a, b) => a - b);
        // Promedio
        const promedio = valores.reduce((a, b) => a + b, 0) / n;
        // Desviación estándar
        const varianza = valores.reduce((sum, val) => sum + Math.pow(val - promedio, 2), 0) / n;
        const desviacion = Math.sqrt(varianza);
        // Mínimo y máximo
        const minimo = valoresOrdenados[0];
        const maximo = valoresOrdenados[n - 1];
        // Mediana
        const mediana = n % 2 === 0
            ? (valoresOrdenados[n / 2 - 1] + valoresOrdenados[n / 2]) / 2
            : valoresOrdenados[Math.floor(n / 2)];
        // Coeficiente de variación
        const coefVariacion = promedio !== 0
            ? (desviacion / promedio) * 100
            : 0;
        return {
            n,
            promedio: Math.round(promedio * 100) / 100,
            desviacion: Math.round(desviacion * 100) / 100,
            minimo: Math.round(minimo * 100) / 100,
            maximo: Math.round(maximo * 100) / 100,
            mediana: Math.round(mediana * 100) / 100,
            coefVariacion: Math.round(coefVariacion * 100) / 100,
        };
    }
    /**
     * Calcula percentiles (Q1, Q2/Mediana, Q3) para box plot
     */
    calcularPercentiles(valores) {
        if (!valores || valores.length === 0) {
            return { q1: 0, q2: 0, q3: 0 };
        }
        const valoresOrdenados = [...valores].sort((a, b) => a - b);
        const n = valoresOrdenados.length;
        // Q1 (25%)
        const q1Index = Math.ceil(n * 0.25) - 1;
        const q1 = valoresOrdenados[Math.max(0, q1Index)];
        // Q2 (50%) = Mediana
        const q2Index = Math.ceil(n * 0.5) - 1;
        const q2 = valoresOrdenados[Math.max(0, q2Index)];
        // Q3 (75%)
        const q3Index = Math.ceil(n * 0.75) - 1;
        const q3 = valoresOrdenados[Math.max(0, q3Index)];
        return {
            q1: Math.round(q1 * 100) / 100,
            q2: Math.round(q2 * 100) / 100,
            q3: Math.round(q3 * 100) / 100,
        };
    }
    /**
     * Correlación de Pearson entre dos conjuntos de datos
     */
    calcularCorrelacionPearson(x, y) {
        if (x.length !== y.length || x.length < 2)
            return 0;
        const n = x.length;
        const mediaX = x.reduce((a, b) => a + b, 0) / n;
        const mediaY = y.reduce((a, b) => a + b, 0) / n;
        let covarianza = 0;
        let desviacionX = 0;
        let desviacionY = 0;
        for (let i = 0; i < n; i++) {
            const dx = x[i] - mediaX;
            const dy = y[i] - mediaY;
            covarianza += dx * dy;
            desviacionX += dx * dx;
            desviacionY += dy * dy;
        }
        const denominador = Math.sqrt(desviacionX * desviacionY);
        if (denominador === 0)
            return 0;
        const r = covarianza / denominador;
        return Math.round(r * 1000) / 1000; // 3 decimales
    }
    /**
     * Interpreta correlación de Pearson
     */
    interpretarCorrelacion(r) {
        const absR = Math.abs(r);
        if (absR >= 0.8)
            return 'Muy fuerte';
        if (absR >= 0.6)
            return 'Fuerte';
        if (absR >= 0.4)
            return 'Moderada';
        if (absR >= 0.2)
            return 'Débil';
        return 'Muy débil o nula';
    }
    /**
     * Valida coherencia de datos de cosecha
     */
    validarCoherenciaDatos(datos) {
        var _a, _b, _c, _d;
        const advertencias = [];
        const errores = [];
        // 1. Validar que pesoGranos ≈ gramaje × granos/m²
        if (datos.pesoGranosPorUrf &&
            datos.gramajePorGrano &&
            datos.granosPorurf) {
            const pesoEsperado = (datos.gramajePorGrano * datos.granosPorurf) / 1000;
            const diferencia = Math.abs(datos.pesoGranosPorUrf - pesoEsperado) / pesoEsperado;
            if (diferencia > 0.15) {
                advertencias.push(`Peso de granos/m² parece inconsistente (${((diferencia * 100).toFixed(1))}% de diferencia)`);
            }
        }
        // 2. Validar que kgHa ≈ pesoGranos × 10
        if (datos.kgHaCorregido && datos.pesoGranosPorUrf) {
            const kgHaEsperado = datos.pesoGranosPorUrf * 10;
            const diferencia = Math.abs(datos.kgHaCorregido - kgHaEsperado) / kgHaEsperado;
            if (diferencia > 0.15) {
                advertencias.push(`Rendimiento (kg/ha) parece inconsistente (${((diferencia * 100).toFixed(1))}% de diferencia)`);
            }
        }
        // 3. Validar que defectos no superen 100%
        const totalDefectos = ((_b = (_a = datos.granosDañados) !== null && _a !== void 0 ? _a : datos.granosDanados) !== null && _b !== void 0 ? _b : 0) +
            ((_c = datos.granosVerdes) !== null && _c !== void 0 ? _c : 0) +
            ((_d = datos.granosVanos) !== null && _d !== void 0 ? _d : 0);
        if (totalDefectos > 100) {
            errores.push(`Suma de defectos supera 100% (${totalDefectos.toFixed(1)}%)`);
        }
        else if (totalDefectos > 85) {
            advertencias.push(`Muy alto porcentaje de defectos (${totalDefectos.toFixed(1)}%)`);
        }
        // 4. Validar que densidad final <= densidad siembra
        if (datos.densidadPlantasFinal &&
            datos.densidadSiembra &&
            datos.densidadPlantasFinal > datos.densidadSiembra) {
            errores.push(`Densidad final mayor que siembra (${datos.densidadPlantasFinal} > ${datos.densidadSiembra})`);
        }
        // 5. Validar alturas lógicas
        if (datos.alturaParcela && (datos.alturaParcela < 20 || datos.alturaParcela > 200)) {
            advertencias.push(`Altura sospechosa: ${datos.alturaParcela} cm (esperado 40-150)`);
        }
        // 6. Validar conteos lógicos
        if (datos.hojasPorUrf && datos.hojasPorUrf < 500) {
            advertencias.push(`Pocas hojas/m²: ${datos.hojasPorUrf} (esperado >1000)`);
        }
        return {
            válido: errores.length === 0,
            advertencias,
            errores,
        };
    }
    /**
     * Agrupa datos por tratamiento y calcula estadísticas
     */
    agruparPorTratamientoYCalcular(datos, campo) {
        const grupos = {};
        // Agrupar
        for (const dato of datos) {
            const trat = `T${dato.tratamiento || 1}`;
            if (!grupos[trat]) {
                grupos[trat] = [];
            }
            const valor = parseFloat(dato[campo]);
            if (!isNaN(valor)) {
                grupos[trat].push(valor);
            }
        }
        // Calcular estadísticas
        const resultado = {};
        for (const [trat, valores] of Object.entries(grupos)) {
            resultado[trat] = this.calcularEstadisticas(valores);
        }
        return resultado;
    }
    /**
     * Calcula diferencia vs testigo (T1)
     * Retorna: diferencia absoluta y porcentaje
     */
    calcularDiferenciaVsTestigo(valorTratamiento, valorTestigo) {
        if (valorTestigo === 0)
            return { absoluta: 0, porcentaje: 0 };
        const diferenciaAbsoluta = valorTratamiento - valorTestigo;
        const diferenciaPorcentaje = (diferenciaAbsoluta / valorTestigo) * 100;
        return {
            absoluta: Math.round(diferenciaAbsoluta * 100) / 100,
            porcentaje: Math.round(diferenciaPorcentaje * 100) / 100,
        };
    }
    /**
     * Genera análisis de tendencia simple
     */
    analizarTendencia(valores) {
        if (valores.length < 2) {
            return { tendencia: 'estable', pendiente: 0, r2: 0 };
        }
        // Regresión lineal simple
        const n = valores.length;
        const x = Array.from({ length: n }, (_, i) => i);
        const mediaX = x.reduce((a, b) => a + b, 0) / n;
        const mediaY = valores.reduce((a, b) => a + b, 0) / n;
        let numerador = 0;
        let denominadorX = 0;
        let denominadorY = 0;
        for (let i = 0; i < n; i++) {
            const dx = x[i] - mediaX;
            const dy = valores[i] - mediaY;
            numerador += dx * dy;
            denominadorX += dx * dx;
            denominadorY += dy * dy;
        }
        const pendiente = denominadorX === 0 ? 0 : numerador / denominadorX;
        const r = Math.sqrt(denominadorX * denominadorY) === 0
            ? 0
            : numerador / Math.sqrt(denominadorX * denominadorY);
        const r2 = r * r;
        let tendencia = 'estable';
        if (Math.abs(pendiente) > 0.1) {
            tendencia = pendiente > 0 ? 'ascendente' : 'descendente';
        }
        return {
            tendencia,
            pendiente: Math.round(pendiente * 1000) / 1000,
            r2: Math.round(r2 * 1000) / 1000,
        };
    }
};
exports.CalculosReportesService = CalculosReportesService;
exports.CalculosReportesService = CalculosReportesService = __decorate([
    (0, common_1.Injectable)()
], CalculosReportesService);
