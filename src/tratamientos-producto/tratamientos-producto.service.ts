import { Injectable, NotFoundException, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { Role } from '../entities/rol.entity';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TratamientoProducto } from '../entities/tratamiento-producto.entity';
import { CreateTratamientoProductoDto } from './dto/create-tratamiento-producto.dto';
import { UpdateTratamientoProductoDto } from './dto/update-tratamiento-producto.dto';

@Injectable({ scope: Scope.REQUEST })
export class TratamientosProductoService {
  constructor(
    @Inject(REQUEST) private readonly req: Request,
    @InjectRepository(TratamientoProducto)
    private readonly repo: Repository<TratamientoProducto>,
  ) {}

  private get auth() {
    const user = (this.req as any)?.user as JwtPayload | undefined;
    const isInvitado = user?.rol === Role.INVITADO;
    const labIds = (user?.lab_ids || []) as number[];
    return { isInvitado, labIds };
  }

  create(dto: CreateTratamientoProductoDto) {
    const entity = this.repo.create({
      tratamiento: { id: dto.tratamientoId } as any,
      producto: { id: dto.productoId } as any,
      dosis: dto.dosis,
      unidadDosis: dto.unidadDosis ?? 'cc/ha',
      estadio: dto.estadio,
    });
    return this.repo.save(entity);
  }

  findAll() {
    const { isInvitado, labIds } = this.auth;
    if (!isInvitado) {
      return this.repo.find({ relations: { tratamiento: true, producto: true } });
    }
    const qb = this.repo.createQueryBuilder('tp')
      .leftJoinAndSelect('tp.tratamiento', 'tratamiento')
      .leftJoinAndSelect('tp.producto', 'producto')
      .leftJoin('producto.laboratorio', 'lab')
      .where('lab.id IN (:...labIds)', { labIds })
      .distinct(true);
    return qb.getMany();
  }

  async findOne(id: number) {
    const { isInvitado, labIds } = this.auth;
    if (!isInvitado) {
      const entity = await this.repo.findOne({ where: { id }, relations: { tratamiento: true, producto: true } });
      if (!entity) throw new NotFoundException(`TratamientoProducto ${id} no encontrado`);
      return entity;
    }
    const qb = this.repo.createQueryBuilder('tp')
      .leftJoinAndSelect('tp.tratamiento', 'tratamiento')
      .leftJoinAndSelect('tp.producto', 'producto')
      .leftJoin('producto.laboratorio', 'lab')
      .where('tp.id = :id', { id })
      .andWhere('lab.id IN (:...labIds)', { labIds })
      .distinct(true);
    const entity = await qb.getOne();
    if (!entity) throw new NotFoundException(`TratamientoProducto ${id} no encontrado`);
    return entity;
  }

  async update(id: number, dto: UpdateTratamientoProductoDto) {
    const partial: Partial<TratamientoProducto> = {
      dosis: dto.dosis,
      unidadDosis: dto.unidadDosis,
      estadio: dto.estadio,
    } as any;
    if (dto.tratamientoId !== undefined) (partial as any).tratamiento = { id: dto.tratamientoId } as any;
    if (dto.productoId !== undefined) (partial as any).producto = { id: dto.productoId } as any;
    await this.repo.update({ id }, partial);
    return this.findOne(id);
  }

  async remove(id: number) {
    const result = await this.repo.delete({ id });
    if (!result.affected) throw new NotFoundException(`TratamientoProducto ${id} no encontrado`);
    return { deleted: true };
  }
}
