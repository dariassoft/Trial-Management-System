import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddTipoSiembraFields1707620800000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'TipoSiembra',
      new TableColumn({
        name: 'descripcion',
        type: 'text',
        isNullable: true,
        default: null,
      }),
    );

    await queryRunner.addColumn(
      'TipoSiembra',
      new TableColumn({
        name: 'esta_activo',
        type: 'boolean',
        default: true,
      }),
    );

    await queryRunner.addColumn(
      'TipoSiembra',
      new TableColumn({
        name: 'createdAt',
        type: 'timestamp',
        default: 'CURRENT_TIMESTAMP',
      }),
    );

    await queryRunner.addColumn(
      'TipoSiembra',
      new TableColumn({
        name: 'updatedAt',
        type: 'timestamp',
        default: 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('TipoSiembra', 'updatedAt');
    await queryRunner.dropColumn('TipoSiembra', 'createdAt');
    await queryRunner.dropColumn('TipoSiembra', 'esta_activo');
    await queryRunner.dropColumn('TipoSiembra', 'descripcion');
  }
}

