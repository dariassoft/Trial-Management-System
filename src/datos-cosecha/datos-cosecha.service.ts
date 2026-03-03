import { Injectable, NotFoundException, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { Role } from '../entities/rol.entity';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatosCosecha } from '../entities/datos-cosecha.entity';
import { CreateDatosCosechaDto } from './dto/create-datos-cosecha.dto';
import { UpdateDatosCosechaDto } from './dto/update-datos-cosecha.dto';

@Injectable({ scope: Scope.REQUEST })
export class DatosCosechaService {
  constructor(
    @Inject(REQUEST) private readonly req: Request,
    @InjectRepository(DatosCosecha)
    private readonly repo: Repository<DatosCosecha>,
  ) {}

  private get auth() {
    const user = (this.req as any)?.user as JwtPayload | undefined;
    const isInvitado = user?.rol === Role.INVITADO;
    const labIds = (user?.lab_ids || []) as number[];
    return { isInvitado, labIds };
  }

  create(dto: CreateDatosCosechaDto) {
    const entity = this.repo.create({
      parcela: { id: dto.parcelaId } as any,
      fechaCosecha: dto.fechaCosecha ? new Date(dto.fechaCosecha) : undefined,
      humedadPct: dto.humedadPct,
      kgHaCorregido: dto.kgHaCorregido,
      gie: dto.gie,
      observaciones: dto.observaciones,
    });
    return this.repo.save(entity);
  }

  findAll() {
    const { isInvitado, labIds } = this.auth;
    if (!isInvitado) {
      return this.repo.find({ relations: { parcela: true } });
    }
    const qb = this.repo.createQueryBuilder('dc')
      .leftJoinAndSelect('dc.parcela', 'parcela')
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
    const qb = this.repo.createQueryBuilder('dc')
      .leftJoinAndSelect('dc.parcela', 'parcela')
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
      if (!entity) throw new NotFoundException(`DatosCosecha ${id} no encontrado`);
      return entity;
    }
    const qb = this.repo.createQueryBuilder('dc')
      .leftJoinAndSelect('dc.parcela', 'parcela')
      .leftJoin('parcela.tratamiento', 'trat')
      .leftJoin('trat.productos', 'tp')
      .leftJoin('tp.producto', 'prod')
      .leftJoin('prod.laboratorio', 'lab')
      .where('dc.id = :id', { id })
      .andWhere('lab.id IN (:...labIds)', { labIds })
      .distinct(true);
    const entity = await qb.getOne();
    if (!entity) throw new NotFoundException(`DatosCosecha ${id} no encontrado`);
    return entity;
  }

  async update(id: number, dto: UpdateDatosCosechaDto) {
    const partial: Partial<DatosCosecha> = {
      fechaCosecha: dto.fechaCosecha ? new Date(dto.fechaCosecha) : undefined,
      humedadPct: dto.humedadPct,
      kgHaCorregido: dto.kgHaCorregido,
      gie: dto.gie,
      observaciones: dto.observaciones,
    } as any;
    if (dto.parcelaId !== undefined) (partial as any).parcela = { id: dto.parcelaId } as any;
    await this.repo.update({ id }, partial);
    return this.findOne(id);
  }

  async remove(id: number) {
    const result = await this.repo.delete({ id });
    if (!result.affected) throw new NotFoundException(`DatosCosecha ${id} no encontrado`);
    return { deleted: true };
  }
}
