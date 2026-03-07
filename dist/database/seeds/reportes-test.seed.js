"use strict";
/**
 * Seed de datos de prueba para testing de reportes
 * Crear un ensayo completo con todos los datos necesarios
 */
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
exports.seedReportesTestData = seedReportesTestData;
const ensayo_entity_1 = require("../../entities/ensayo.entity");
const parcela_entity_1 = require("../../entities/parcela.entity");
const bloque_entity_1 = require("../../entities/bloque.entity");
const tratamiento_entity_1 = require("../../entities/tratamiento.entity");
const datos_cosecha_entity_1 = require("../../entities/datos-cosecha.entity");
function seedReportesTestData(dataSource) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('🌱 Creando datos de prueba para reportes...');
        // Repositories
        const ensayoRepo = dataSource.getRepository(ensayo_entity_1.Ensayo);
        const bloqueRepo = dataSource.getRepository(bloque_entity_1.Bloque);
        const tratamientoRepo = dataSource.getRepository(tratamiento_entity_1.Tratamiento);
        const parcelaRepo = dataSource.getRepository(parcela_entity_1.Parcela);
        const datosCosechaRepo = dataSource.getRepository(datos_cosecha_entity_1.DatosCosecha);
        try {
            // 1. Crear Ensayo de prueba
            console.log('  ├─ Creando ensayo...');
            const ensayo = ensayoRepo.create({
                nombreEnsayo: 'ENSAYO TEST - Fomesafen en Poroto 2026',
                provincia: 'Salta',
                departamento: 'General San Martín',
                establecimiento: 'Las Tres Hermanas',
                lote: 'TEST-001',
                fechaSiembra: new Date('2026-04-03'),
                fechaCosecha: new Date('2026-07-08'),
            });
            const ensayoGuardado = yield ensayoRepo.save(ensayo);
            console.log(`  ├─ Ensayo creado: ${ensayoGuardado.id}`);
            // 2. Crear Bloques
            console.log('  ├─ Creando bloques...');
            const bloques = [];
            for (let i = 1; i <= 3; i++) {
                const bloque = bloqueRepo.create({
                    nombreBloque: `Bloque ${String.fromCharCode(64 + i)}`,
                    ensayo: ensayoGuardado,
                });
                bloques.push(yield bloqueRepo.save(bloque));
            }
            // 3. Crear Tratamientos - NOTA: Tratamiento requiere protocolo
            // Para este seed simplificado, crearemos tratamientos directamente
            console.log('  ├─ Creando tratamientos...');
            const tratamientos = [];
            const tratamientosData = [
                { numeroTrat: 1, descripcion: 'T1 - Testigo (Sin herbicida)' },
                { numeroTrat: 2, descripcion: 'T2 - Fomesafen 25% 800g/ha' },
                { numeroTrat: 3, descripcion: 'T3 - Fomesafen + GZ 500ml/ha' },
                { numeroTrat: 4, descripcion: 'T4 - Fomesafen + Sogix 300ml/ha' },
            ];
            // Para simplificar el seed, vamos a usar tratamientos existentes si existen
            // O crear nuevos sin protocolo (si es nullable)
            for (const data of tratamientosData) {
                try {
                    const trat = tratamientoRepo.create({
                        numeroTrat: data.numeroTrat,
                        descripcion: data.descripcion,
                        esTestigo: data.numeroTrat === 1,
                        // protocolo no se asigna en este seed simplificado
                    });
                    tratamientos.push(yield tratamientoRepo.save(trat));
                }
                catch (e) {
                    console.log(`    ⚠️  Tratamiento ${data.numeroTrat} no pudo crearse`);
                }
            }
            // 4. Crear Parcelas y Datos de Cosecha
            console.log('  ├─ Creando parcelas y datos de cosecha...');
            let numeroParc = 1;
            for (const tratamiento of tratamientos) {
                for (const bloque of bloques) {
                    const parcela = parcelaRepo.create({
                        nombreParcela: `P-${numeroParc}`,
                        ensayo: ensayoGuardado,
                        tratamiento,
                        bloque,
                    });
                    const parcelaGuardada = yield parcelaRepo.save(parcela);
                    numeroParc++;
                    // Crear datos de cosecha con valores variados
                    const datosBase = {
                        1: { kgHa: 5450, humedad: 12.5, gie: 97.3, gramaje: 0.0450, granos: 48500, peso: 2182.5 },
                        2: { kgHa: 5600, humedad: 12.8, gie: 98.0, gramaje: 0.0465, granos: 50000, peso: 2325 },
                        3: { kgHa: 5500, humedad: 12.3, gie: 96.0, gramaje: 0.0442, granos: 49000, peso: 2165 },
                        4: { kgHa: 5800, humedad: 12.6, gie: 99.0, gramaje: 0.0472, granos: 50500, peso: 2383 },
                    };
                    const base = datosBase[tratamiento.numeroTrat] || datosBase[1];
                    // Agregar variación por bloque
                    const variacion = (bloque === bloques[1] ? 1.02 : bloque === bloques[2] ? 0.98 : 1.0);
                    const datosCosecha = datosCosechaRepo.create({
                        parcela: parcelaGuardada,
                        fechaCosecha: new Date('2026-07-08'),
                        kgHaCorregido: base.kgHa * variacion,
                        humedadPct: base.humedad,
                        gie: base.gie,
                        // Campos nuevos
                        gramajePorGrano: base.gramaje,
                        granosPorurf: base.granos,
                        pesoGranosPorUrf: base.peso * variacion,
                        granosDanados: 4.2 - (tratamiento.numeroTrat * 0.5),
                        granosVerdes: 2.1 - (tratamiento.numeroTrat * 0.3),
                        granosVanos: 1.8 - (tratamiento.numeroTrat * 0.2),
                        hojasPorUrf: 4850 + (tratamiento.numeroTrat * 100),
                        larvasPorUrf: 12 - (tratamiento.numeroTrat - 1),
                        insectosBeneficiosPorUrf: 28 + (tratamiento.numeroTrat * 3),
                        diametroEspiga: 8.5 + (tratamiento.numeroTrat * 0.2),
                        alturaParcela: 75.2 + (tratamiento.numeroTrat * 0.5),
                        densidadPlantasFinal: 8.1 + (tratamiento.numeroTrat * 0.15),
                        observaciones: `Datos de prueba para T${tratamiento.numeroTrat}`,
                    });
                    yield datosCosechaRepo.save(datosCosecha);
                }
            }
            console.log(`  ✅ Seed completado: 1 ensayo, 3 bloques, ${tratamientos.length} tratamientos, ${numeroParc - 1} parcelas`);
            return ensayoGuardado;
        }
        catch (error) {
            console.error('❌ Error creando seed:', error);
            throw error;
        }
    });
}
