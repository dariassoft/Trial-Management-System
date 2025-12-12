import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoSiembra } from '../../entities/tipo-siembra.entity';
import { CreateTipoSiembraDto } from './dto/create-tipo-siembra.dto';

@Injectable()
export class TiposSiembraService {
  constructor(
    @InjectRepository(TipoSiembra)
    private readonly repository: Repository<TipoSiembra>,
  ) {}

  async create(dto: CreateTipoSiembraDto): Promise<TipoSiembra> {
    const newTipo = this.repository.create(dto);
    return this.repository.save(newTipo);
  }

  async findAll(): Promise<TipoSiembra[]> {
    return this.repository.find({ order: { nombre: 'ASC' } });
  }
}
