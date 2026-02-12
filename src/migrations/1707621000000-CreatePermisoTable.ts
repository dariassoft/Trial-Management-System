import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreatePermisoTable1707621000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
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
          new TableForeignKey({
            columnNames: ['rol_id_fk'],
            referencedColumnNames: ['rol_id'],
            referencedTableName: 'Rol',
            onDelete: 'CASCADE',
          }),
        ],
      }),
      true,
    );

    // Crear índices para búsquedas rápidas
    await queryRunner.createIndex(
      'Permiso',
      new TableIndex({
        columnNames: ['rol_id_fk'],
        name: 'idx_permiso_rol',
      }),
    );

    await queryRunner.createIndex(
      'Permiso',
      new TableIndex({
        columnNames: ['rol_id_fk', 'recurso', 'accion'],
        name: 'idx_permiso_rol_recurso_accion',
        isUnique: true,
      }),
    );

    await queryRunner.createIndex(
      'Permiso',
      new TableIndex({
        columnNames: ['recurso'],
        name: 'idx_permiso_recurso',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('Permiso');
  }
}

