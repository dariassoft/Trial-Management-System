import { Injectable, NotFoundException, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { Role } from '../entities/rol.entity';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bloque } from '../entities/bloque.entity';
import { CreateBloqueDto } from './dto/create-bloque.dto';
import { UpdateBloqueDto } from './dto/update-bloque.dto';

@Injectable({ scope: Scope.REQUEST })
export class BloquesService {
  constructor(
    @Inject(REQUEST) private readonly req: Request,
    @InjectRepository(Bloque)
    private readonly repo: Repository<Bloque>,
  ) {}

  private get auth() {
    const user = (this.req as any)?.user as JwtPayload | undefined;
    const isInvitado = user?.rol === Role.INVITADO;
    const labIds = (user?.lab_ids || []) as number[];
    return { isInvitado, labIds };
  }

  create(dto: CreateBloqueDto) {
    const entity = this.repo.create({
      ensayo: { id: dto.ensayoId } as any,
      nombreBloque: dto.nombreBloque,
    });
    return this.repo.save(entity);
  }

  findAll() {
    const { isInvitado, labIds } = this.auth;
    if (!isInvitado) {
      return this.repo.find({ relations: { ensayo: true } });
    }
    const qb = this.repo.createQueryBuilder('b')
      .leftJoinAndSelect('b.ensayo', 'e')
      .leftJoin('e.tratamientos', 't')
      .leftJoin('t.productos', 'tp')
      .leftJoin('tp.producto', 'p')
      .leftJoin('p.laboratorio', 'l')
      .where('l.id IN (:...labIds)', { labIds })
      .distinct(true);
    return qb.getMany();
  }

  async findOne(id: number) {
    const { isInvitado, labIds } = this.auth;
    if (!isInvitado) {
      const entity = await this.repo.findOne({ where: { id }, relations: { ensayo: true } });
      if (!entity) throw new NotFoundException(`Bloque ${id} no encontrado`);
      return entity;
    }
    const qb = this.repo.createQueryBuilder('b')
      .leftJoinAndSelect('b.ensayo', 'e')
      .leftJoin('e.tratamientos', 't')
      .leftJoin('t.productos', 'tp')
      .leftJoin('tp.producto', 'p')
      .leftJoin('p.laboratorio', 'l')
      .where('b.id = :id', { id })
      .andWhere('l.id IN (:...labIds)', { labIds })
      .distinct(true);
    const entity = await qb.getOne();
    if (!entity) throw new NotFoundException(`Bloque ${id} no encontrado`);
    return entity;
  }

  async update(id: number, dto: UpdateBloqueDto) {
    const partial: Partial<Bloque> = { nombreBloque: dto.nombreBloque } as any;
    if (dto.ensayoId !== undefined) {
      (partial as any).ensayo = { id: dto.ensayoId } as any;
    }
    await this.repo.update({ id }, partial);
    return this.findOne(id);
  }

  async remove(id: number) {
    const result = await this.repo.delete({ id });
    if (!result.affected) throw new NotFoundException(`Bloque ${id} no encontrado`);
    return { deleted: true };
  }
}
