import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Protocolo } from '../entities/protocolo.entity';
import { CreateProtocoloDto } from './dto/create-protocolo.dto';
import { UpdateProtocoloDto } from './dto/update-protocolo.dto';

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pageCount: number;
  };
}

@Injectable()
export class ProtocolosService {
  constructor(
    @InjectRepository(Protocolo)
    private readonly protocoloRepo: Repository<Protocolo>,
  ) {}

  async create(dto: CreateProtocoloDto): Promise<Protocolo> {
    const newProtocolo = this.protocoloRepo.create(dto);
    return this.protocoloRepo.save(newProtocolo);
  }

  /**
   * Obtener lista de protocolos con paginación, búsqueda y filtros
   */
  async findAll(params?: {
    page?: number | string;
    limit?: number | string;
    sort?: string;
    order?: 'ASC' | 'DESC';
    q?: string;
  }): Promise<PaginatedResponse<Protocolo>> {
    const page = params?.page ? parseInt(params.page as string) : 1;
    const limit = params?.limit ? parseInt(params.limit as string) : 10;
    const sort = params?.sort || 'nombre';
    const order = (params?.order || 'ASC') as 'ASC' | 'DESC';
    const searchQuery = params?.q || '';

    // Validación de parámetros
    const validPage = Math.max(1, page);
    const validLimit = Math.max(1, Math.min(100, limit));
    const validSort = ['id', 'nombre', 'descripcion', 'createdAt'].includes(sort) ? sort : 'nombre';

    // Construir query
    const qb = this.protocoloRepo.createQueryBuilder('p');

    // Búsqueda general
    if (searchQuery) {
      qb.where('LOWER(p.nombre) LIKE LOWER(:q)', { q: `%${searchQuery}%` })
        .orWhere('LOWER(p.descripcion) LIKE LOWER(:q)', { q: `%${searchQuery}%` });
    }

    // Contar total antes de paginar
    const total = await qb.getCount();
    const pageCount = Math.ceil(total / validLimit);

    // Aplicar ordenamiento y paginación
    qb.orderBy(`p.${validSort}`, order)
      .skip((validPage - 1) * validLimit)
      .take(validLimit);

    // Cargar protocolos con sus tratamientos
    const data = await qb
      .leftJoinAndSelect('p.tratamientos', 'tratamientos')
      .orderBy(`p.${validSort}`, order)
      .skip((validPage - 1) * validLimit)
      .take(validLimit)
      .getMany();

    return {
      data,
      meta: {
        total,
        page: validPage,
        limit: validLimit,
        pageCount,
      },
    };
  }

  async findOne(id: number): Promise<Protocolo> {
    const protocolo = await this.protocoloRepo.findOne({
      where: { id },
      relations: ['tratamientos'],
    });
    if (!protocolo) {
      throw new NotFoundException(`Protocolo con ID ${id} no encontrado.`);
    }
    return protocolo;
  }

  async update(id: number, dto: UpdateProtocoloDto): Promise<Protocolo> {
    const protocolo = await this.findOne(id);
    this.protocoloRepo.merge(protocolo, dto);
    return this.protocoloRepo.save(protocolo);
  }

  async remove(id: number): Promise<{ deleted: true }> {
    await this.findOne(id);
    await this.protocoloRepo.delete(id);
    return { deleted: true };
  }
}
