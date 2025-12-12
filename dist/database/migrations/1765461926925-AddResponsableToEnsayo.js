"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddResponsableToEnsayo1765461926925 = void 0;
class AddResponsableToEnsayo1765461926925 {
    constructor() {
        this.name = 'AddResponsableToEnsayo1765461926925';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`Protocolo_Variable\` DROP FOREIGN KEY \`FK_protocolo_variable_tipo_ensayo\``);
            yield queryRunner.query(`ALTER TABLE \`Ensayo\` DROP FOREIGN KEY \`FK_ensayo_protocolo\``);
            yield queryRunner.query(`ALTER TABLE \`Tratamiento\` DROP FOREIGN KEY \`FK_tratamiento_protocolo\``);
            yield queryRunner.query(`DROP INDEX \`IDX_de6592c2fcc94bcc0ff33e50b3\` ON \`Ensayo\``);
            yield queryRunner.query(`DROP INDEX \`UQ_Ensayo_nombreEnsayo_protocolo\` ON \`Ensayo\``);
            yield queryRunner.query(`DROP INDEX \`nombre\` ON \`Protocolo\``);
            yield queryRunner.query(`DROP INDEX \`UQ_tratamiento_protocolo_numeroTrat\` ON \`Tratamiento\``);
            yield queryRunner.query(`ALTER TABLE \`Ensayo\` CHANGE \`responsable\` \`responsable_id\` varchar(100) NULL`);
            yield queryRunner.query(`ALTER TABLE \`Ensayo\` DROP COLUMN \`responsable_id\``);
            yield queryRunner.query(`ALTER TABLE \`Ensayo\` ADD \`responsable_id\` int NULL`);
            yield queryRunner.query(`ALTER TABLE \`Protocolo\` ADD UNIQUE INDEX \`IDX_b885f1923783bb300a49b72d34\` (\`nombre\`)`);
            yield queryRunner.query(`CREATE UNIQUE INDEX \`IDX_85a4c4555815d27ae2067f9759\` ON \`Ensayo\` (\`nombre_ensayo\`, \`protocolo_id_fk\`)`);
            yield queryRunner.query(`CREATE UNIQUE INDEX \`IDX_9c687c902b8a901c10a558799e\` ON \`Tratamiento\` (\`protocolo_id_fk\`, \`numero_trat\`)`);
            yield queryRunner.query(`ALTER TABLE \`Protocolo_Variable\` ADD CONSTRAINT \`FK_b9c188d6dc0a1dcddfc033cc6f2\` FOREIGN KEY (\`tipo_ensayo_id_fk\`) REFERENCES \`Tipo_Ensayo\`(\`tipo_ensayo_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE \`Ensayo\` ADD CONSTRAINT \`FK_984fd9df9512d2b06fc9044284b\` FOREIGN KEY (\`protocolo_id_fk\`) REFERENCES \`Protocolo\`(\`protocolo_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE \`Ensayo\` ADD CONSTRAINT \`FK_14b312a6d1bb11c486721835ba4\` FOREIGN KEY (\`responsable_id\`) REFERENCES \`Usuario\`(\`usuario_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE \`Tratamiento\` ADD CONSTRAINT \`FK_2228129acf36f8f9d5d6bdc9203\` FOREIGN KEY (\`protocolo_id_fk\`) REFERENCES \`Protocolo\`(\`protocolo_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`Tratamiento\` DROP FOREIGN KEY \`FK_2228129acf36f8f9d5d6bdc9203\``);
            yield queryRunner.query(`ALTER TABLE \`Ensayo\` DROP FOREIGN KEY \`FK_14b312a6d1bb11c486721835ba4\``);
            yield queryRunner.query(`ALTER TABLE \`Ensayo\` DROP FOREIGN KEY \`FK_984fd9df9512d2b06fc9044284b\``);
            yield queryRunner.query(`ALTER TABLE \`Protocolo_Variable\` DROP FOREIGN KEY \`FK_b9c188d6dc0a1dcddfc033cc6f2\``);
            yield queryRunner.query(`DROP INDEX \`IDX_9c687c902b8a901c10a558799e\` ON \`Tratamiento\``);
            yield queryRunner.query(`DROP INDEX \`IDX_85a4c4555815d27ae2067f9759\` ON \`Ensayo\``);
            yield queryRunner.query(`ALTER TABLE \`Protocolo\` DROP INDEX \`IDX_b885f1923783bb300a49b72d34\``);
            yield queryRunner.query(`ALTER TABLE \`Ensayo\` DROP COLUMN \`responsable_id\``);
            yield queryRunner.query(`ALTER TABLE \`Ensayo\` ADD \`responsable_id\` varchar(100) NULL`);
            yield queryRunner.query(`ALTER TABLE \`Ensayo\` CHANGE \`responsable_id\` \`responsable\` varchar(100) NULL`);
            yield queryRunner.query(`CREATE UNIQUE INDEX \`UQ_tratamiento_protocolo_numeroTrat\` ON \`Tratamiento\` (\`protocolo_id_fk\`, \`numero_trat\`)`);
            yield queryRunner.query(`CREATE UNIQUE INDEX \`nombre\` ON \`Protocolo\` (\`nombre\`)`);
            yield queryRunner.query(`CREATE UNIQUE INDEX \`UQ_Ensayo_nombreEnsayo_protocolo\` ON \`Ensayo\` (\`nombre_ensayo\`, \`protocolo_id_fk\`)`);
            yield queryRunner.query(`CREATE UNIQUE INDEX \`IDX_de6592c2fcc94bcc0ff33e50b3\` ON \`Ensayo\` (\`nombre_ensayo\`)`);
            yield queryRunner.query(`ALTER TABLE \`Tratamiento\` ADD CONSTRAINT \`FK_tratamiento_protocolo\` FOREIGN KEY (\`protocolo_id_fk\`) REFERENCES \`Protocolo\`(\`protocolo_id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
            yield queryRunner.query(`ALTER TABLE \`Ensayo\` ADD CONSTRAINT \`FK_ensayo_protocolo\` FOREIGN KEY (\`protocolo_id_fk\`) REFERENCES \`Protocolo\`(\`protocolo_id\`) ON DELETE SET NULL ON UPDATE CASCADE`);
            yield queryRunner.query(`ALTER TABLE \`Protocolo_Variable\` ADD CONSTRAINT \`FK_protocolo_variable_tipo_ensayo\` FOREIGN KEY (\`tipo_ensayo_id_fk\`) REFERENCES \`Tipo_Ensayo\`(\`tipo_ensayo_id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        });
    }
}
exports.AddResponsableToEnsayo1765461926925 = AddResponsableToEnsayo1765461926925;
