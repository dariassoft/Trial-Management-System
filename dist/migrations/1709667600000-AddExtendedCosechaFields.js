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
exports.AddExtendedCosechaFields1709667600000 = void 0;
const typeorm_1 = require("typeorm");
class AddExtendedCosechaFields1709667600000 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield queryRunner.getTable('Datos_Cosecha');
            if (table) {
                // Agregar campos de gramaje y composición
                yield queryRunner.addColumn('Datos_Cosecha', new typeorm_1.TableColumn({
                    name: 'gramaje_por_grano',
                    type: 'decimal',
                    precision: 8,
                    scale: 6,
                    isNullable: true,
                    comment: 'Peso individual del grano en gramos',
                }));
                yield queryRunner.addColumn('Datos_Cosecha', new typeorm_1.TableColumn({
                    name: 'granos_porurf',
                    type: 'decimal',
                    precision: 10,
                    scale: 1,
                    isNullable: true,
                    comment: 'Cantidad de granos por metro cuadrado',
                }));
                yield queryRunner.addColumn('Datos_Cosecha', new typeorm_1.TableColumn({
                    name: 'peso_granos_porurf',
                    type: 'decimal',
                    precision: 8,
                    scale: 2,
                    isNullable: true,
                    comment: 'Peso total de granos por m² en gramos',
                }));
                yield queryRunner.addColumn('Datos_Cosecha', new typeorm_1.TableColumn({
                    name: 'granos_danados',
                    type: 'decimal',
                    precision: 5,
                    scale: 2,
                    isNullable: true,
                    comment: 'Porcentaje de granos dañados',
                }));
                yield queryRunner.addColumn('Datos_Cosecha', new typeorm_1.TableColumn({
                    name: 'granos_verdes',
                    type: 'decimal',
                    precision: 5,
                    scale: 2,
                    isNullable: true,
                    comment: 'Porcentaje de granos verdes',
                }));
                yield queryRunner.addColumn('Datos_Cosecha', new typeorm_1.TableColumn({
                    name: 'granos_vanos',
                    type: 'decimal',
                    precision: 5,
                    scale: 2,
                    isNullable: true,
                    comment: 'Porcentaje de granos vanos',
                }));
                // Agregar campos de mediciones de parcela
                yield queryRunner.addColumn('Datos_Cosecha', new typeorm_1.TableColumn({
                    name: 'hojas_porurf',
                    type: 'decimal',
                    precision: 10,
                    scale: 1,
                    isNullable: true,
                    comment: 'Cantidad de hojas por metro cuadrado',
                }));
                yield queryRunner.addColumn('Datos_Cosecha', new typeorm_1.TableColumn({
                    name: 'larvas_porurf',
                    type: 'decimal',
                    precision: 8,
                    scale: 2,
                    isNullable: true,
                    comment: 'Cantidad de larvas/plagas por m²',
                }));
                yield queryRunner.addColumn('Datos_Cosecha', new typeorm_1.TableColumn({
                    name: 'insectos_beneficios_porurf',
                    type: 'decimal',
                    precision: 8,
                    scale: 2,
                    isNullable: true,
                    comment: 'Cantidad de insectos benéficos por m²',
                }));
                yield queryRunner.addColumn('Datos_Cosecha', new typeorm_1.TableColumn({
                    name: 'diametro_espiga',
                    type: 'decimal',
                    precision: 5,
                    scale: 2,
                    isNullable: true,
                    comment: 'Diámetro de la espiga en mm',
                }));
                yield queryRunner.addColumn('Datos_Cosecha', new typeorm_1.TableColumn({
                    name: 'altura_parcela',
                    type: 'decimal',
                    precision: 5,
                    scale: 1,
                    isNullable: true,
                    comment: 'Altura de las plantas en cm',
                }));
                yield queryRunner.addColumn('Datos_Cosecha', new typeorm_1.TableColumn({
                    name: 'densidad_plantas_final',
                    type: 'decimal',
                    precision: 6,
                    scale: 2,
                    isNullable: true,
                    comment: 'Densidad final de plantas por m²',
                }));
            }
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield queryRunner.getTable('Datos_Cosecha');
            if (table) {
                // Revertir columnas en orden inverso
                yield queryRunner.dropColumn('Datos_Cosecha', 'densidad_plantas_final');
                yield queryRunner.dropColumn('Datos_Cosecha', 'altura_parcela');
                yield queryRunner.dropColumn('Datos_Cosecha', 'diametro_espiga');
                yield queryRunner.dropColumn('Datos_Cosecha', 'insectos_beneficios_porurf');
                yield queryRunner.dropColumn('Datos_Cosecha', 'larvas_porurf');
                yield queryRunner.dropColumn('Datos_Cosecha', 'hojas_porurf');
                yield queryRunner.dropColumn('Datos_Cosecha', 'granos_vanos');
                yield queryRunner.dropColumn('Datos_Cosecha', 'granos_verdes');
                yield queryRunner.dropColumn('Datos_Cosecha', 'granos_danados');
                yield queryRunner.dropColumn('Datos_Cosecha', 'peso_granos_porurf');
                yield queryRunner.dropColumn('Datos_Cosecha', 'granos_porurf');
                yield queryRunner.dropColumn('Datos_Cosecha', 'gramaje_por_grano');
            }
        });
    }
}
exports.AddExtendedCosechaFields1709667600000 = AddExtendedCosechaFields1709667600000;
