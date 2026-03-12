import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateNotificacionesTable1710192000000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "notificaciones",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "titulo",
                    type: "varchar",
                },
                {
                    name: "descripcion",
                    type: "text",
                },
                {
                    name: "leido",
                    type: "boolean",
                    default: false,
                },
                {
                    name: "createdAt",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP",
                },
                {
                    name: "link",
                    type: "varchar",
                    isNullable: true,
                },
            ],
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("notificaciones");
    }

}
