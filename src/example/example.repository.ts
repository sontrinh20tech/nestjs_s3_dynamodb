import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/repositories/base.repository';

@Injectable()
export class Example extends BaseRepository<Example> {
  id: string;
  content: string;

  getTableName(): string {
    return 'test';
  }
}
