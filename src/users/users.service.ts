import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository, SelectQueryBuilder } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { Rol } from '../entities/rol.entity';
import { UsuarioLaboratorio } from '../entities/usuario-laboratorio.entity';
import { Laboratorio } from '../entities/laboratorio.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

function sanitizeUser(u: Usuario): any {
  if (!u) return u as any;
  const clone: any = { ...u };
  delete clone.password;
  return clone;
}

@Injectable()
export class UsersService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Usuario) private readonly userRepo: Repository<Usuario>,
    @InjectRepository(Rol) private readonly rolRepo: Repository<Rol>,
    @InjectRepository(UsuarioLaboratorio) private readonly ulRepo: Repository<UsuarioLaboratorio>,
    @InjectRepository(Laboratorio) private readonly labRepo: Repository<Laboratorio>,
  ) {}

  async create(dto: CreateUserDto) {
    // Validar username único
    const existing = await this.userRepo.findOne({ where: { username: dto.username } });
    if (existing) throw new BadRequestException('El username ya está en uso');

    const rol = await this.rolRepo.findOne({ where: { id: dto.rolId } });
    if (!rol) throw new BadRequestException('Rol inválido');

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = this.userRepo.create({
        username: dto.username,
        password: dto.password, // será hasheado por hooks de entidad
        rol,
        nombre: dto.nombre ?? null,
        apellido: dto.apellido ?? null,
        telefono: dto.telefono,
        fecha_nacimiento: dto.fecha_nacimiento ? (new Date(dto.fecha_nacimiento) as any) : null,
        esta_activo: dto.esta_activo ?? true,
      });
      const saved = await queryRunner.manager.save(user);

      // Asignar laboratorios si vienen
      if (dto.laboratorioIds && dto.laboratorioIds.length > 0) {
        // Validar existencia
        const labs = await this.labRepo.find({ where: { id: In(dto.laboratorioIds) } });
        const labIdsFound = new Set(labs.map((l) => l.id));
        const notFound = dto.laboratorioIds.filter((id) => !labIdsFound.has(id));
        if (notFound.length) throw new BadRequestException(`Laboratorios inexistentes: ${notFound.join(',')}`);

        // Evitar duplicados
        const mappings: UsuarioLaboratorio[] = [];
        for (const lab of labs) {
          const ul = this.ulRepo.create({ usuario: saved, laboratorio: lab });
          mappings.push(ul);
        }
        if (mappings.length) await queryRunner.manager.save(UsuarioLaboratorio, mappings);
      }

      await queryRunner.commitTransaction();

      return this.findOne(saved.id);
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  private baseQb(): SelectQueryBuilder<Usuario> {
    return this.userRepo
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.rol', 'rol')
      .leftJoinAndSelect('u.laboratoriosAsignados', 'ul')
      .leftJoinAndSelect('ul.laboratorio', 'lab');
  }

  async findAll(query?: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'ASC' | 'DESC';
    rolId?: number;
    activo?: boolean;
    q?: string;
  }) {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 10;
    const order = (query?.order ?? 'ASC') as 'ASC' | 'DESC';

    // Whitelist de campos para ordenar
    const whitelistSort = new Set(['id', 'username', 'esta_activo']);
    const sort = whitelistSort.has(query?.sort || '') ? (query!.sort as string) : 'id';

    const qb = this.baseQb();
    if (query?.rolId) qb.andWhere('rol.id = :rolId', { rolId: query.rolId });
    if (typeof query?.activo === 'boolean') qb.andWhere('u.esta_activo = :activo', { activo: query.activo });
    if (query?.q) {
      qb.andWhere('(u.username LIKE :q OR u.nombre LIKE :q OR u.apellido LIKE :q OR u.telefono LIKE :q)', {
        q: `%${query.q}%`,
      });
    }

    const [rows, total] = await qb
      .orderBy(`u.${sort}`, order)
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: rows.map(sanitizeUser),
      meta: { total, page, limit, pageCount: Math.max(1, Math.ceil(total / limit)) },
    };
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['rol', 'laboratoriosAsignados', 'laboratoriosAsignados.laboratorio'],
    });
    if (!user) throw new NotFoundException(`Usuario ${id} no encontrado`);
    return sanitizeUser(user);
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.userRepo.findOne({ where: { id }, relations: ['rol'] });
    if (!user) throw new NotFoundException(`Usuario ${id} no encontrado`);

    // No permitir cambiar username desde este endpoint (opcional: podrías permitirlo validando duplicados)
    // (dto as any).username = undefined;

    if (dto.rolId !== undefined) {
      const rol = await this.rolRepo.findOne({ where: { id: dto.rolId } });
      if (!rol) throw new BadRequestException('Rol inválido');
      user.rol = rol;
    }
    if (dto.password !== undefined) {
      user.password = dto.password; // será re-hasheado por hook @BeforeUpdate
    }
    if (dto.nombre !== undefined) user.nombre = dto.nombre ?? null;
    if (dto.apellido !== undefined) user.apellido = dto.apellido ?? null;
    if (dto.telefono !== undefined) user.telefono = dto.telefono;
    if (dto.fecha_nacimiento !== undefined)
      user.fecha_nacimiento = dto.fecha_nacimiento ? (new Date(dto.fecha_nacimiento) as any) : null;
    if (dto.esta_activo !== undefined) user.esta_activo = dto.esta_activo;

    const saved = await this.userRepo.save(user); // usa hooks
    return this.findOne(saved.id);
  }

  async remove(id: number) {
    const res = await this.userRepo.delete({ id });
    if (!res.affected) throw new NotFoundException(`Usuario ${id} no encontrado`);
    return { deleted: true };
  }

  async addLaboratorios(userId: number, laboratorioIds: number[]) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException(`Usuario ${userId} no encontrado`);

    // Validar labs
    const labs = await this.labRepo.find({ where: { id: In(laboratorioIds) } });
    const found = new Set(labs.map((l) => l.id));
    const missing = laboratorioIds.filter((id) => !found.has(id));
    if (missing.length) throw new BadRequestException(`Laboratorios inexistentes: ${missing.join(',')}`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // Recuperar existentes para evitar duplicados
      const existing = await this.ulRepo.find({ where: { usuario: { id: userId } }, relations: { laboratorio: true } });
      const existingIds = new Set(existing.map((m) => m.laboratorio.id));
      const toCreate: UsuarioLaboratorio[] = [];
      for (const lab of labs) {
        if (!existingIds.has(lab.id)) {
          toCreate.push(this.ulRepo.create({ usuario: user, laboratorio: lab }));
        }
      }
      if (toCreate.length) await queryRunner.manager.save(UsuarioLaboratorio, toCreate);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }

    return this.findOne(userId);
  }

  async removeLaboratorio(userId: number, labId: number) {
    // Ensure user exists
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException(`Usuario ${userId} no encontrado`);

    const res = await this.ulRepo.delete({ usuario: { id: userId } as any, laboratorio: { id: labId } as any });
    if (!res.affected) throw new NotFoundException(`Asignación usuario-laboratorio no encontrada`);
    return { deleted: true };
  }
}
