import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PermisosService } from '../../permisos/permisos.service';
import { AccionPermiso } from '../../entities/permiso.entity';
import { JwtPayload } from '../jwt-payload.interface';

@Injectable()
export class PermisosGuard implements CanActivate {
  constructor(private readonly permisosService: PermisosService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;

    if (!user || !user.rol_id) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    // Obtener recurso y acción del request
    const { recurso, accion } = this.extractRecursoAndAccion(request);

    if (!recurso || !accion) {
      // Si no se puede determinar, permitir (permisos opcionales)
      return true;
    }

    // Verificar si el usuario tiene el permiso
    const tienePermiso = await this.permisosService.hasPermiso(
      user.rol_id,
      recurso,
      accion as AccionPermiso,
    );

    if (!tienePermiso) {
      throw new ForbiddenException(
        `No tiene permiso para ${accion} en ${recurso}`,
      );
    }

    return true;
  }

  private extractRecursoAndAccion(request: any): {
    recurso?: string;
    accion?: AccionPermiso;
  } {
    const method = request.method;
    const path = request.path;

    // Mapear ruta a recurso
    const recurso = this.extractRecurso(path);

    // Mapear método HTTP a acción
    const accion = this.mapMethodToAccion(method);

    return { recurso, accion };
  }

  private extractRecurso(path: string): string | undefined {
    // /api/v1/laboratorios -> laboratorios
    // /api/v1/usuarios -> usuarios
    // /api/v1/productos -> productos
    // /api/v1/catalogos/cultivos -> cultivos
    // /api/v1/catalogos/variedades -> variedades
    // etc

    const parts = path.split('/').filter((p) => p && p !== 'api' && p !== 'v1');

    if (parts.length === 0) return undefined;

    // Si es /catalogos/cultivos, retornar 'cultivos'
    if (parts[0] === 'catalogos' && parts[1]) {
      return parts[1]; // cultivos, variedades, tipos-ensayo, tipos-siembra
    }

    // Si es /laboratorios, /usuarios, etc
    return parts[0];
  }

  private mapMethodToAccion(method: string): AccionPermiso | undefined {
    switch (method) {
      case 'GET':
        return AccionPermiso.VER; // O LISTAR si es un GET al root
      case 'POST':
        return AccionPermiso.CREAR;
      case 'PATCH':
      case 'PUT':
        return AccionPermiso.EDITAR;
      case 'DELETE':
        return AccionPermiso.ELIMINAR;
      default:
        return undefined;
    }
  }
}

