import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddProductoFields1707620400000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'Producto',
      new TableColumn({
        name: 'descripcion',
        type: 'text',
        isNullable: true,
        default: null,
      }),
    );

    await queryRunner.addColumn(
      'Producto',
      new TableColumn({
        name: 'tipo',
        type: 'varchar',
        length: '100',
        isNullable: true,
        default: null,
      }),
    );

    await queryRunner.addColumn(
      'Producto',
      new TableColumn({
        name: 'unidad',
        type: 'varchar',
        length: '50',
        isNullable: true,
        default: null,
      }),
    );

    await queryRunner.addColumn(
      'Producto',
      new TableColumn({
        name: 'precio',
        type: 'decimal',
        precision: 10,
        scale: 2,
        isNullable: true,
        default: null,
      }),
    );

    await queryRunner.addColumn(
      'Producto',
      new TableColumn({
        name: 'createdAt',
        type: 'timestamp',
        default: 'CURRENT_TIMESTAMP',
      }),
    );

    await queryRunner.addColumn(
      'Producto',
      new TableColumn({
        name: 'updatedAt',
        type: 'timestamp',
        default: 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('Producto', 'updatedAt');
    await queryRunner.dropColumn('Producto', 'createdAt');
    await queryRunner.dropColumn('Producto', 'precio');
    await queryRunner.dropColumn('Producto', 'unidad');
    await queryRunner.dropColumn('Producto', 'tipo');
    await queryRunner.dropColumn('Producto', 'descripcion');
  }
}

