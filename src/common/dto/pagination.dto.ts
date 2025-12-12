import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class PageQueryDto {
  @ApiPropertyOptional({ description: 'Página (1..N)', example: 1, default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Elementos por página', example: 10, default: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Campo para ordenar (opcional)', example: 'id' })
  @IsString()
  @IsOptional()
  sort?: string;

  @ApiPropertyOptional({ description: 'Dirección de orden', example: 'ASC', default: 'ASC', enum: ['ASC','DESC'] })
  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  order?: 'ASC' | 'DESC' = 'ASC';
}

export interface PaginatedMeta {
  total: number;
  page: number;
  limit: number;
  pageCount: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginatedMeta;
}

export function buildMeta(total: number, page: number, limit: number): PaginatedMeta {
  const pageCount = Math.max(1, Math.ceil(total / limit));
  return { total, page, limit, pageCount };
}
