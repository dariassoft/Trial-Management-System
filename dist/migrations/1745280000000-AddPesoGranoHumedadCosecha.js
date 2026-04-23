"use strict";
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
exports.AddPesoGranoHumedadCosecha1745280000000 = void 0;
const typeorm_1 = require("typeorm");
/**
 * Migración: Agrega campos de peso de grano cosechado, humedad del grano y
 * superficie cosechada a la tabla Datos_Cosecha.
 *
 * - peso_grano_cosechado: Peso total del grano cosechado por parcela en gramos.
 * - humedad_grano_cosechado: Humedad del grano al momento de cosecha (%).
 * - superficie_cosechada_m2: Superficie cosechada en m² para extrapolación a kg/ha.
 *
 * El campo kg_ha_corregido se calcula dinámicamente en el frontend:
 *   1. Extrapolación: pesoKgHa = (peso_g / 1000) / superficie_m2 * 10000
 *   2. Corrección humedad: kgHa = pesoKgHa - (((humedad - 13.5)/(100-13.5))*100*pesoKgHa/100)
 * y se almacena en el campo existente kg_ha_corregido.
 */
class AddPesoGranoHumedadCosecha1745280000000 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield queryRunner.getTable('Datos_Cosecha');
            if (table) {
                // Verificar que las columnas no existan antes de agregarlas
                const columnNames = table.columns.map(c => c.name);
                if (!columnNames.includes('peso_grano_cosechado')) {
                    yield queryRunner.addColumn('Datos_Cosecha', new typeorm_1.TableColumn({
                        name: 'peso_grano_cosechado',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                        isNullable: true,
                        comment: 'Peso total del grano cosechado por parcela en gramos',
                    }));
                }
                if (!columnNames.includes('humedad_grano_cosechado')) {
                    yield queryRunner.addColumn('Datos_Cosecha', new typeorm_1.TableColumn({
                        name: 'humedad_grano_cosechado',
                        type: 'decimal',
                        precision: 5,
                        scale: 2,
                        isNullable: true,
                        comment: 'Humedad del grano al momento de cosecha (%)',
                    }));
                }
                if (!columnNames.includes('superficie_cosechada_m2')) {
                    yield queryRunner.addColumn('Datos_Cosecha', new typeorm_1.TableColumn({
                        name: 'superficie_cosechada_m2',
                        type: 'decimal',
                        precision: 8,
                        scale: 2,
                        isNullable: true,
                        comment: 'Superficie cosechada en m² (para extrapolación de peso a kg/ha)',
                    }));
                }
            }
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield queryRunner.getTable('Datos_Cosecha');
            if (table) {
                const columnNames = table.columns.map(c => c.name);
                if (columnNames.includes('superficie_cosechada_m2')) {
                    yield queryRunner.dropColumn('Datos_Cosecha', 'superficie_cosechada_m2');
                }
                if (columnNames.includes('humedad_grano_cosechado')) {
                    yield queryRunner.dropColumn('Datos_Cosecha', 'humedad_grano_cosechado');
                }
                if (columnNames.includes('peso_grano_cosechado')) {
                    yield queryRunner.dropColumn('Datos_Cosecha', 'peso_grano_cosechado');
                }
            }
        });
    }
}
exports.AddPesoGranoHumedadCosecha1745280000000 = AddPesoGranoHumedadCosecha1745280000000;
