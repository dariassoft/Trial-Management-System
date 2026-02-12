import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permiso, AccionPermiso } from '../entities/permiso.entity';
import { Rol } from '../entities/rol.entity';
import { CreatePermisoDto } from './dto/create-permiso.dto';
import { UpdatePermisoDto } from './dto/update-permiso.dto';

@Injectable()
export class PermisosService {
  constructor(
    @InjectRepository(Permiso)
    private readonly permisoRepository: Repository<Permiso>,
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
  ) {}

  async create(dto: CreatePermisoDto) {
    // Verificar que el rol existe
    const rol = await this.rolRepository.findOne({ where: { id: dto.rol_id } });
    if (!rol) {
      throw new NotFoundException(`Rol con ID ${dto.rol_id} no encontrado`);
    }

    // Verificar que no existe un permiso duplicado
    const existente = await this.permisoRepository.findOne({
      where: {
        rol_id: dto.rol_id,
        recurso: dto.recurso,
        accion: dto.accion,
      },
    });

    if (existente) {
      throw new BadRequestException(
        `El rol ya tiene permiso para ${dto.accion} en ${dto.recurso}`,
      );
    }

    const permiso = this.permisoRepository.create({
      rol_id: dto.rol_id,
      recurso: dto.recurso,
      accion: dto.accion,
      descripcion: dto.descripcion ?? null,
      activo: dto.activo ?? true,
    });

    return this.permisoRepository.save(permiso);
  }

