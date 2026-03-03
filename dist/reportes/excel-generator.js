"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExcelReportGenerator = void 0;
const ExcelJS = __importStar(require("exceljs"));
/**
 * Servicio para generar reportes en Excel con estilos y gráficos
 */
class ExcelReportGenerator {
    /**
     * Genera reporte completo de ensayo en Excel
     */
    static generarReporteEnsayo(datos) {
        return __awaiter(this, void 0, void 0, function* () {
            const workbook = new ExcelJS.Workbook();
            // Hoja 1: Resumen
            this.crearHojaResumen(workbook, datos);
            // Hoja 2: Datos de Campo
            this.crearHojaDatosCampo(workbook, datos.datosCampo);
            // Hoja 3: Datos de Trilla
            this.crearHojaDatosTrilla(workbook, datos.datosTrilla);
            // Hoja 4: Estadísticas
            this.crearHojaEstadisticas(workbook, datos.estadisticas);
            // Generar buffer
            const buffer = yield workbook.xlsx.writeBuffer();
            return Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
        });
    }
    static crearHojaResumen(workbook, datos) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const ws = workbook.addWorksheet('Resumen');
        // Estilos
        const titleStyle = {
            font: { bold: true, size: 14, color: { argb: 'FFFFFFFF' } },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF1F4E78' },
            },
            alignment: { horizontal: 'center', vertical: 'middle' },
        };
        // Título
        ws.getCell('A1').value = 'REPORTE DE ENSAYO';
        ws.getCell('A1').style = titleStyle;
        ws.getRow(1).height = 30;
        // Metadata
        let row = 3;
        const metadata = [
            ['DATOS DEL ENSAYO', ''],
            ['Ensayo ID', ((_a = datos.metadatos) === null || _a === void 0 ? void 0 : _a.ensayoId) || 'N/A'],
            ['Fecha Siembra', ((_b = datos.metadatos) === null || _b === void 0 ? void 0 : _b.fechaSiembra) || 'N/A'],
            ['Provincia', ((_c = datos.metadatos) === null || _c === void 0 ? void 0 : _c.provincia) || 'N/A'],
            ['Departamento', ((_d = datos.metadatos) === null || _d === void 0 ? void 0 : _d.departamento) || 'N/A'],
            ['Cultivo', ((_e = datos.metadatos) === null || _e === void 0 ? void 0 : _e.cultivo) || 'N/A'],
            ['Tipo de Siembra', ((_f = datos.metadatos) === null || _f === void 0 ? void 0 : _f.tipoSiembra) || 'N/A'],
            ['Estadío', ((_g = datos.metadatos) === null || _g === void 0 ? void 0 : _g.estadio) || 'N/A'],
            ['Temperatura', `${((_h = datos.metadatos) === null || _h === void 0 ? void 0 : _h.temperatura) || 'N/A'}°C`],
            ['Humedad Relativa', `${((_j = datos.metadatos) === null || _j === void 0 ? void 0 : _j.humedad) || 'N/A'}%`],
        ];
        for (const [label, value] of metadata) {
            ws.getCell(`A${row}`).value = label;
            ws.getCell(`B${row}`).value = value;
            if (label === 'DATOS DEL ENSAYO') {
                ws.getCell(`A${row}`).font = { bold: true, size: 12 };
            }
            else {
                ws.getCell(`A${row}`).font = { bold: true };
            }
            row++;
        }
        ws.getColumn('A').width = 25;
        ws.getColumn('B').width = 35;
    }
    static crearHojaDatosCampo(workbook, datos) {
        const ws = workbook.addWorksheet('Datos Campo');
        if (!datos || datos.length === 0) {
            ws.addRow(['No hay datos de campo']);
            return;
        }
        // Headers
        const headers = Object.keys(datos[0]);
        const headerRow = ws.addRow(headers);
        headerRow.font = { bold: true };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFD9E1F2' },
        };
        // Datos
        for (const dato of datos) {
            ws.addRow(Object.values(dato));
        }
        // Auto-width
        ws.columns.forEach((column) => {
            column.width = 15;
        });
    }
    static crearHojaDatosTrilla(workbook, datos) {
        const ws = workbook.addWorksheet('Datos Trilla');
        if (!datos || datos.length === 0) {
            ws.addRow(['No hay datos de trilla']);
            return;
        }
        // Headers
        const headers = Object.keys(datos[0]);
        const headerRow = ws.addRow(headers);
        headerRow.font = { bold: true };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFD9E1F2' },
        };
        // Datos
        for (const dato of datos) {
            ws.addRow(Object.values(dato));
        }
        // Auto-width
        ws.columns.forEach((column) => {
            column.width = 15;
        });
    }
    static crearHojaEstadisticas(workbook, estadisticas) {
        const ws = workbook.addWorksheet('Estadísticas');
        const headers = [
            'Tratamiento',
            'N',
            'Promedio',
            'Desviación',
            'Mínimo',
            'Máximo',
            'CV %',
        ];
        const headerRow = ws.addRow(headers);
        headerRow.font = { bold: true };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFD9E1F2' },
        };
        // Datos
        for (const [trat, stats] of Object.entries(estadisticas)) {
            const statsData = stats;
            ws.addRow([
                trat,
                statsData.n,
                statsData.promedio,
                statsData.desviacion,
                statsData.minimo,
                statsData.maximo,
                statsData.coefVariacion,
            ]);
        }
        ws.columns.forEach((column) => {
            column.width = 15;
        });
    }
}
exports.ExcelReportGenerator = ExcelReportGenerator;
