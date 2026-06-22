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
exports.AddPesoMilSemillasToCosecha1746300000000 = void 0;
const typeorm_1 = require("typeorm");
class AddPesoMilSemillasToCosecha1746300000000 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield queryRunner.getTable('Datos_Cosecha');
            if (table) {
                const columnNames = table.columns.map(c => c.name);
                if (!columnNames.includes('peso_mil_semillas')) {
                    yield queryRunner.addColumn('Datos_Cosecha', new typeorm_1.TableColumn({
                        name: 'peso_mil_semillas',
                        type: 'decimal',
                        precision: 8,
                        scale: 2,
                        isNullable: true,
                        comment: 'Peso por 1000 semillas en gramos',
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
                if (columnNames.includes('peso_mil_semillas')) {
                    yield queryRunner.dropColumn('Datos_Cosecha', 'peso_mil_semillas');
                }
            }
        });
    }
}
exports.AddPesoMilSemillasToCosecha1746300000000 = AddPesoMilSemillasToCosecha1746300000000;
