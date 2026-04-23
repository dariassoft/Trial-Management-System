import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

/**
 * Migración: Agrega campos de peso de grano cosechado, humedad del grano y
 * superficie cosechada a la tabla Datos_Cosecha.
 *
 * - peso_grano_cosechado: Peso total del grano cosechado por parcela en gramos.
 * - humedad_grano_cosechado: Humedad del grano al momento de cosecha (%).
 * - superficie_cosechada_m2: Superficie cosechada en m² para extrapolación a kg/ha.
 *
 * El campo kg_ha_corregido se calcula dinámicamente en el frontend:
 *   1. Extrapolación: pesoKgHa = (peso_g / 1000) / superficie_m2 * 10000
 *   2. Corrección humedad: kgHa = pesoKgHa - (((humedad - 13.5)/(100-13.5))*100*pesoKgHa/100)
 * y se almacena en el campo existente kg_ha_corregido.
 */
export class AddPesoGranoHumedadCosecha1745280000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('Datos_Cosecha');

    if (table) {
      // Verificar que las columnas no existan antes de agregarlas
      const columnNames = table.columns.map(c => c.name);

      if (!columnNames.includes('peso_grano_cosechado')) {
        await queryRunner.addColumn(
          'Datos_Cosecha',
          new TableColumn({
            name: 'peso_grano_cosechado',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
            comment: 'Peso total del grano cosechado por parcela en gramos',
          }),
        );
      }

      if (!columnNames.includes('humedad_grano_cosechado')) {
        await queryRunner.addColumn(
          'Datos_Cosecha',
          new TableColumn({
            name: 'humedad_grano_cosechado',
            type: 'decimal',
            precision: 5,
            scale: 2,
            isNullable: true,
            comment: 'Humedad del grano al momento de cosecha (%)',
          }),
        );
      }

      if (!columnNames.includes('superficie_cosechada_m2')) {
        await queryRunner.addColumn(
          'Datos_Cosecha',
          new TableColumn({
            name: 'superficie_cosechada_m2',
            type: 'decimal',
            precision: 8,
            scale: 2,
            isNullable: true,
            comment: 'Superficie cosechada en m² (para extrapolación de peso a kg/ha)',
          }),
        );
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('Datos_Cosecha');

    if (table) {
      const columnNames = table.columns.map(c => c.name);

      if (columnNames.includes('superficie_cosechada_m2')) {
        await queryRunner.dropColumn('Datos_Cosecha', 'superficie_cosechada_m2');
      }
      if (columnNames.includes('humedad_grano_cosechado')) {
        await queryRunner.dropColumn('Datos_Cosecha', 'humedad_grano_cosechado');
      }
      if (columnNames.includes('peso_grano_cosechado')) {
        await queryRunner.dropColumn('Datos_Cosecha', 'peso_grano_cosechado');
      }
    }
  }
}

