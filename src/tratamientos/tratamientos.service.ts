import { Injectable, NotFoundException, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { Role } from '../entities/rol.entity';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tratamiento } from '../entities/tratamiento.entity';
import { CreateTratamientoDto } from './dto/create-tratamiento.dto';
import { UpdateTratamientoDto } from './dto/update-tratamiento.dto';
import { Protocolo } from '../entities/protocolo.entity';

interface FindAllOptions {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
  q?: string;
  protocoloId?: number;
  esTestigo?: boolean;
}

@Injectable({ scope: Scope.REQUEST })
export class TratamientosService {
  constructor(
    @Inject(REQUEST) private readonly req: Request,
    @InjectRepository(Tratamiento)
    private readonly repo: Repository<Tratamiento>,
    @InjectRepository(Protocolo)
    private readonly protocoloRepo: Repository<Protocolo>,
  ) {}

  private get auth() {
    const user = (this.req as any)?.user as JwtPayload | undefined;
    const isInvitado = user?.rol === Role.INVITADO;
    const labIds = (user?.lab_ids || []) as number[];
    return { isInvitado, labIds };
  }

  async create(dto: CreateTratamientoDto) {
    const entity = this.repo.create({
      numeroTrat: dto.numeroTrat,
      descripcion: dto.descripcion,
      esTestigo: dto.esTestigo ?? false,
    });
    if (dto.protocoloId) {
      (entity as any).protocolo = { id: dto.protocoloId } as any;
    }
    return this.repo.save(entity);
  }

  async findAll(options: FindAllOptions = {}) {
    const {
      page = 1,
      limit = 10,
      sort = 'numeroTrat',
      order = 'ASC',
      q,
      protocoloId,
      esTestigo,
    } = options;

    const qb = this.repo.createQueryBuilder('t')
      .leftJoinAndSelect('t.protocolo', 'protocolo')
      .leftJoinAndSelect('t.productos', 'productos')
      .leftJoinAndSelect('productos.producto', 'producto');

    // Filtro por protocolo
    if (protocoloId) {
      qb.andWhere('t.protocolo.id = :protocoloId', { protocoloId });
    }

    // Filtro por si es testigo
    if (esTestigo !== undefined) {
      qb.andWhere('t.esTestigo = :esTestigo', { esTestigo });
    }

    // Búsqueda general
    if (q) {
      qb.andWhere(
        '(LOWER(t.descripcion) LIKE LOWER(:q) OR LOWER(protocolo.nombre) LIKE LOWER(:q))',
        { q: `%${q}%` },
      );
    }

    // Ordenamiento
    const allowedSorts = ['id', 'numeroTrat', 'descripcion', 'esTestigo', 'protocolo'];
    const sortColumn = allowedSorts.includes(sort) ? sort : 'numeroTrat';
    qb.orderBy(`t.${sortColumn}`, order);

    // Paginación
    const skip = (page - 1) * limit;
    qb.skip(skip).take(limit);

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
    const entity = await this.repo.findOne({
      where: { id },
      relations: {
        protocolo: true,
        productos: { producto: true },
      },
    });
    if (!entity) throw new NotFoundException(`Tratamiento ${id} no encontrado`);
    return entity;
  }

  async update(id: number, dto: UpdateTratamientoDto) {
    const partial: Partial<Tratamiento> = {
      numeroTrat: dto.numeroTrat,
      descripcion: dto.descripcion,
      esTestigo: dto.esTestigo,
    } as any;
    if (dto.protocoloId !== undefined) {
      (partial as any).protocolo = dto.protocoloId === null ? null : ({ id: dto.protocoloId } as any);
    }
    await this.repo.update({ id }, partial);
    return this.findOne(id);
  }

  async remove(id: number) {
    const result = await this.repo.delete({ id });
    if (!result.affected) throw new NotFoundException(`Tratamiento ${id} no encontrado`);
    return { deleted: true };
  }
}
