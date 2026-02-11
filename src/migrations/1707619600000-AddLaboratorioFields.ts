import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddLaboratorioFields1707619600000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Agregar columnas a la tabla Laboratorio
    await queryRunner.addColumn(
      'Laboratorio',
      new TableColumn({
        name: 'descripcion',
        type: 'text',
        isNullable: true,
        default: null,
      }),
    );

    await queryRunner.addColumn(
      'Laboratorio',
      new TableColumn({
        name: 'direccion',
        type: 'varchar',
        length: '255',
        isNullable: true,
        default: null,
      }),
    );

    await queryRunner.addColumn(
      'Laboratorio',
      new TableColumn({
        name: 'telefono',
        type: 'varchar',
        length: '50',
        isNullable: true,
        default: null,
      }),
    );

    await queryRunner.addColumn(
      'Laboratorio',
      new TableColumn({
        name: 'email',
        type: 'varchar',
        length: '100',
        isNullable: true,
        default: null,
      }),
    );

    await queryRunner.addColumn(
      'Laboratorio',
      new TableColumn({
        name: 'contacto',
        type: 'varchar',
        length: '100',
        isNullable: true,
        default: null,
      }),
    );

    await queryRunner.addColumn(
      'Laboratorio',
      new TableColumn({
        name: 'esta_activo',
        type: 'boolean',
        default: true,
      }),
    );

    await queryRunner.addColumn(
      'Laboratorio',
      new TableColumn({
        name: 'createdAt',
        type: 'timestamp',
        default: 'CURRENT_TIMESTAMP',
      }),
    );

    await queryRunner.addColumn(
      'Laboratorio',
      new TableColumn({
        name: 'updatedAt',
        type: 'timestamp',
        default: 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover columnas si se revierte la migración
    await queryRunner.dropColumn('Laboratorio', 'updatedAt');
    await queryRunner.dropColumn('Laboratorio', 'createdAt');
    await queryRunner.dropColumn('Laboratorio', 'esta_activo');
    await queryRunner.dropColumn('Laboratorio', 'contacto');
    await queryRunner.dropColumn('Laboratorio', 'email');
    await queryRunner.dropColumn('Laboratorio', 'telefono');
    await queryRunner.dropColumn('Laboratorio', 'direccion');
    await queryRunner.dropColumn('Laboratorio', 'descripcion');
  }
}

