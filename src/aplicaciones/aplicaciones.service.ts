import { Injectable, NotFoundException, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { Role } from '../entities/rol.entity';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aplicacion } from '../entities/aplicacion.entity';
import { CreateAplicacionDto } from './dto/create-aplicacion.dto';
import { UpdateAplicacionDto } from './dto/update-aplicacion.dto';

@Injectable({ scope: Scope.REQUEST })
export class AplicacionesService {
  constructor(
    @Inject(REQUEST) private readonly req: Request,
    @InjectRepository(Aplicacion)
    private readonly repo: Repository<Aplicacion>,
  ) {}

  private get auth() {
    const user = (this.req as any)?.user as JwtPayload | undefined;
    const isInvitado = user?.rol === Role.INVITADO;
    const labIds = (user?.lab_ids || []) as number[];
    return { isInvitado, labIds };
  }

  create(dto: CreateAplicacionDto) {
    const entity = this.repo.create({
      ensayo: { id: dto.ensayoId } as any,
      nombreAplicacion: dto.nombreAplicacion,
      fechaHora: dto.fechaHora ? new Date(dto.fechaHora) : undefined,
      estadioCultivo: dto.estadioCultivo,
      tempC: dto.tempC,
      humedadPct: dto.humedadPct,
      vientoKmh: dto.vientoKmh,
      equipoInfo: dto.equipoInfo,
      picoInfo: dto.picoInfo,
      presionBar: dto.presionBar,
    });
    return this.repo.save(entity);
  }

  findAll() {
    const { isInvitado, labIds } = this.auth;
    if (!isInvitado) {
      return this.repo.find({ relations: { ensayo: true } });
    }
    const qb = this.repo.createQueryBuilder('a')
      .leftJoinAndSelect('a.ensayo', 'e')
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
      if (!entity) throw new NotFoundException(`Aplicacion ${id} no encontrada`);
      return entity;
    }
    const qb = this.repo.createQueryBuilder('a')
      .leftJoinAndSelect('a.ensayo', 'e')
      .leftJoin('e.tratamientos', 't')
      .leftJoin('t.productos', 'tp')
      .leftJoin('tp.producto', 'p')
      .leftJoin('p.laboratorio', 'l')
      .where('a.id = :id', { id })
      .andWhere('l.id IN (:...labIds)', { labIds })
      .distinct(true);
    const entity = await qb.getOne();
    if (!entity) throw new NotFoundException(`Aplicacion ${id} no encontrada`);
    return entity;
  }

  async update(id: number, dto: UpdateAplicacionDto) {
    const partial: Partial<Aplicacion> = {
      nombreAplicacion: dto.nombreAplicacion,
      fechaHora: dto.fechaHora ? new Date(dto.fechaHora) : undefined,
      estadioCultivo: dto.estadioCultivo,
      tempC: dto.tempC,
      humedadPct: dto.humedadPct,
      vientoKmh: dto.vientoKmh,
      equipoInfo: dto.equipoInfo,
      picoInfo: dto.picoInfo,
      presionBar: dto.presionBar,
    } as any;
    if (dto.ensayoId !== undefined) (partial as any).ensayo = { id: dto.ensayoId } as any;
    await this.repo.update({ id }, partial);
    return this.findOne(id);
  }

  async remove(id: number) {
    const result = await this.repo.delete({ id });
    if (!result.affected) throw new NotFoundException(`Aplicacion ${id} no encontrada`);
    return { deleted: true };
  }
}
