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
exports.RefactorEnsayoCultivoAndDates1765474065022 = void 0;
class RefactorEnsayoCultivoAndDates1765474065022 {
    constructor() {
        this.name = 'RefactorEnsayoCultivoAndDates1765474065022';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`Ensayo\` DROP COLUMN \`cultivo_especie\``);
            yield queryRunner.query(`ALTER TABLE \`Ensayo\` DROP COLUMN \`cultivo_variedad\``);
            yield queryRunner.query(`ALTER TABLE \`Ensayo\` DROP COLUMN \`tipo_siembra\``);
            yield queryRunner.query(`ALTER TABLE \`Ensayo\` ADD \`fecha_inicio\` date NULL`);
            yield queryRunner.query(`ALTER TABLE \`Ensayo\` ADD \`fecha_cosecha\` date NULL`);
            yield queryRunner.query(`ALTER TABLE \`Ensayo\` ADD \`cultivo_id\` int NULL`);
            yield queryRunner.query(`ALTER TABLE \`Ensayo\` ADD \`variedad_id\` int NULL`);
            yield queryRunner.query(`ALTER TABLE \`Ensayo\` ADD \`tipo_siembra_id\` int NULL`);
            yield queryRunner.query(`ALTER TABLE \`Ensayo\` ADD CONSTRAINT \`FK_a3cd2008ba8bd551d193d2a1084\` FOREIGN KEY (\`cultivo_id\`) REFERENCES \`Cultivo\`(\`cultivo_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE \`Ensayo\` ADD CONSTRAINT \`FK_c7cd836a6083e36e6f95897032a\` FOREIGN KEY (\`variedad_id\`) REFERENCES \`Cultivo_Variedad\`(\`variedad_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE \`Ensayo\` ADD CONSTRAINT \`FK_465471de8f42aee0d3778c2429e\` FOREIGN KEY (\`tipo_siembra_id\`) REFERENCES \`TipoSiembra\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`Ensayo\` DROP FOREIGN KEY \`FK_465471de8f42aee0d3778c2429e\``);
            yield queryRunner.query(`ALTER TABLE \`Ensayo\` DROP FOREIGN KEY \`FK_c7cd836a6083e36e6f95897032a\``);
            yield queryRunner.query(`ALTER TABLE \`Ensayo\` DROP FOREIGN KEY \`FK_a3cd2008ba8bd551d193d2a1084\``);
            yield queryRunner.query(`ALTER TABLE \`Ensayo\` DROP COLUMN \`tipo_siembra_id\``);
            yield queryRunner.query(`ALTER TABLE \`Ensayo\` DROP COLUMN \`variedad_id\``);
            yield queryRunner.query(`ALTER TABLE \`Ensayo\` DROP COLUMN \`cultivo_id\``);
            yield queryRunner.query(`ALTER TABLE \`Ensayo\` DROP COLUMN \`fecha_cosecha\``);
            yield queryRunner.query(`ALTER TABLE \`Ensayo\` DROP COLUMN \`fecha_inicio\``);
            yield queryRunner.query(`ALTER TABLE \`Ensayo\` ADD \`tipo_siembra\` varchar(50) NULL`);
            yield queryRunner.query(`ALTER TABLE \`Ensayo\` ADD \`cultivo_variedad\` varchar(100) NULL`);
            yield queryRunner.query(`ALTER TABLE \`Ensayo\` ADD \`cultivo_especie\` varchar(100) NULL`);
        });
    }
}
exports.RefactorEnsayoCultivoAndDates1765474065022 = RefactorEnsayoCultivoAndDates1765474065022;
