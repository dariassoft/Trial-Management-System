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
exports.AddUserToNotifications1710193000000 = void 0;
const typeorm_1 = require("typeorm");
class AddUserToNotifications1710193000000 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // Add notificationHour to Usuario table
            yield queryRunner.addColumn("Usuario", new typeorm_1.TableColumn({
                name: "notificationHour",
                type: "tinyint",
                isNullable: true,
                comment: "Hour of the day (0-23) for notifications",
            }));
            // Add usuario_id to notificaciones table
            yield queryRunner.addColumn("notificaciones", new typeorm_1.TableColumn({
                name: "usuario_id",
                type: "int",
            }));
            // Create foreign key
            yield queryRunner.createForeignKey("notificaciones", new typeorm_1.TableForeignKey({
                columnNames: ["usuario_id"],
                referencedColumnNames: ["usuario_id"],
                referencedTableName: "Usuario",
                onDelete: "CASCADE",
            }));
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield queryRunner.getTable("notificaciones");
            if (table) {
                const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf("usuario_id") !== -1);
                if (foreignKey) {
                    yield queryRunner.dropForeignKey("notificaciones", foreignKey);
                }
            }
            yield queryRunner.dropColumn("notificaciones", "usuario_id");
            yield queryRunner.dropColumn("Usuario", "notificationHour");
        });
    }
}
exports.AddUserToNotifications1710193000000 = AddUserToNotifications1710193000000;
