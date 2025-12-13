import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatusEnsayo } from '../entities/status-ensayo.entity';

@Injectable()
export class StatusEnsayoService {
  constructor(
    @InjectRepository(StatusEnsayo)
    private readonly statusRepository: Repository<StatusEnsayo>,
  ) {}

  async findAll(): Promise<StatusEnsayo[]> {
    return this.statusRepository.find({
      where: { activo: true },
      order: { id: 'ASC' },
    });
  }

  async findById(id: number): Promise<StatusEnsayo | null> {
    return this.statusRepository.findOne({
      where: { id },
    });
  }

  async create(nombre: string, descripcion?: string): Promise<StatusEnsayo> {
    const status = this.statusRepository.create({
      nombre,
      descripcion,
      activo: true,
    });
    return this.statusRepository.save(status);
  }

  async update(id: number, nombre?: string, descripcion?: string): Promise<StatusEnsayo | null> {
    await this.statusRepository.update(id, {
      ...(nombre && { nombre }),
      ...(descripcion && { descripcion }),
    });
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.statusRepository.update(id, { activo: false });
  }
}

