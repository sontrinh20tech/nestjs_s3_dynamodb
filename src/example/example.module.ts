import { Module } from '@nestjs/common';
import { ExampleController } from './example.controller';
import { S3Service } from 'src/services/s3.service';
import { DynamodbService } from 'src/services/dynamodb.service';
import { Example } from './example.repository';

@Module({
  controllers: [ExampleController],
  providers: [S3Service, Example, DynamodbService],
})
export class ExampleModule {}
