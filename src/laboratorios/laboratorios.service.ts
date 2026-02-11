import { Injectable, NotFoundException, BadRequestException, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { Role } from '../entities/rol.entity';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Laboratorio } from '../entities/laboratorio.entity';
import { CreateLaboratorioDto } from './dto/create-laboratorio.dto';
import { UpdateLaboratorioDto } from './dto/update-laboratorio.dto';

@Injectable({ scope: Scope.REQUEST })
export class LaboratoriosService {
  constructor(
    @Inject(REQUEST) private readonly req: Request,
    @InjectRepository(Laboratorio)
    private readonly repo: Repository<Laboratorio>,
  ) {}

  private get auth() {
    const user = (this.req as any)?.user as JwtPayload | undefined;
    const isInvitado = user?.rol === Role.INVITADO;
    const labIds = (user?.lab_ids || []) as number[];
    return { isInvitado, labIds };
  }

  async create(dto: CreateLaboratorioDto) {
    // Validar nombre único
    const existing = await this.repo.findOne({ where: { nombre: dto.nombre } });
    if (existing) {
      throw new BadRequestException('Ya existe un laboratorio con ese nombre');
    }

    const entity = this.repo.create({
      nombre: dto.nombre,
      descripcion: dto.descripcion ?? null,
      direccion: dto.direccion ?? null,
      telefono: dto.telefono ?? null,
      email: dto.email ?? null,
      contacto: dto.contacto ?? null,
      esta_activo: dto.esta_activo ?? true,
    });
    return this.repo.save(entity);
  }

  async findAll(query?: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'ASC'|'DESC';
    q?: string;
    activo?: boolean;
  }) {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 10;
    const sort = query?.sort ?? 'id';
    const order = (query?.order ?? 'ASC') as 'ASC'|'DESC';
    const { isInvitado, labIds } = this.auth;

    const qb = this.repo
      .createQueryBuilder('l')
      .leftJoinAndSelect('l.usuariosAsignados', 'ua')
      .leftJoinAndSelect('ua.usuario', 'u');

    // Búsqueda por nombre, descripción, email o contacto
    if (query?.q) {
      qb.where(
        'l.nombre LIKE :q OR l.descripcion LIKE :q OR l.email LIKE :q OR l.contacto LIKE :q',
        { q: `%${query.q}%` }
      );
    }

    // Filtro de estado activo
    if (query?.activo !== undefined) {
      qb.andWhere('l.esta_activo = :activo', { activo: query.activo });
    }

    // Restricción para invitados
    if (isInvitado && labIds.length > 0) {
      qb.andWhere('l.id IN (:...labIds)', { labIds });
    }

    qb.orderBy(`l.${sort}`, order);

    const [data, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        pageCount: Math.max(1, Math.ceil(total / limit))
      }
    };
  }

  async findOne(id: number) {
    const { isInvitado, labIds } = this.auth;

    const entity = await this.repo
      .createQueryBuilder('l')
      .leftJoinAndSelect('l.usuariosAsignados', 'ua')
      .leftJoinAndSelect('ua.usuario', 'u')
      .where('l.id = :id', { id })
      .getOne();

    if (!entity) {
      throw new NotFoundException(`Laboratorio ${id} no encontrado`);
    }

    // Validar acceso para invitados
    if (isInvitado && !labIds.includes(entity.id)) {
      throw new NotFoundException(`Laboratorio ${id} no encontrado`);
    }

    return entity;
  }

  async update(id: number, dto: UpdateLaboratorioDto) {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(`Laboratorio ${id} no encontrado`);
    }

    // Validar unicidad de nombre si se intenta cambiar
    if (dto.nombre && dto.nombre !== entity.nombre) {
      const existing = await this.repo.findOne({ where: { nombre: dto.nombre } });
      if (existing) {
        throw new BadRequestException('Ya existe un laboratorio con ese nombre');
      }
    }

    Object.assign(entity, dto);
    return this.repo.save(entity);
  }

  async remove(id: number) {
    const entity = await this.repo.findOne({
      where: { id },
      relations: ['usuariosAsignados']
    });

    if (!entity) {
      throw new NotFoundException(`Laboratorio ${id} no encontrado`);
    }

    // Validar que no tenga usuarios asignados
    if (entity.usuariosAsignados && entity.usuariosAsignados.length > 0) {
      throw new BadRequestException(
        `No se puede eliminar el laboratorio que tiene ${entity.usuariosAsignados.length} usuario(s) asignado(s)`
      );
    }

    await this.repo.delete(id);
    return { deleted: true };
  }
}
