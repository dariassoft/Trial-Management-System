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
exports.AddProductoFields1707620400000 = void 0;
const typeorm_1 = require("typeorm");
class AddProductoFields1707620400000 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.addColumn('Producto', new typeorm_1.TableColumn({
                name: 'descripcion',
                type: 'text',
                isNullable: true,
                default: null,
            }));
            yield queryRunner.addColumn('Producto', new typeorm_1.TableColumn({
                name: 'tipo',
                type: 'varchar',
                length: '100',
                isNullable: true,
                default: null,
            }));
            yield queryRunner.addColumn('Producto', new typeorm_1.TableColumn({
                name: 'unidad',
                type: 'varchar',
                length: '50',
                isNullable: true,
                default: null,
            }));
            yield queryRunner.addColumn('Producto', new typeorm_1.TableColumn({
                name: 'precio',
                type: 'decimal',
                precision: 10,
                scale: 2,
                isNullable: true,
                default: null,
            }));
            yield queryRunner.addColumn('Producto', new typeorm_1.TableColumn({
                name: 'createdAt',
                type: 'timestamp',
                default: 'CURRENT_TIMESTAMP',
            }));
            yield queryRunner.addColumn('Producto', new typeorm_1.TableColumn({
                name: 'updatedAt',
                type: 'timestamp',
                default: 'CURRENT_TIMESTAMP',
                onUpdate: 'CURRENT_TIMESTAMP',
            }));
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.dropColumn('Producto', 'updatedAt');
            yield queryRunner.dropColumn('Producto', 'createdAt');
            yield queryRunner.dropColumn('Producto', 'precio');
            yield queryRunner.dropColumn('Producto', 'unidad');
            yield queryRunner.dropColumn('Producto', 'tipo');
            yield queryRunner.dropColumn('Producto', 'descripcion');
        });
    }
}
exports.AddProductoFields1707620400000 = AddProductoFields1707620400000;
