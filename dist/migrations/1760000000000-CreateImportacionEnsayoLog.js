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
exports.CreateImportacionEnsayoLog1760000000000 = void 0;
const typeorm_1 = require("typeorm");
class CreateImportacionEnsayoLog1760000000000 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.createTable(new typeorm_1.Table({
                name: 'importaciones_ensayo_log',
                columns: [
                    { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                    { name: 'ensayo_id', type: 'int' },
                    { name: 'usuario_id', type: 'int' },
                    { name: 'hojasModificadas', type: 'int', default: 0 },
                    { name: 'resumen', type: 'text' },
                    { name: 'createdAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
                ],
            }), true);
            yield queryRunner.createForeignKeys('importaciones_ensayo_log', [
                new typeorm_1.TableForeignKey({ columnNames: ['ensayo_id'], referencedTableName: 'Ensayo', referencedColumnNames: ['ensayo_id'], onDelete: 'CASCADE' }),
                new typeorm_1.TableForeignKey({ columnNames: ['usuario_id'], referencedTableName: 'Usuario', referencedColumnNames: ['usuario_id'], onDelete: 'RESTRICT' }),
            ]);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.dropTable('importaciones_ensayo_log', true);
        });
    }
}
exports.CreateImportacionEnsayoLog1760000000000 = CreateImportacionEnsayoLog1760000000000;
