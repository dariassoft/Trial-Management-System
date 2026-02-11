import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddCultivoVariedadFields1707620600000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'Cultivo_Variedad',
      new TableColumn({
        name: 'descripcion',
        type: 'text',
        isNullable: true,
        default: null,
      }),
    );

    await queryRunner.addColumn(
      'Cultivo_Variedad',
      new TableColumn({
        name: 'caracteristicas',
        type: 'varchar',
        length: '100',
        isNullable: true,
        default: null,
      }),
    );

    await queryRunner.addColumn(
      'Cultivo_Variedad',
      new TableColumn({
        name: 'esta_activo',
        type: 'boolean',
        default: true,
      }),
    );

    await queryRunner.addColumn(
      'Cultivo_Variedad',
      new TableColumn({
        name: 'createdAt',
        type: 'timestamp',
        default: 'CURRENT_TIMESTAMP',
      }),
    );

    await queryRunner.addColumn(
      'Cultivo_Variedad',
      new TableColumn({
        name: 'updatedAt',
        type: 'timestamp',
        default: 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('Cultivo_Variedad', 'updatedAt');
    await queryRunner.dropColumn('Cultivo_Variedad', 'createdAt');
    await queryRunner.dropColumn('Cultivo_Variedad', 'esta_activo');
    await queryRunner.dropColumn('Cultivo_Variedad', 'caracteristicas');
    await queryRunner.dropColumn('Cultivo_Variedad', 'descripcion');
  }
}

