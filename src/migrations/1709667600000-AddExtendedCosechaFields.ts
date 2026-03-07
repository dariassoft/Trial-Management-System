import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddExtendedCosechaFields1709667600000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('Datos_Cosecha');

    if (table) {
      // Agregar campos de gramaje y composición
      await queryRunner.addColumn(
        'Datos_Cosecha',
        new TableColumn({
          name: 'gramaje_por_grano',
          type: 'decimal',
          precision: 8,
          scale: 6,
          isNullable: true,
          comment: 'Peso individual del grano en gramos',
        })
      );

      await queryRunner.addColumn(
        'Datos_Cosecha',
        new TableColumn({
          name: 'granos_porurf',
          type: 'decimal',
          precision: 10,
          scale: 1,
          isNullable: true,
          comment: 'Cantidad de granos por metro cuadrado',
        })
      );

      await queryRunner.addColumn(
        'Datos_Cosecha',
        new TableColumn({
          name: 'peso_granos_porurf',
          type: 'decimal',
          precision: 8,
          scale: 2,
          isNullable: true,
          comment: 'Peso total de granos por m² en gramos',
        })
      );

      await queryRunner.addColumn(
        'Datos_Cosecha',
        new TableColumn({
          name: 'granos_danados',
          type: 'decimal',
          precision: 5,
          scale: 2,
          isNullable: true,
          comment: 'Porcentaje de granos dañados',
        })
      );

      await queryRunner.addColumn(
        'Datos_Cosecha',
        new TableColumn({
          name: 'granos_verdes',
          type: 'decimal',
          precision: 5,
          scale: 2,
          isNullable: true,
          comment: 'Porcentaje de granos verdes',
        })
      );

      await queryRunner.addColumn(
        'Datos_Cosecha',
        new TableColumn({
          name: 'granos_vanos',
          type: 'decimal',
          precision: 5,
          scale: 2,
          isNullable: true,
          comment: 'Porcentaje de granos vanos',
        })
      );

      // Agregar campos de mediciones de parcela
      await queryRunner.addColumn(
        'Datos_Cosecha',
        new TableColumn({
          name: 'hojas_porurf',
          type: 'decimal',
          precision: 10,
          scale: 1,
          isNullable: true,
          comment: 'Cantidad de hojas por metro cuadrado',
        })
      );

      await queryRunner.addColumn(
        'Datos_Cosecha',
        new TableColumn({
          name: 'larvas_porurf',
          type: 'decimal',
          precision: 8,
          scale: 2,
          isNullable: true,
          comment: 'Cantidad de larvas/plagas por m²',
        })
      );

      await queryRunner.addColumn(
        'Datos_Cosecha',
        new TableColumn({
          name: 'insectos_beneficios_porurf',
          type: 'decimal',
          precision: 8,
          scale: 2,
          isNullable: true,
          comment: 'Cantidad de insectos benéficos por m²',
        })
      );

      await queryRunner.addColumn(
        'Datos_Cosecha',
        new TableColumn({
          name: 'diametro_espiga',
          type: 'decimal',
          precision: 5,
          scale: 2,
          isNullable: true,
          comment: 'Diámetro de la espiga en mm',
        })
      );

      await queryRunner.addColumn(
        'Datos_Cosecha',
        new TableColumn({
          name: 'altura_parcela',
          type: 'decimal',
          precision: 5,
          scale: 1,
          isNullable: true,
          comment: 'Altura de las plantas en cm',
        })
      );

      await queryRunner.addColumn(
        'Datos_Cosecha',
        new TableColumn({
          name: 'densidad_plantas_final',
          type: 'decimal',
          precision: 6,
          scale: 2,
          isNullable: true,
          comment: 'Densidad final de plantas por m²',
        })
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('Datos_Cosecha');

    if (table) {
      // Revertir columnas en orden inverso
      await queryRunner.dropColumn('Datos_Cosecha', 'densidad_plantas_final');
      await queryRunner.dropColumn('Datos_Cosecha', 'altura_parcela');
      await queryRunner.dropColumn('Datos_Cosecha', 'diametro_espiga');
      await queryRunner.dropColumn('Datos_Cosecha', 'insectos_beneficios_porurf');
      await queryRunner.dropColumn('Datos_Cosecha', 'larvas_porurf');
      await queryRunner.dropColumn('Datos_Cosecha', 'hojas_porurf');
      await queryRunner.dropColumn('Datos_Cosecha', 'granos_vanos');
      await queryRunner.dropColumn('Datos_Cosecha', 'granos_verdes');
      await queryRunner.dropColumn('Datos_Cosecha', 'granos_danados');
      await queryRunner.dropColumn('Datos_Cosecha', 'peso_granos_porurf');
      await queryRunner.dropColumn('Datos_Cosecha', 'granos_porurf');
      await queryRunner.dropColumn('Datos_Cosecha', 'gramaje_por_grano');
    }
  }
}

