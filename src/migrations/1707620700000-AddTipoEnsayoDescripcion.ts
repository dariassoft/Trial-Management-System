import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddTipoEnsayoDescripcion1707620700000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'Tipo_Ensayo',
      new TableColumn({
        name: 'descripcion',
        type: 'text',
        isNullable: true,
        default: null,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('Tipo_Ensayo', 'descripcion');
  }
}

