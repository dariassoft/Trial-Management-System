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
const core_1 = require("@nestjs/core");
const app_module_1 = require("../app.module");
const permisos_service_1 = require("../permisos/permisos.service");
const typeorm_1 = require("@nestjs/typeorm");
const rol_entity_1 = require("../entities/rol.entity");
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = yield core_1.NestFactory.create(app_module_1.AppModule);
        const permisosService = app.get(permisos_service_1.PermisosService);
        const rolRepository = app.get((0, typeorm_1.getRepositoryToken)(rol_entity_1.Rol));
        console.log('🔐 Iniciando creación de permisos por rol...');
        try {
            // Obtener todos los roles
            const roles = yield rolRepository.find();
            if (roles.length === 0) {
                console.log('❌ No hay roles en la base de datos');
                process.exit(1);
            }
            console.log(`✅ Encontrados ${roles.length} roles`);
            // Para cada rol, asignar permisos por defecto
            for (const rol of roles) {
                console.log(`\n📋 Procesando rol: ${rol.nombre}`);
                try {
                    const permisosCreados = yield permisosService.asignarPermisosDefault(rol.id);
                    console.log(`   ✅ ${permisosCreados.length} permisos asignados`);
                }
                catch (error) {
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    console.log(`   ⚠️  Error: ${errorMessage}`);
                }
            }
            console.log('\n✅ Permisos creados exitosamente');
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error('❌ Error al crear permisos:', errorMessage);
            process.exit(1);
        }
        yield app.close();
        process.exit(0);
    });
}
bootstrap();
