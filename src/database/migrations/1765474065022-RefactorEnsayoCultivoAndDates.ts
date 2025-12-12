import { MigrationInterface, QueryRunner } from "typeorm";

export class RefactorEnsayoCultivoAndDates1765474065022 implements MigrationInterface {
    name = 'RefactorEnsayoCultivoAndDates1765474065022'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Ensayo\` DROP COLUMN \`cultivo_especie\``);
        await queryRunner.query(`ALTER TABLE \`Ensayo\` DROP COLUMN \`cultivo_variedad\``);
        await queryRunner.query(`ALTER TABLE \`Ensayo\` DROP COLUMN \`tipo_siembra\``);
        await queryRunner.query(`ALTER TABLE \`Ensayo\` ADD \`fecha_inicio\` date NULL`);
        await queryRunner.query(`ALTER TABLE \`Ensayo\` ADD \`fecha_cosecha\` date NULL`);
        await queryRunner.query(`ALTER TABLE \`Ensayo\` ADD \`cultivo_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`Ensayo\` ADD \`variedad_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`Ensayo\` ADD \`tipo_siembra_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`Ensayo\` ADD CONSTRAINT \`FK_a3cd2008ba8bd551d193d2a1084\` FOREIGN KEY (\`cultivo_id\`) REFERENCES \`Cultivo\`(\`cultivo_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Ensayo\` ADD CONSTRAINT \`FK_c7cd836a6083e36e6f95897032a\` FOREIGN KEY (\`variedad_id\`) REFERENCES \`Cultivo_Variedad\`(\`variedad_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Ensayo\` ADD CONSTRAINT \`FK_465471de8f42aee0d3778c2429e\` FOREIGN KEY (\`tipo_siembra_id\`) REFERENCES \`TipoSiembra\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Ensayo\` DROP FOREIGN KEY \`FK_465471de8f42aee0d3778c2429e\``);
        await queryRunner.query(`ALTER TABLE \`Ensayo\` DROP FOREIGN KEY \`FK_c7cd836a6083e36e6f95897032a\``);
        await queryRunner.query(`ALTER TABLE \`Ensayo\` DROP FOREIGN KEY \`FK_a3cd2008ba8bd551d193d2a1084\``);
        await queryRunner.query(`ALTER TABLE \`Ensayo\` DROP COLUMN \`tipo_siembra_id\``);
        await queryRunner.query(`ALTER TABLE \`Ensayo\` DROP COLUMN \`variedad_id\``);
        await queryRunner.query(`ALTER TABLE \`Ensayo\` DROP COLUMN \`cultivo_id\``);
        await queryRunner.query(`ALTER TABLE \`Ensayo\` DROP COLUMN \`fecha_cosecha\``);
        await queryRunner.query(`ALTER TABLE \`Ensayo\` DROP COLUMN \`fecha_inicio\``);
        await queryRunner.query(`ALTER TABLE \`Ensayo\` ADD \`tipo_siembra\` varchar(50) NULL`);
        await queryRunner.query(`ALTER TABLE \`Ensayo\` ADD \`cultivo_variedad\` varchar(100) NULL`);
        await queryRunner.query(`ALTER TABLE \`Ensayo\` ADD \`cultivo_especie\` varchar(100) NULL`);
    }

}
