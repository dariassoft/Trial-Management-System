import { Injectable, NotFoundException, Scope, Inject, BadRequestException, ConflictException } from '@nestjs/common';
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

  async create(dto: CreateBloqueDto) {
    // Validar que el nombre no esté vacío
    if (!dto.nombreBloque || !dto.nombreBloque.trim()) {
      throw new BadRequestException('nombreBloque es requerido');
    }

    // Validar que ensayoId esté presente
    if (!dto.ensayoId) {
      throw new BadRequestException('ensayoId es requerido');
    }

    // Verificar si ya existe un bloque con este nombre para este ensayo
    const existente = await this.repo.findOne({
      where: {
        ensayo: { id: dto.ensayoId },
        nombreBloque: dto.nombreBloque.trim(),
      },
    });

    if (existente) {
      throw new ConflictException(
        `Ya existe un bloque con el nombre "${dto.nombreBloque}" para este ensayo`,
      );
    }

    try {
      const entity = this.repo.create({
        ensayo: { id: dto.ensayoId } as any,
        nombreBloque: dto.nombreBloque.trim(),
      });
      return await this.repo.save(entity);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(
          `Ya existe un bloque con el nombre "${dto.nombreBloque}" para este ensayo`,
        );
      }
      throw error;
    }
  }

  findAll(ensayoId?: number) {
    const { isInvitado, labIds } = this.auth;

    // Relaciones del ensayo a cargar (para tener codigoLabor, protocolo, laboratorio, tipoEnsayo)
    const ensayoRelations = {
      ensayo: {
        protocolo: true,
        laboratorio: true,
        tipoEnsayo: true,
      },
    };

    // Si viene ensayoId, filtrar por ese ensayo
    if (ensayoId) {
      if (!isInvitado) {
        return this.repo.find({
          where: { ensayo: { id: ensayoId } },
          relations: ensayoRelations,
          order: { nombreBloque: 'ASC' },
        });
      }

      const qb = this.repo.createQueryBuilder('b')
        .leftJoinAndSelect('b.ensayo', 'e')
        .leftJoinAndSelect('e.protocolo', 'protocolo')
        .leftJoinAndSelect('e.laboratorio', 'laboratorio')
        .leftJoinAndSelect('e.tipoEnsayo', 'tipoEnsayo')
        .leftJoin('e.tratamientos', 't')
        .leftJoin('t.productos', 'tp')
        .leftJoin('tp.producto', 'p')
        .leftJoin('p.laboratorio', 'l')
        .where('b.ensayo.id = :ensayoId', { ensayoId })
        .andWhere('l.id IN (:...labIds)', { labIds })
        .orderBy('b.nombreBloque', 'ASC')
        .distinct(true);
      return qb.getMany();
    }

    // Si no viene ensayoId, traer todos (comportamiento original)
    if (!isInvitado) {
      return this.repo.find({ relations: ensayoRelations, order: { nombreBloque: 'ASC' } });
    }

    const qb = this.repo.createQueryBuilder('b')
      .leftJoinAndSelect('b.ensayo', 'e')
      .leftJoinAndSelect('e.protocolo', 'protocolo')
      .leftJoinAndSelect('e.laboratorio', 'laboratorio')
      .leftJoinAndSelect('e.tipoEnsayo', 'tipoEnsayo')
      .leftJoin('e.tratamientos', 't')
      .leftJoin('t.productos', 'tp')
      .leftJoin('tp.producto', 'p')
      .leftJoin('p.laboratorio', 'l')
      .where('l.id IN (:...labIds)', { labIds })
      .orderBy('b.nombreBloque', 'ASC')
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
