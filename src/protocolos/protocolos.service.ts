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
    const isPaginated = params?.page !== undefined;
    const page = params?.page ? parseInt(params.page as string) : 1;
    const limit = params?.limit ? parseInt(params.limit as string) : 10;
    const sort = params?.sort || 'nombre';
    const order = (params?.order || 'ASC') as 'ASC' | 'DESC';
    const searchQuery = params?.q || '';

    // Validación de parámetros
    const validPage = Math.max(1, page);
    const validLimit = Math.max(1, Math.min(100, limit));
    const validSort = ['id', 'nombre', 'descripcion', 'createdAt'].includes(sort) ? sort : 'nombre';

    console.log('🔍 findAll() Búsqueda de protocolos:', { searchQuery, sort: validSort, order, page: validPage, limit: validLimit, isPaginated });

    // ============================================
    // QUERY 1: Contar total con filtros
    // ============================================
    const countQb = this.protocoloRepo.createQueryBuilder('p');

    if (searchQuery) {
      console.log('🔎 Aplicando filtro WHERE para búsqueda:', searchQuery);
      countQb.where('LOWER(p.nombre) LIKE LOWER(:q)', { q: `%${searchQuery}%` })
        .orWhere('LOWER(p.descripcion) LIKE LOWER(:q)', { q: `%${searchQuery}%` });
    }

    const total = await countQb.getCount();
    const pageCount = isPaginated ? Math.ceil(total / validLimit) : 1;
    console.log('📊 Total registros después de filtrar:', total);

    // ============================================
    // QUERY 2: Obtener datos con filtros + relaciones + orden + paginación
    // ============================================
    const dataQb = this.protocoloRepo.createQueryBuilder('p');

    // Aplicar los MISMOS filtros de búsqueda
    if (searchQuery) {
      dataQb.where('LOWER(p.nombre) LIKE LOWER(:q)', { q: `%${searchQuery}%` })
        .orWhere('LOWER(p.descripcion) LIKE LOWER(:q)', { q: `%${searchQuery}%` });
    }

    // Cargar relaciones
    dataQb.leftJoinAndSelect('p.tratamientos', 'tratamientos');

    // Aplicar ordenamiento
    console.log(`📊 Aplicando orden: p.${validSort} ${order}`);
    dataQb.orderBy(`p.${validSort}`, order);

    // Aplicar paginación si se especificó
    if (isPaginated) {
      const offset = (validPage - 1) * validLimit;
      console.log(`📄 Paginación: offset=${offset}, limit=${validLimit}`);
      dataQb.skip(offset).take(validLimit);
    }

    const data = await dataQb.getMany();
    console.log('✅ Protocolos devueltos:', data.length);

    return {
      data,
      meta: {
        total,
        page: isPaginated ? validPage : 1,
        limit: isPaginated ? validLimit : total,
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
