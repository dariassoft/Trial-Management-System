import { MigrationInterface, QueryRunner } from "typeorm";
export class AddMatrizParcelasToEnsayo1770832200000 implements MigrationInterface {
    name = "AddMatrizParcelasToEnsayo1770832200000"
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Verificar si las columnas ya existen
        const table = await queryRunner.getTable("Ensayo");
        if (!table?.findColumnByName("filas")) {
            await queryRunner.query(`ALTER TABLE \`Ensayo\` ADD \`filas\` int UNSIGNED NULL COMMENT "Número de filas en la matriz de parcelas"`);
        }
        if (!table?.findColumnByName("columnas")) {
            await queryRunner.query(`ALTER TABLE \`Ensayo\` ADD \`columnas\` int UNSIGNED NULL COMMENT "Número de columnas en la matriz de parcelas"`);
        }
    }
    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("Ensayo");
        if (table?.findColumnByName("columnas")) {
            await queryRunner.query(`ALTER TABLE \`Ensayo\` DROP COLUMN \`columnas\``);
        }
        if (table?.findColumnByName("filas")) {
            await queryRunner.query(`ALTER TABLE \`Ensayo\` DROP COLUMN \`filas\``);
        }
    }
}
