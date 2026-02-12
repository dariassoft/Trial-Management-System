import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { PermisosService } from '../permisos/permisos.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Rol } from '../entities/rol.entity';
import { Repository } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const permisosService = app.get(PermisosService);
  const rolRepository = app.get<Repository<Rol>>(getRepositoryToken(Rol));

  console.log('🔐 Iniciando creación de permisos por rol...');

  try {
    // Obtener todos los roles
    const roles = await rolRepository.find();

    if (roles.length === 0) {
      console.log('❌ No hay roles en la base de datos');
      process.exit(1);
    }

    console.log(`✅ Encontrados ${roles.length} roles`);

    // Para cada rol, asignar permisos por defecto
    for (const rol of roles) {
      console.log(`\n📋 Procesando rol: ${rol.nombre}`);

      try {
        const permisosCreados = await permisosService.asignarPermisosDefault(rol.id);
        console.log(`   ✅ ${permisosCreados.length} permisos asignados`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.log(`   ⚠️  Error: ${errorMessage}`);
      }
    }

    console.log('\n✅ Permisos creados exitosamente');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Error al crear permisos:', errorMessage);
    process.exit(1);
  }

  await app.close();
  process.exit(0);
}

bootstrap();

