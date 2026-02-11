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
exports.AddLaboratorioFields1707619600000 = void 0;
const typeorm_1 = require("typeorm");
class AddLaboratorioFields1707619600000 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // Agregar columnas a la tabla Laboratorio
            yield queryRunner.addColumn('Laboratorio', new typeorm_1.TableColumn({
                name: 'descripcion',
                type: 'text',
                isNullable: true,
                default: null,
            }));
            yield queryRunner.addColumn('Laboratorio', new typeorm_1.TableColumn({
                name: 'direccion',
                type: 'varchar',
                length: '255',
                isNullable: true,
                default: null,
            }));
            yield queryRunner.addColumn('Laboratorio', new typeorm_1.TableColumn({
                name: 'telefono',
                type: 'varchar',
                length: '50',
                isNullable: true,
                default: null,
            }));
            yield queryRunner.addColumn('Laboratorio', new typeorm_1.TableColumn({
                name: 'email',
                type: 'varchar',
                length: '100',
                isNullable: true,
                default: null,
            }));
            yield queryRunner.addColumn('Laboratorio', new typeorm_1.TableColumn({
                name: 'contacto',
                type: 'varchar',
                length: '100',
                isNullable: true,
                default: null,
            }));
            yield queryRunner.addColumn('Laboratorio', new typeorm_1.TableColumn({
                name: 'esta_activo',
                type: 'boolean',
                default: true,
            }));
            yield queryRunner.addColumn('Laboratorio', new typeorm_1.TableColumn({
                name: 'createdAt',
                type: 'timestamp',
                default: 'CURRENT_TIMESTAMP',
            }));
            yield queryRunner.addColumn('Laboratorio', new typeorm_1.TableColumn({
                name: 'updatedAt',
                type: 'timestamp',
                default: 'CURRENT_TIMESTAMP',
                onUpdate: 'CURRENT_TIMESTAMP',
            }));
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // Remover columnas si se revierte la migración
            yield queryRunner.dropColumn('Laboratorio', 'updatedAt');
            yield queryRunner.dropColumn('Laboratorio', 'createdAt');
            yield queryRunner.dropColumn('Laboratorio', 'esta_activo');
            yield queryRunner.dropColumn('Laboratorio', 'contacto');
            yield queryRunner.dropColumn('Laboratorio', 'email');
            yield queryRunner.dropColumn('Laboratorio', 'telefono');
            yield queryRunner.dropColumn('Laboratorio', 'direccion');
            yield queryRunner.dropColumn('Laboratorio', 'descripcion');
        });
    }
}
exports.AddLaboratorioFields1707619600000 = AddLaboratorioFields1707619600000;
