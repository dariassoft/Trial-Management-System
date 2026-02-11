import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddCultivoFields1707620500000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'Cultivo',
      new TableColumn({
        name: 'descripcion',
        type: 'text',
        isNullable: true,
        default: null,
      }),
    );

    await queryRunner.addColumn(
      'Cultivo',
      new TableColumn({
        name: 'ciclo_vegetativo',
        type: 'varchar',
        length: '100',
        isNullable: true,
        default: null,
      }),
    );

    await queryRunner.addColumn(
      'Cultivo',
      new TableColumn({
        name: 'esta_activo',
        type: 'boolean',
        default: true,
      }),
    );

    await queryRunner.addColumn(
      'Cultivo',
      new TableColumn({
        name: 'createdAt',
        type: 'timestamp',
        default: 'CURRENT_TIMESTAMP',
      }),
    );

    await queryRunner.addColumn(
      'Cultivo',
      new TableColumn({
        name: 'updatedAt',
        type: 'timestamp',
        default: 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('Cultivo', 'updatedAt');
    await queryRunner.dropColumn('Cultivo', 'createdAt');
    await queryRunner.dropColumn('Cultivo', 'esta_activo');
    await queryRunner.dropColumn('Cultivo', 'ciclo_vegetativo');
    await queryRunner.dropColumn('Cultivo', 'descripcion');
  }
}

