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
exports.AddMatrizParcelasToEnsayo1770832200000 = void 0;
class AddMatrizParcelasToEnsayo1770832200000 {
    constructor() {
        this.name = "AddMatrizParcelasToEnsayo1770832200000";
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verificar si las columnas ya existen
            const table = yield queryRunner.getTable("Ensayo");
            if (!(table === null || table === void 0 ? void 0 : table.findColumnByName("filas"))) {
                yield queryRunner.query(`ALTER TABLE \`Ensayo\` ADD \`filas\` int UNSIGNED NULL COMMENT "Número de filas en la matriz de parcelas"`);
            }
            if (!(table === null || table === void 0 ? void 0 : table.findColumnByName("columnas"))) {
                yield queryRunner.query(`ALTER TABLE \`Ensayo\` ADD \`columnas\` int UNSIGNED NULL COMMENT "Número de columnas en la matriz de parcelas"`);
            }
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield queryRunner.getTable("Ensayo");
            if (table === null || table === void 0 ? void 0 : table.findColumnByName("columnas")) {
                yield queryRunner.query(`ALTER TABLE \`Ensayo\` DROP COLUMN \`columnas\``);
            }
            if (table === null || table === void 0 ? void 0 : table.findColumnByName("filas")) {
                yield queryRunner.query(`ALTER TABLE \`Ensayo\` DROP COLUMN \`filas\``);
            }
        });
    }
}
exports.AddMatrizParcelasToEnsayo1770832200000 = AddMatrizParcelasToEnsayo1770832200000;
