import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddPesoMilSemillasToCosecha1746300000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('Datos_Cosecha');

    if (table) {
      const columnNames = table.columns.map(c => c.name);

      if (!columnNames.includes('peso_mil_semillas')) {
        await queryRunner.addColumn(
          'Datos_Cosecha',
          new TableColumn({
            name: 'peso_mil_semillas',
            type: 'decimal',
            precision: 8,
            scale: 2,
            isNullable: true,
            comment: 'Peso por 1000 semillas en gramos',
          }),
        );
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('Datos_Cosecha');

    if (table) {
      const columnNames = table.columns.map(c => c.name);

      if (columnNames.includes('peso_mil_semillas')) {
        await queryRunner.dropColumn('Datos_Cosecha', 'peso_mil_semillas');
      }
    }
  }
}
