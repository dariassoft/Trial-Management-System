import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cultivo } from '../../entities/cultivo.entity';
import { CultivoVariedad } from '../../entities/cultivo-variedad.entity';
import { CreateCultivoVariedadDto } from './dto/create-cultivo-variedad.dto';
import { UpdateCultivoVariedadDto } from './dto/update-cultivo-variedad.dto';

@Injectable()
export class CultivoVariedadesService {
  constructor(
    @InjectRepository(CultivoVariedad)
    private readonly variedadRepository: Repository<CultivoVariedad>,
    @InjectRepository(Cultivo)
    private readonly cultivoRepository: Repository<Cultivo>,
  ) {}

  async create(createDto: CreateCultivoVariedadDto): Promise<CultivoVariedad> {
    const { nombre, cultivo_id } = createDto;

    // Verificar que el cultivo padre exista
    const cultivo = await this.cultivoRepository.findOne({ where: { id: cultivo_id } });
    if (!cultivo) {
      throw new NotFoundException(`El Cultivo con ID #${cultivo_id} no existe`);
    }

    const nuevaVariedad = this.variedadRepository.create({
      nombre,
      cultivo,
      cultivo_id,
    });

    return this.variedadRepository.save(nuevaVariedad);
  }

  findAll(options: { page?: number; limit?: number; sort?: string; order?: 'ASC' | 'DESC'; q?: string; cultivoId?: number } = {}) {
    const { page = 1, limit = 10, sort = 'nombre', order = 'ASC', q, cultivoId } = options;
    const allowedSort = ['id', 'nombre'].includes(sort) ? sort : 'nombre';
    const skip = (page - 1) * limit;
    const qTrimmed = q?.trim();

    const qb = this.variedadRepository.createQueryBuilder('v').leftJoinAndSelect('v.cultivo', 'cultivo');
    if (qTrimmed) {
      qb.where('LOWER(v.nombre) LIKE LOWER(:q) OR LOWER(v.descripcion) LIKE LOWER(:q)', { q: `%${qTrimmed}%` });
    }
    if (cultivoId) {
      qb.andWhere('v.cultivo_id = :cultivoId', { cultivoId });
    }
    return qb.orderBy(`v.${allowedSort}`, order as 'ASC' | 'DESC').skip(skip).take(limit).getManyAndCount()
      .then(([data, total]) => ({ data, meta: { total, page, limit, pageCount: Math.ceil(total / limit) } }));
  }

  findOne(id: number) {
    return this.variedadRepository.findOne({ where: { id }, relations: ['cultivo'] });
  }

  async update(id: number, updateDto: UpdateCultivoVariedadDto) {
    const variedad = await this.variedadRepository.preload({ id, ...(updateDto as any) });
    if (!variedad) throw new NotFoundException(`Variedad con ID #${id} no encontrada`);

    if (updateDto.cultivo_id) {
      const cultivo = await this.cultivoRepository.findOne({ where: { id: updateDto.cultivo_id } });
      if (!cultivo) {
        throw new NotFoundException(`El Cultivo con ID #${updateDto.cultivo_id} no existe`);
      }
      variedad.cultivo = cultivo;
    }

    return this.variedadRepository.save(variedad);
  }

  async remove(id: number) {
    const variedad = await this.findOne(id);
    if (!variedad) throw new NotFoundException(`Variedad con ID #${id} no encontrada`);
    return this.variedadRepository.remove(variedad as any);
  }
}
