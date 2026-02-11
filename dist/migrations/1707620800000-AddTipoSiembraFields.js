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
exports.AddTipoSiembraFields1707620800000 = void 0;
const typeorm_1 = require("typeorm");
class AddTipoSiembraFields1707620800000 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.addColumn('TipoSiembra', new typeorm_1.TableColumn({
                name: 'descripcion',
                type: 'text',
                isNullable: true,
                default: null,
            }));
            yield queryRunner.addColumn('TipoSiembra', new typeorm_1.TableColumn({
                name: 'esta_activo',
                type: 'boolean',
                default: true,
            }));
            yield queryRunner.addColumn('TipoSiembra', new typeorm_1.TableColumn({
                name: 'createdAt',
                type: 'timestamp',
                default: 'CURRENT_TIMESTAMP',
            }));
            yield queryRunner.addColumn('TipoSiembra', new typeorm_1.TableColumn({
                name: 'updatedAt',
                type: 'timestamp',
                default: 'CURRENT_TIMESTAMP',
                onUpdate: 'CURRENT_TIMESTAMP',
            }));
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.dropColumn('TipoSiembra', 'updatedAt');
            yield queryRunner.dropColumn('TipoSiembra', 'createdAt');
            yield queryRunner.dropColumn('TipoSiembra', 'esta_activo');
            yield queryRunner.dropColumn('TipoSiembra', 'descripcion');
        });
    }
}
exports.AddTipoSiembraFields1707620800000 = AddTipoSiembraFields1707620800000;
