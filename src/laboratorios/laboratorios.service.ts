import { Injectable, NotFoundException, Scope, Inject } from '@nestjs/common';
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

  create(dto: CreateLaboratorioDto) {
    const entity = this.repo.create({ nombre: dto.nombre });
    return this.repo.save(entity);
  }

  async findAll(query?: { page?: number; limit?: number; sort?: string; order?: 'ASC'|'DESC'; q?: string }) {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 10;
    const sort = query?.sort ?? 'id';
    const order = (query?.order ?? 'ASC') as 'ASC'|'DESC';
    const { isInvitado, labIds } = this.auth;

    const qb = this.repo.createQueryBuilder('l');
    if (query?.q) qb.where('l.nombre LIKE :q', { q: `%${query.q}%` });
    if (isInvitado) qb.andWhere('l.id IN (:...labIds)', { labIds });

    const [data, total] = await qb
      .orderBy(`l.${sort}`, order)
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    return { data, meta: { total, page, limit, pageCount: Math.max(1, Math.ceil(total / limit)) } };
  }

  async findOne(id: number) {
    const { isInvitado, labIds } = this.auth;
    if (!isInvitado) {
      const entity = await this.repo.findOne({ where: { id } });
      if (!entity) throw new NotFoundException(`Laboratorio ${id} no encontrado`);
      return entity;
    }
    const entity = await this.repo.findOne({ where: { id: id as any } });
    if (!entity || !labIds.includes(entity.id)) throw new NotFoundException(`Laboratorio ${id} no encontrado`);
    return entity;
  }

  async update(id: number, dto: UpdateLaboratorioDto) {
    await this.repo.update({ id }, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const result = await this.repo.delete({ id });
    if (!result.affected) throw new NotFoundException(`Laboratorio ${id} no encontrado`);
    return { deleted: true };
  }
}
