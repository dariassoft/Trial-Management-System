import { MigrationInterface, QueryRunner } from "typeorm";

export class AddResponsableToEnsayo1765461926925 implements MigrationInterface {
    name = 'AddResponsableToEnsayo1765461926925'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Protocolo_Variable\` DROP FOREIGN KEY \`FK_protocolo_variable_tipo_ensayo\``);
        await queryRunner.query(`ALTER TABLE \`Ensayo\` DROP FOREIGN KEY \`FK_ensayo_protocolo\``);
        await queryRunner.query(`ALTER TABLE \`Tratamiento\` DROP FOREIGN KEY \`FK_tratamiento_protocolo\``);
        await queryRunner.query(`DROP INDEX \`IDX_de6592c2fcc94bcc0ff33e50b3\` ON \`Ensayo\``);
        await queryRunner.query(`DROP INDEX \`UQ_Ensayo_nombreEnsayo_protocolo\` ON \`Ensayo\``);
        await queryRunner.query(`DROP INDEX \`nombre\` ON \`Protocolo\``);
        await queryRunner.query(`DROP INDEX \`UQ_tratamiento_protocolo_numeroTrat\` ON \`Tratamiento\``);
        await queryRunner.query(`ALTER TABLE \`Ensayo\` CHANGE \`responsable\` \`responsable_id\` varchar(100) NULL`);
        await queryRunner.query(`ALTER TABLE \`Ensayo\` DROP COLUMN \`responsable_id\``);
        await queryRunner.query(`ALTER TABLE \`Ensayo\` ADD \`responsable_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`Protocolo\` ADD UNIQUE INDEX \`IDX_b885f1923783bb300a49b72d34\` (\`nombre\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_85a4c4555815d27ae2067f9759\` ON \`Ensayo\` (\`nombre_ensayo\`, \`protocolo_id_fk\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_9c687c902b8a901c10a558799e\` ON \`Tratamiento\` (\`protocolo_id_fk\`, \`numero_trat\`)`);
        await queryRunner.query(`ALTER TABLE \`Protocolo_Variable\` ADD CONSTRAINT \`FK_b9c188d6dc0a1dcddfc033cc6f2\` FOREIGN KEY (\`tipo_ensayo_id_fk\`) REFERENCES \`Tipo_Ensayo\`(\`tipo_ensayo_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Ensayo\` ADD CONSTRAINT \`FK_984fd9df9512d2b06fc9044284b\` FOREIGN KEY (\`protocolo_id_fk\`) REFERENCES \`Protocolo\`(\`protocolo_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Ensayo\` ADD CONSTRAINT \`FK_14b312a6d1bb11c486721835ba4\` FOREIGN KEY (\`responsable_id\`) REFERENCES \`Usuario\`(\`usuario_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Tratamiento\` ADD CONSTRAINT \`FK_2228129acf36f8f9d5d6bdc9203\` FOREIGN KEY (\`protocolo_id_fk\`) REFERENCES \`Protocolo\`(\`protocolo_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Tratamiento\` DROP FOREIGN KEY \`FK_2228129acf36f8f9d5d6bdc9203\``);
        await queryRunner.query(`ALTER TABLE \`Ensayo\` DROP FOREIGN KEY \`FK_14b312a6d1bb11c486721835ba4\``);
        await queryRunner.query(`ALTER TABLE \`Ensayo\` DROP FOREIGN KEY \`FK_984fd9df9512d2b06fc9044284b\``);
        await queryRunner.query(`ALTER TABLE \`Protocolo_Variable\` DROP FOREIGN KEY \`FK_b9c188d6dc0a1dcddfc033cc6f2\``);
        await queryRunner.query(`DROP INDEX \`IDX_9c687c902b8a901c10a558799e\` ON \`Tratamiento\``);
        await queryRunner.query(`DROP INDEX \`IDX_85a4c4555815d27ae2067f9759\` ON \`Ensayo\``);
        await queryRunner.query(`ALTER TABLE \`Protocolo\` DROP INDEX \`IDX_b885f1923783bb300a49b72d34\``);
        await queryRunner.query(`ALTER TABLE \`Ensayo\` DROP COLUMN \`responsable_id\``);
        await queryRunner.query(`ALTER TABLE \`Ensayo\` ADD \`responsable_id\` varchar(100) NULL`);
        await queryRunner.query(`ALTER TABLE \`Ensayo\` CHANGE \`responsable_id\` \`responsable\` varchar(100) NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`UQ_tratamiento_protocolo_numeroTrat\` ON \`Tratamiento\` (\`protocolo_id_fk\`, \`numero_trat\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`nombre\` ON \`Protocolo\` (\`nombre\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`UQ_Ensayo_nombreEnsayo_protocolo\` ON \`Ensayo\` (\`nombre_ensayo\`, \`protocolo_id_fk\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_de6592c2fcc94bcc0ff33e50b3\` ON \`Ensayo\` (\`nombre_ensayo\`)`);
        await queryRunner.query(`ALTER TABLE \`Tratamiento\` ADD CONSTRAINT \`FK_tratamiento_protocolo\` FOREIGN KEY (\`protocolo_id_fk\`) REFERENCES \`Protocolo\`(\`protocolo_id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`Ensayo\` ADD CONSTRAINT \`FK_ensayo_protocolo\` FOREIGN KEY (\`protocolo_id_fk\`) REFERENCES \`Protocolo\`(\`protocolo_id\`) ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`Protocolo_Variable\` ADD CONSTRAINT \`FK_protocolo_variable_tipo_ensayo\` FOREIGN KEY (\`tipo_ensayo_id_fk\`) REFERENCES \`Tipo_Ensayo\`(\`tipo_ensayo_id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
