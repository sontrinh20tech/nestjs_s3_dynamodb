import { Injectable } from '@nestjs/common';
import { DynamodbService } from 'src/services/dynamodb.service';

@Injectable()
export abstract class BaseRepository<T> {
  constructor(private dynamoDbService: DynamodbService) {
    this.dynamoDbService.key = this.getKey();
  }

  async getAll(): Promise<T[]> {
    const data = await this.dynamoDbService.getAll(this.getTableName());

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return data;
  }

  async getById(id: string): Promise<T> {
    const data = await this.dynamoDbService.getById(this.getTableName(), id);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return data;
  }

  async store(data: any): Promise<void> {
    await this.dynamoDbService.store(this.getTableName(), data);
  }

  async update(data: any): Promise<void> {
    await this.dynamoDbService.update(this.getTableName(), data);
  }

  abstract getTableName(): string;

  getKey() {
    return 'id';
  }
}
