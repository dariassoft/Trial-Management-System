import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Rol } from '../entities/rol.entity';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Rol)
    private readonly repo: Repository<Rol>,
  ) {}

  async create(dto: CreateRolDto) {
    // Validar que el nombre sea único
    const existing = await this.repo.findOne({ where: { nombre: dto.nombre as any } });
    if (existing) {
      throw new BadRequestException('El nombre del rol ya existe');
    }

    const rol = this.repo.create({
      nombre: dto.nombre as any,
      descripcion: dto.descripcion ?? null,
    });
    return this.repo.save(rol);
  }

  async findAll(query?: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'ASC' | 'DESC';
    q?: string;
  }) {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 10;
    const sort = query?.sort ?? 'id';
    const order = (query?.order ?? 'ASC') as 'ASC' | 'DESC';

    const qb = this.repo
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.usuarios', 'u');

    // Búsqueda por nombre o descripción
    if (query?.q) {
      qb.where('r.nombre_rol LIKE :q OR r.descripcion LIKE :q', {
        q: `%${query.q}%`,
      });
    }

    qb.orderBy(`r.${sort}`, order);

    const [data, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    // Enriquecer con contador de usuarios
    const enriched = data.map((rol) => ({
      ...rol,
      usuariosCount: rol.usuarios?.length ?? 0,
    }));

    return {
      data: enriched,
      meta: {
        total,
        page,
        limit,
        pageCount: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async findOne(id: number) {
    const rol = await this.repo
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.usuarios', 'u')
      .where('r.rol_id = :id', { id })
      .getOne();

    if (!rol) {
      throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    }

    return {
      ...rol,
      usuariosCount: rol.usuarios?.length ?? 0,
    };
  }

  async update(id: number, dto: UpdateRolDto) {
    const rol = await this.repo.findOne({ where: { id } });
    if (!rol) {
      throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    }

    // Validar unicidad del nombre si se intenta cambiar
    if (dto.nombre && dto.nombre !== rol.nombre) {
      const existing = await this.repo.findOne({ where: { nombre: dto.nombre as any } });
      if (existing) {
        throw new BadRequestException('El nombre del rol ya existe');
      }
    }

    if (dto.nombre) rol.nombre = dto.nombre as any;
    if (dto.descripcion !== undefined) rol.descripcion = dto.descripcion ?? null;

    return this.repo.save(rol);
  }

  async remove(id: number) {
    const rol = await this.repo.findOne({
      where: { id },
      relations: ['usuarios'],
    });

    if (!rol) {
      throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    }

    // Validar que no tenga usuarios asignados
    if (rol.usuarios && rol.usuarios.length > 0) {
      throw new BadRequestException(
        `No se puede eliminar el rol con ${rol.usuarios.length} usuario(s) asignado(s)`,
      );
    }

    await this.repo.delete(id);
    return { deleted: true };
  }
}

