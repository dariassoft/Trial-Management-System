import { Injectable, NotFoundException, Scope, Inject, ConflictException } from '@nestjs/common';
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

  async create(dto: CreateParcelaDto) {
    try {
      const entity = this.repo.create({
        ensayo: { id: dto.ensayoId } as any,
        bloque: { id: dto.bloqueId } as any,
        tratamiento: { id: dto.tratamientoId } as any,
        nombreParcela: dto.nombreParcela,
        posXGrid: dto.posXGrid,
        posYGrid: dto.posYGrid,
      });
      return await this.repo.save(entity);
    } catch (error: any) {
      // Manejar error de clave duplicada
      if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
        if (error.sqlMessage?.includes('uq_parcela_ensayo_nombre')) {
          throw new ConflictException(`Ya existe una parcela con el nombre "${dto.nombreParcela}" en este ensayo. Por favor, usa un nombre diferente o ajusta las posiciones X/Y.`);
        }
        throw new ConflictException('Ya existe una parcela con estos datos. Verifica que no haya duplicados.');
      }
      throw error;
    }
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'ASC' | 'DESC';
    ensayoId?: number;
    bloqueId?: number;
  } = {}) {
    const { page = 1, limit = 10, sort = 'id', order = 'ASC', ensayoId, bloqueId } = params;
    const skip = (page - 1) * limit;

    const { isInvitado, labIds } = this.auth;

    const qb = this.repo.createQueryBuilder('pa')
      .leftJoinAndSelect('pa.ensayo', 'ensayo')
      .leftJoinAndSelect('pa.bloque', 'bloque')
      .leftJoinAndSelect('pa.tratamiento', 'tratamiento')
      .leftJoinAndSelect('pa.siembra', 'siembra')
      .leftJoinAndSelect('pa.cosecha', 'cosecha');

    if (isInvitado) {
      qb.leftJoin('tratamiento.productos', 'tp')
        .leftJoin('tp.producto', 'prod')
        .leftJoin('prod.laboratorio', 'lab')
        .where('lab.id IN (:...labIds)', { labIds });
    }

    if (ensayoId) {
      qb.andWhere('pa.ensayo.id = :ensayoId', { ensayoId });
    }
    if (bloqueId) {
      qb.andWhere('pa.bloque.id = :bloqueId', { bloqueId });
    }

    qb.orderBy(`pa.${sort}`, order as 'ASC' | 'DESC')
      .skip(skip)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();
    const pageCount = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        pageCount,
      },
    };
  }

  async findOne(id: number) {
    const { isInvitado, labIds } = this.auth;
    if (!isInvitado) {
      const entity = await this.repo.findOne({
        where: { id },
        relations: { ensayo: true, bloque: true, tratamiento: true, siembra: true, cosecha: true }
      });
      if (!entity) throw new NotFoundException(`Parcela ${id} no encontrada`);
      return entity;
    }
    const qb = this.repo.createQueryBuilder('pa')
      .leftJoinAndSelect('pa.ensayo', 'ensayo')
      .leftJoinAndSelect('pa.bloque', 'bloque')
      .leftJoinAndSelect('pa.tratamiento', 'tratamiento')
      .leftJoinAndSelect('pa.siembra', 'siembra')
      .leftJoinAndSelect('pa.cosecha', 'cosecha')
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
    try {
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
    } catch (error: any) {
      // Manejar error de clave duplicada
      if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
        if (error.sqlMessage?.includes('uq_parcela_ensayo_nombre')) {
          throw new ConflictException(`Ya existe una parcela con el nombre "${dto.nombreParcela}" en este ensayo. Por favor, usa un nombre diferente o ajusta las posiciones X/Y.`);
        }
        if (error.sqlMessage?.includes('posXGrid') || error.sqlMessage?.includes('posYGrid')) {
          throw new ConflictException(`La posición (${dto.posXGrid}, ${dto.posYGrid}) ya está ocupada en este bloque.`);
        }
        throw new ConflictException('Ya existe una parcela con estos datos. Verifica que no haya duplicados.');
      }
      throw error;
    }
  }

  async remove(id: number) {
    const result = await this.repo.delete({ id });
    if (!result.affected) throw new NotFoundException(`Parcela ${id} no encontrada`);
    return { deleted: true };
  }
}
