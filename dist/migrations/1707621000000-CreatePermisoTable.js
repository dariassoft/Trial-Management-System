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
exports.CreatePermisoTable1707621000000 = void 0;
const typeorm_1 = require("typeorm");
class CreatePermisoTable1707621000000 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.createTable(new typeorm_1.Table({
                name: 'Permiso',
                columns: [
                    {
                        name: 'permiso_id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'rol_id_fk',
                        type: 'int',
                        isNullable: false,
                    },
                    {
                        name: 'recurso',
                        type: 'varchar',
                        length: '100',
                        isNullable: false,
                    },
                    {
                        name: 'accion',
                        type: 'varchar',
                        length: '20',
                        isNullable: false,
                    },
                    {
                        name: 'descripcion',
                        type: 'text',
                        isNullable: true,
                        default: null,
                    },
                    {
                        name: 'activo',
                        type: 'boolean',
                        default: true,
                    },
                    {
                        name: 'createdAt',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'updatedAt',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                        onUpdate: 'CURRENT_TIMESTAMP',
                    },
                ],
                foreignKeys: [
                    new typeorm_1.TableForeignKey({
                        columnNames: ['rol_id_fk'],
                        referencedColumnNames: ['rol_id'],
                        referencedTableName: 'Rol',
                        onDelete: 'CASCADE',
                    }),
                ],
            }), true);
            // Crear índices para búsquedas rápidas
            yield queryRunner.createIndex('Permiso', new typeorm_1.TableIndex({
                columnNames: ['rol_id_fk'],
                name: 'idx_permiso_rol',
            }));
            yield queryRunner.createIndex('Permiso', new typeorm_1.TableIndex({
                columnNames: ['rol_id_fk', 'recurso', 'accion'],
                name: 'idx_permiso_rol_recurso_accion',
                isUnique: true,
            }));
            yield queryRunner.createIndex('Permiso', new typeorm_1.TableIndex({
                columnNames: ['recurso'],
                name: 'idx_permiso_recurso',
            }));
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.dropTable('Permiso');
        });
    }
}
exports.CreatePermisoTable1707621000000 = CreatePermisoTable1707621000000;
