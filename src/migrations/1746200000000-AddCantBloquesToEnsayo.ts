import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddCantBloquesToEnsayo1746200000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('Ensayo');

    if (table) {
      const columnNames = table.columns.map(c => c.name);

      if (!columnNames.includes('cant_bloques')) {
        await queryRunner.addColumn(
          'Ensayo',
          new TableColumn({
            name: 'cant_bloques',
            type: 'int',
            unsigned: true,
            isNullable: true,
            comment: 'Cantidad de bloques planificados a crear en el ensayo',
          }),
        );
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('Ensayo');

    if (table) {
      const columnNames = table.columns.map(c => c.name);

      if (columnNames.includes('cant_bloques')) {
        await queryRunner.dropColumn('Ensayo', 'cant_bloques');
      }
    }
  }
}
