import { Injectable, NotFoundException, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { Role } from '../entities/rol.entity';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatosSiembra } from '../entities/datos-siembra.entity';
import { CreateDatosSiembraDto } from './dto/create-datos-siembra.dto';
import { UpdateDatosSiembraDto } from './dto/update-datos-siembra.dto';

@Injectable({ scope: Scope.REQUEST })
export class DatosSiembraService {
  constructor(
    @Inject(REQUEST) private readonly req: Request,
    @InjectRepository(DatosSiembra)
    private readonly repo: Repository<DatosSiembra>,
  ) {}

  private get auth() {
    const user = (this.req as any)?.user as JwtPayload | undefined;
    const isInvitado = user?.rol === Role.INVITADO;
    const labIds = (user?.lab_ids || []) as number[];
    return { isInvitado, labIds };
  }

  create(dto: CreateDatosSiembraDto) {
    const entity = this.repo.create({
      parcela: { id: dto.parcelaId } as any,
      fechaSiembra: dto.fechaSiembra ? new Date(dto.fechaSiembra) : undefined,
      semillasPorMetro: dto.semillasPorMetro,
      densidadSiembra: dto.densidadSiembra,
      germinacionPct: dto.germinacionPct,
      vigorPlantasEscala: dto.vigorPlantasEscala,
      observaciones: dto.observaciones,
    });
    return this.repo.save(entity);
  }

  findAll() {
    const { isInvitado, labIds } = this.auth;
    if (!isInvitado) {
      return this.repo.find({ relations: { parcela: true } });
    }
    const qb = this.repo.createQueryBuilder('ds')
      .leftJoinAndSelect('ds.parcela', 'parcela')
      .leftJoin('parcela.tratamiento', 'trat')
      .leftJoin('trat.productos', 'tp')
      .leftJoin('tp.producto', 'prod')
      .leftJoin('prod.laboratorio', 'lab')
      .where('lab.id IN (:...labIds)', { labIds })
      .distinct(true);
    return qb.getMany();
  }

  async findByParcelaId(parcelaId: number) {
    const { isInvitado, labIds } = this.auth;
    if (!isInvitado) {
      return this.repo.find({
        where: { parcela: { id: parcelaId } },
        relations: { parcela: true }
      });
    }
    const qb = this.repo.createQueryBuilder('ds')
      .leftJoinAndSelect('ds.parcela', 'parcela')
      .leftJoin('parcela.tratamiento', 'trat')
      .leftJoin('trat.productos', 'tp')
      .leftJoin('tp.producto', 'prod')
      .leftJoin('prod.laboratorio', 'lab')
      .where('parcela.id = :parcelaId', { parcelaId })
      .andWhere('lab.id IN (:...labIds)', { labIds })
      .distinct(true);
    return qb.getMany();
  }

  async findOne(id: number) {
    const { isInvitado, labIds } = this.auth;
    if (!isInvitado) {
      const entity = await this.repo.findOne({ where: { id }, relations: { parcela: true } });
      if (!entity) throw new NotFoundException(`DatosSiembra ${id} no encontrado`);
      return entity;
    }
    const qb = this.repo.createQueryBuilder('ds')
      .leftJoinAndSelect('ds.parcela', 'parcela')
      .leftJoin('parcela.tratamiento', 'trat')
      .leftJoin('trat.productos', 'tp')
      .leftJoin('tp.producto', 'prod')
      .leftJoin('prod.laboratorio', 'lab')
      .where('ds.id = :id', { id })
      .andWhere('lab.id IN (:...labIds)', { labIds })
      .distinct(true);
    const entity = await qb.getOne();
    if (!entity) throw new NotFoundException(`DatosSiembra ${id} no encontrado`);
    return entity;
  }

  async update(id: number, dto: UpdateDatosSiembraDto) {
    const partial: Partial<DatosSiembra> = {
      fechaSiembra: dto.fechaSiembra ? new Date(dto.fechaSiembra) : undefined,
      semillasPorMetro: dto.semillasPorMetro,
      densidadSiembra: dto.densidadSiembra,
      germinacionPct: dto.germinacionPct,
      vigorPlantasEscala: dto.vigorPlantasEscala,
      observaciones: dto.observaciones,
    } as any;
    if (dto.parcelaId !== undefined) (partial as any).parcela = { id: dto.parcelaId } as any;
    await this.repo.update({ id }, partial);
    return this.findOne(id);
  }

  async remove(id: number) {
    const result = await this.repo.delete({ id });
    if (!result.affected) throw new NotFoundException(`DatosSiembra ${id} no encontrado`);
    return { deleted: true };
  }
}

