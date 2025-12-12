import { Injectable, NotFoundException, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { Role } from '../entities/rol.entity';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MomentoEvaluacion } from '../entities/momento-evaluacion.entity';
import { CreateMomentoDto } from './dto/create-momento.dto';
import { UpdateMomentoDto } from './dto/update-momento.dto';

@Injectable({ scope: Scope.REQUEST })
export class MomentosService {
  constructor(
    @Inject(REQUEST) private readonly req: Request,
    @InjectRepository(MomentoEvaluacion)
    private readonly repo: Repository<MomentoEvaluacion>,
  ) {}

  private get auth() {
    const user = (this.req as any)?.user as JwtPayload | undefined;
    const isInvitado = user?.rol === Role.INVITADO;
    const labIds = (user?.lab_ids || []) as number[];
    return { isInvitado, labIds };
  }

  create(dto: CreateMomentoDto) {
    const entity = this.repo.create({
      aplicacion: { id: dto.aplicacionId } as any,
      nombreMomento: dto.nombreMomento,
      diasDespuesAplicacion: dto.diasDespuesAplicacion,
      fechaEvaluacion: dto.fechaEvaluacion ? new Date(dto.fechaEvaluacion) : undefined,
    });
    return this.repo.save(entity);
  }

  findAll() {
    const { isInvitado, labIds } = this.auth;
    if (!isInvitado) {
      return this.repo.find({ relations: { aplicacion: true } });
    }
    const qb = this.repo.createQueryBuilder('m')
      .leftJoinAndSelect('m.aplicacion', 'a')
      .leftJoin('a.ensayo', 'e')
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
      const entity = await this.repo.findOne({ where: { id }, relations: { aplicacion: true } });
      if (!entity) throw new NotFoundException(`Momento ${id} no encontrado`);
      return entity;
    }
    const qb = this.repo.createQueryBuilder('m')
      .leftJoinAndSelect('m.aplicacion', 'a')
      .leftJoin('a.ensayo', 'e')
      .leftJoin('e.tratamientos', 't')
      .leftJoin('t.productos', 'tp')
      .leftJoin('tp.producto', 'p')
      .leftJoin('p.laboratorio', 'l')
      .where('m.id = :id', { id })
      .andWhere('l.id IN (:...labIds)', { labIds })
      .distinct(true);
    const entity = await qb.getOne();
    if (!entity) throw new NotFoundException(`Momento ${id} no encontrado`);
    return entity;
  }

  async update(id: number, dto: UpdateMomentoDto) {
    const partial: Partial<MomentoEvaluacion> = {
      nombreMomento: dto.nombreMomento,
      diasDespuesAplicacion: dto.diasDespuesAplicacion,
      fechaEvaluacion: dto.fechaEvaluacion ? new Date(dto.fechaEvaluacion) : undefined,
    } as any;
    if (dto.aplicacionId !== undefined) (partial as any).aplicacion = { id: dto.aplicacionId } as any;
    await this.repo.update({ id }, partial);
    return this.findOne(id);
  }

  async remove(id: number) {
    const result = await this.repo.delete({ id });
    if (!result.affected) throw new NotFoundException(`Momento ${id} no encontrado`);
    return { deleted: true };
  }
}
