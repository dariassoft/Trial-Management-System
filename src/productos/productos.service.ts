import { Injectable, NotFoundException, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { Role } from '../entities/rol.entity';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from '../entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Injectable({ scope: Scope.REQUEST })
export class ProductosService {
  constructor(
    @Inject(REQUEST) private readonly req: Request,
    @InjectRepository(Producto)
    private readonly repo: Repository<Producto>,
  ) {}

  private get auth() {
    const user = (this.req as any)?.user as JwtPayload | undefined;
    const isInvitado = user?.rol === Role.INVITADO;
    const labIds = (user?.lab_ids || []) as number[];
    return { isInvitado, labIds };
  }

  async create(dto: CreateProductoDto) {
    const entity = this.repo.create({
      nombre_comercial: dto.nombre_comercial,
      principio_activo: dto.principio_activo,
      formulacion: dto.formulacion,
      laboratorio: dto.laboratorioId ? ({ id: dto.laboratorioId } as any) : undefined,
    });
    return this.repo.save(entity);
  }

  async findAll(query?: { page?: number; limit?: number; sort?: string; order?: 'ASC'|'DESC'; laboratorioId?: number; q?: string }) {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 10;
    const sort = query?.sort ?? 'id';
    const order = (query?.order ?? 'ASC') as 'ASC'|'DESC';
    const { isInvitado, labIds } = this.auth;

    const qb = this.repo.createQueryBuilder('p')
      .leftJoinAndSelect('p.laboratorio', 'laboratorio');
    if (query?.laboratorioId) qb.andWhere('laboratorio.id = :laboratorioId', { laboratorioId: query.laboratorioId });
    if (query?.q) qb.andWhere('(p.nombre_comercial LIKE :q OR p.principio_activo LIKE :q)', { q: `%${query.q}%` });
    if (isInvitado) qb.andWhere('laboratorio.id IN (:...labIds)', { labIds });

    const [data, total] = await qb
      .orderBy(`p.${sort}`, order)
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, meta: { total, page, limit, pageCount: Math.max(1, Math.ceil(total / limit)) } };
  }

  async findOne(id: number) {
    const { isInvitado, labIds } = this.auth;
    if (!isInvitado) {
      const entity = await this.repo.findOne({ where: { id }, relations: { laboratorio: true } });
      if (!entity) throw new NotFoundException(`Producto ${id} no encontrado`);
      return entity;
    }
    const qb = this.repo.createQueryBuilder('p')
      .leftJoinAndSelect('p.laboratorio', 'laboratorio')
      .where('p.id = :id', { id })
      .andWhere('laboratorio.id IN (:...labIds)', { labIds });
    const entity = await qb.getOne();
    if (!entity) throw new NotFoundException(`Producto ${id} no encontrado`);
    return entity;
  }

  async update(id: number, dto: UpdateProductoDto) {
    const partial: Partial<Producto> = {
      nombre_comercial: dto.nombre_comercial,
      principio_activo: dto.principio_activo,
      formulacion: dto.formulacion,
    };
    if (dto.laboratorioId !== undefined) {
      (partial as any).laboratorio = dto.laboratorioId === null ? null : ({ id: dto.laboratorioId } as any);
    }
    await this.repo.update({ id }, partial);
    return this.findOne(id);
  }

  async remove(id: number) {
    const result = await this.repo.delete({ id });
    if (!result.affected) throw new NotFoundException(`Producto ${id} no encontrado`);
    return { deleted: true };
  }
}