  async findAll(query?: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'ASC' | 'DESC';
    rol_id?: number;
    recurso?: string;
    accion?: AccionPermiso;
  }) {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 10;
    const sort = query?.sort ?? 'id';
    const order = (query?.order ?? 'ASC') as 'ASC' | 'DESC';

    const qb = this.permisoRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.rol', 'rol');

    if (query?.rol_id) {
      qb.andWhere('p.rol_id = :rol_id', { rol_id: query.rol_id });
    }

    if (query?.recurso) {
      qb.andWhere('p.recurso LIKE :recurso', { recurso: `%${query.recurso}%` });
    }

    if (query?.accion) {
      qb.andWhere('p.accion = :accion', { accion: query.accion });
    }

    const [data, total] = await qb
      .orderBy(`p.${sort}`, order)
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        pageCount: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async findOne(id: number) {
    const permiso = await this.permisoRepository.findOne({
      where: { id },
      relations: { rol: true },
    });

    if (!permiso) {
      throw new NotFoundException(`Permiso ${id} no encontrado`);
    }

    return permiso;
  }

  async findByRolId(rol_id: number) {
    return this.permisoRepository.find({
      where: { rol_id },
      relations: { rol: true },
    });
  }

  async hasPermiso(
    rol_id: number,
    recurso: string,
    accion: AccionPermiso,
  ): Promise<boolean> {
    const permiso = await this.permisoRepository.findOne({
      where: {
        rol_id,
        recurso,
        accion,
        activo: true,
      },
    });

    return !!permiso;
  }

  async update(id: number, dto: UpdatePermisoDto) {
    const permiso = await this.findOne(id);

    if (dto.rol_id && dto.rol_id !== permiso.rol_id) {
      const rol = await this.rolRepository.findOne({
        where: { id: dto.rol_id },
      });
      if (!rol) {
        throw new NotFoundException(`Rol con ID ${dto.rol_id} no encontrado`);
      }
    }

    // Actualizar manualmente en lugar de preload
    if (dto.rol_id !== undefined) permiso.rol_id = dto.rol_id;
    if (dto.recurso !== undefined) permiso.recurso = dto.recurso;
    if (dto.accion !== undefined) permiso.accion = dto.accion;
    if (dto.descripcion !== undefined) permiso.descripcion = dto.descripcion;
    if (dto.activo !== undefined) permiso.activo = dto.activo;

    return this.permisoRepository.save(permiso);
  }

  async remove(id: number) {
    const permiso = await this.findOne(id);
    return this.permisoRepository.remove(permiso);
  }

  async asignarPermisosDefault(rol_id: number) {
    const rol = await this.rolRepository.findOne({ where: { id: rol_id } });
    if (!rol) {
      throw new NotFoundException(`Rol con ID ${rol_id} no encontrado`);
    }

    // Definir permisos por defecto según el rol
    const permisosDefault = this.getPermisosDefault(rol.nombre);

    const permisosCreados = [];
    for (const { recurso, acciones } of permisosDefault) {
      for (const accion of acciones) {
        const existe = await this.permisoRepository.findOne({
          where: { rol_id, recurso, accion },
        });

        if (!existe) {
          const permiso = this.permisoRepository.create({
            rol_id,
            recurso,
            accion,
            activo: true,
          });
          const saved = await this.permisoRepository.save(permiso);
          permisosCreados.push(saved);
        }
      }
    }

    return permisosCreados;
  }

  async initAllPermisosDefault() {
    // Obtener todos los roles
    const roles = await this.rolRepository.find();

    if (roles.length === 0) {
      throw new NotFoundException('No hay roles en la base de datos');
    }

    let totalPermisosCreados = 0;

    // Para cada rol, asignar permisos por defecto
    for (const rol of roles) {
      const permisosCreados = await this.asignarPermisosDefault(rol.id);
      totalPermisosCreados += permisosCreados.length;
    }

    return {
      message: 'Permisos inicializados exitosamente',
      totalPermisosCreados,
      rolesProcessados: roles.length,
    };
  }

  private getPermisosDefault(
    rolNombre: string,
  ): { recurso: string; acciones: AccionPermiso[] }[] {
    const permisosMap: Record<string, { recurso: string; acciones: AccionPermiso[] }[]> = {
      'Superadministrador': [
        {
          recurso: 'laboratorios',
          acciones: [
            AccionPermiso.LISTAR,
            AccionPermiso.VER,
            AccionPermiso.CREAR,
            AccionPermiso.EDITAR,
            AccionPermiso.ELIMINAR,
            AccionPermiso.EXPORTAR,
          ],
        },
        {
          recurso: 'usuarios',
          acciones: [
            AccionPermiso.LISTAR,
            AccionPermiso.VER,
            AccionPermiso.CREAR,
            AccionPermiso.EDITAR,
            AccionPermiso.ELIMINAR,
            AccionPermiso.EXPORTAR,
          ],
        },
        {
          recurso: 'roles',
          acciones: [
            AccionPermiso.LISTAR,
            AccionPermiso.VER,
            AccionPermiso.CREAR,
            AccionPermiso.EDITAR,
            AccionPermiso.ELIMINAR,
          ],
        },
        {
          recurso: 'permisos',
          acciones: [
            AccionPermiso.LISTAR,
            AccionPermiso.VER,
            AccionPermiso.CREAR,
            AccionPermiso.EDITAR,
            AccionPermiso.ELIMINAR,
          ],
        },
        {
          recurso: 'productos',
          acciones: [
            AccionPermiso.LISTAR,
            AccionPermiso.VER,
            AccionPermiso.CREAR,
            AccionPermiso.EDITAR,
            AccionPermiso.ELIMINAR,
            AccionPermiso.EXPORTAR,
          ],
        },
        {
          recurso: 'cultivos',
          acciones: [
            AccionPermiso.LISTAR,
            AccionPermiso.VER,
            AccionPermiso.CREAR,
            AccionPermiso.EDITAR,
            AccionPermiso.ELIMINAR,
            AccionPermiso.EXPORTAR,
          ],
        },
        {
          recurso: 'variedades',
          acciones: [
            AccionPermiso.LISTAR,
            AccionPermiso.VER,
            AccionPermiso.CREAR,
            AccionPermiso.EDITAR,
            AccionPermiso.ELIMINAR,
          ],
        },
        {
          recurso: 'tipos-ensayo',
          acciones: [
            AccionPermiso.LISTAR,
            AccionPermiso.VER,
            AccionPermiso.CREAR,
            AccionPermiso.EDITAR,
            AccionPermiso.ELIMINAR,
          ],
        },
        {
          recurso: 'tipos-siembra',
          acciones: [
            AccionPermiso.LISTAR,
            AccionPermiso.VER,
            AccionPermiso.CREAR,
            AccionPermiso.EDITAR,
            AccionPermiso.ELIMINAR,
          ],
        },
        {
          recurso: 'ensayos',
          acciones: [
            AccionPermiso.LISTAR,
            AccionPermiso.VER,
            AccionPermiso.CREAR,
            AccionPermiso.EDITAR,
            AccionPermiso.ELIMINAR,
            AccionPermiso.EXPORTAR,
          ],
        },
      ],
      'Administrador': [
        {
          recurso: 'laboratorios',
          acciones: [
            AccionPermiso.LISTAR,
            AccionPermiso.VER,
            AccionPermiso.CREAR,
            AccionPermiso.EDITAR,
            AccionPermiso.ELIMINAR,
          ],
        },
        {
          recurso: 'usuarios',
          acciones: [
            AccionPermiso.LISTAR,
            AccionPermiso.VER,
            AccionPermiso.CREAR,
            AccionPermiso.EDITAR,
          ],
        },
        {
          recurso: 'permisos',
          acciones: [AccionPermiso.LISTAR, AccionPermiso.VER],
        },
        {
          recurso: 'productos',
          acciones: [
            AccionPermiso.LISTAR,
            AccionPermiso.VER,
            AccionPermiso.CREAR,
            AccionPermiso.EDITAR,
            AccionPermiso.ELIMINAR,
          ],
        },
        {
          recurso: 'cultivos',
          acciones: [
            AccionPermiso.LISTAR,
            AccionPermiso.VER,
            AccionPermiso.CREAR,
            AccionPermiso.EDITAR,
            AccionPermiso.ELIMINAR,
          ],
        },
        {
          recurso: 'variedades',
          acciones: [
            AccionPermiso.LISTAR,
            AccionPermiso.VER,
            AccionPermiso.CREAR,
            AccionPermiso.EDITAR,
            AccionPermiso.ELIMINAR,
          ],
        },
        {
          recurso: 'tipos-ensayo',
          acciones: [
            AccionPermiso.LISTAR,
            AccionPermiso.VER,
            AccionPermiso.CREAR,
            AccionPermiso.EDITAR,
            AccionPermiso.ELIMINAR,
          ],
        },
        {
          recurso: 'tipos-siembra',
          acciones: [
            AccionPermiso.LISTAR,
            AccionPermiso.VER,
            AccionPermiso.CREAR,
            AccionPermiso.EDITAR,
            AccionPermiso.ELIMINAR,
          ],
        },
        {
          recurso: 'ensayos',
          acciones: [
            AccionPermiso.LISTAR,
            AccionPermiso.VER,
            AccionPermiso.CREAR,
            AccionPermiso.EDITAR,
            AccionPermiso.ELIMINAR,
            AccionPermiso.EXPORTAR,
          ],
        },
      ],
      'Manager': [
        {
          recurso: 'productos',
          acciones: [
            AccionPermiso.LISTAR,
            AccionPermiso.VER,
            AccionPermiso.CREAR,
            AccionPermiso.EDITAR,
          ],
        },
        {
          recurso: 'ensayos',
          acciones: [
            AccionPermiso.LISTAR,
            AccionPermiso.VER,
            AccionPermiso.CREAR,
            AccionPermiso.EDITAR,
            AccionPermiso.EXPORTAR,
          ],
        },
        {
          recurso: 'cultivos',
          acciones: [AccionPermiso.LISTAR, AccionPermiso.VER],
        },
      ],
      'Tecnico': [
        {
          recurso: 'ensayos',
          acciones: [AccionPermiso.LISTAR, AccionPermiso.VER],
        },
        {
          recurso: 'productos',
          acciones: [AccionPermiso.LISTAR, AccionPermiso.VER],
        },
        {
          recurso: 'cultivos',
          acciones: [AccionPermiso.LISTAR, AccionPermiso.VER],
        },
      ],
      'Invitado': [
        {
          recurso: 'ensayos',
          acciones: [AccionPermiso.LISTAR, AccionPermiso.VER],
        },
      ],
    };

    return permisosMap[rolNombre] || [];
  }
}

