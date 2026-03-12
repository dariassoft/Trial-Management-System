import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class AddUserToNotifications1710193000000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add notificationHour to Usuario table
        await queryRunner.addColumn("Usuario", new TableColumn({
            name: "notificationHour",
            type: "tinyint",
            isNullable: true,
            comment: "Hour of the day (0-23) for notifications",
        }));

        // Add usuario_id to notificaciones table
        await queryRunner.addColumn("notificaciones", new TableColumn({
            name: "usuario_id",
            type: "int",
        }));

        // Create foreign key
        await queryRunner.createForeignKey("notificaciones", new TableForeignKey({
            columnNames: ["usuario_id"],
            referencedColumnNames: ["usuario_id"],
            referencedTableName: "Usuario",
            onDelete: "CASCADE",
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("notificaciones");
        if (table) {
            const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf("usuario_id") !== -1);
            if (foreignKey) {
                await queryRunner.dropForeignKey("notificaciones", foreignKey);
            }
        }
        await queryRunner.dropColumn("notificaciones", "usuario_id");
        await queryRunner.dropColumn("Usuario", "notificationHour");
    }

}
