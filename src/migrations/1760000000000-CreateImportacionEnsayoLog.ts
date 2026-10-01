import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateImportacionEnsayoLog1760000000000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
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
    await queryRunner.createForeignKeys('importaciones_ensayo_log', [
      new TableForeignKey({ columnNames: ['ensayo_id'], referencedTableName: 'Ensayo', referencedColumnNames: ['ensayo_id'], onDelete: 'CASCADE' }),
      new TableForeignKey({ columnNames: ['usuario_id'], referencedTableName: 'Usuario', referencedColumnNames: ['usuario_id'], onDelete: 'RESTRICT' }),
    ]);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('importaciones_ensayo_log', true);
  }
}