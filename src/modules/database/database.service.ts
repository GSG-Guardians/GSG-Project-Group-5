import { Injectable } from '@nestjs/common';
import {
  IMetaPagination,
  IPaginationQuery,
} from '../../types/pagination.types';

@Injectable()
export class DatabaseService {
  createPaginationOptions(query: Partial<IPaginationQuery>) {
    const page = Math.max(1, Number(query.page || 1));
    const limit = Math.min(100, Math.max(1, Number(query.limit || 10)));
    const skip = (page - 1) * limit;

    return {
      skip,
      take: limit,
      page,
      limit,
    };
  }

  createPaginationMetaData(
    limit: number,
    page: number,
    total: number,
  ): IMetaPagination {
    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
