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
exports.AddCultivoFields1707620500000 = void 0;
const typeorm_1 = require("typeorm");
class AddCultivoFields1707620500000 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.addColumn('Cultivo', new typeorm_1.TableColumn({
                name: 'descripcion',
                type: 'text',
                isNullable: true,
                default: null,
            }));
            yield queryRunner.addColumn('Cultivo', new typeorm_1.TableColumn({
                name: 'ciclo_vegetativo',
                type: 'varchar',
                length: '100',
                isNullable: true,
                default: null,
            }));
            yield queryRunner.addColumn('Cultivo', new typeorm_1.TableColumn({
                name: 'esta_activo',
                type: 'boolean',
                default: true,
            }));
            yield queryRunner.addColumn('Cultivo', new typeorm_1.TableColumn({
                name: 'createdAt',
                type: 'timestamp',
                default: 'CURRENT_TIMESTAMP',
            }));
            yield queryRunner.addColumn('Cultivo', new typeorm_1.TableColumn({
                name: 'updatedAt',
                type: 'timestamp',
                default: 'CURRENT_TIMESTAMP',
                onUpdate: 'CURRENT_TIMESTAMP',
            }));
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.dropColumn('Cultivo', 'updatedAt');
            yield queryRunner.dropColumn('Cultivo', 'createdAt');
            yield queryRunner.dropColumn('Cultivo', 'esta_activo');
            yield queryRunner.dropColumn('Cultivo', 'ciclo_vegetativo');
            yield queryRunner.dropColumn('Cultivo', 'descripcion');
        });
    }
}
exports.AddCultivoFields1707620500000 = AddCultivoFields1707620500000;
