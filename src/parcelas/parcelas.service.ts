import { Injectable, NotFoundException, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { Role } from '../entities/rol.entity';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Parcela } from '../entities/parcela.entity';
import { CreateParcelaDto } from './dto/create-parcela.dto';
import { UpdateParcelaDto } from './dto/update-parcela.dto';

@Injectable({ scope: Scope.REQUEST })
export class ParcelasService {
  constructor(
    @Inject(REQUEST) private readonly req: Request,
    @InjectRepository(Parcela)
    private readonly repo: Repository<Parcela>,
  ) {}

  private get auth() {
    const user = (this.req as any)?.user as JwtPayload | undefined;
    const isInvitado = user?.rol === Role.INVITADO;
    const labIds = (user?.lab_ids || []) as number[];
    return { isInvitado, labIds };
  }

  create(dto: CreateParcelaDto) {
    const entity = this.repo.create({
      ensayo: { id: dto.ensayoId } as any,
      bloque: { id: dto.bloqueId } as any,
      tratamiento: { id: dto.tratamientoId } as any,
      nombreParcela: dto.nombreParcela,
      posXGrid: dto.posXGrid,
      posYGrid: dto.posYGrid,
    });
    return this.repo.save(entity);
  }

  findAll() {
    const { isInvitado, labIds } = this.auth;
    if (!isInvitado) {
      return this.repo.find({ relations: { ensayo: true, bloque: true, tratamiento: true } });
    }
    const qb = this.repo.createQueryBuilder('pa')
      .leftJoinAndSelect('pa.ensayo', 'ensayo')
      .leftJoinAndSelect('pa.bloque', 'bloque')
      .leftJoinAndSelect('pa.tratamiento', 'tratamiento')
      .leftJoin('tratamiento.productos', 'tp')
      .leftJoin('tp.producto', 'prod')
      .leftJoin('prod.laboratorio', 'lab')
      .where('lab.id IN (:...labIds)', { labIds })
      .distinct(true);
    return qb.getMany();
  }

  async findOne(id: number) {
    const { isInvitado, labIds } = this.auth;
    if (!isInvitado) {
      const entity = await this.repo.findOne({ where: { id }, relations: { ensayo: true, bloque: true, tratamiento: true } });
      if (!entity) throw new NotFoundException(`Parcela ${id} no encontrada`);
      return entity;
    }
    const qb = this.repo.createQueryBuilder('pa')
      .leftJoinAndSelect('pa.ensayo', 'ensayo')
      .leftJoinAndSelect('pa.bloque', 'bloque')
      .leftJoinAndSelect('pa.tratamiento', 'tratamiento')
      .leftJoin('tratamiento.productos', 'tp')
      .leftJoin('tp.producto', 'prod')
      .leftJoin('prod.laboratorio', 'lab')
      .where('pa.id = :id', { id })
      .andWhere('lab.id IN (:...labIds)', { labIds })
      .distinct(true);
    const entity = await qb.getOne();
    if (!entity) throw new NotFoundException(`Parcela ${id} no encontrada`);
    return entity;
  }

  async update(id: number, dto: UpdateParcelaDto) {
    const partial: Partial<Parcela> = {
      nombreParcela: dto.nombreParcela ?? undefined,
      posXGrid: dto.posXGrid ?? undefined,
      posYGrid: dto.posYGrid ?? undefined,
    } as any;
    if (dto.ensayoId !== undefined) (partial as any).ensayo = { id: dto.ensayoId } as any;
    if (dto.bloqueId !== undefined) (partial as any).bloque = { id: dto.bloqueId } as any;
    if (dto.tratamientoId !== undefined) (partial as any).tratamiento = { id: dto.tratamientoId } as any;
    await this.repo.update({ id }, partial);
    return this.findOne(id);
  }

  async remove(id: number) {
    const result = await this.repo.delete({ id });
    if (!result.affected) throw new NotFoundException(`Parcela ${id} no encontrada`);
    return { deleted: true };
  }
}
