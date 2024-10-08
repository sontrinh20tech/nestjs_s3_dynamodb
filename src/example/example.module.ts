import { Module } from '@nestjs/common';
import { ExampleController } from './example.controller';
import { S3Service } from 'src/services/s3.service';

@Module({
  controllers: [ExampleController],
  providers: [S3Service],
})
export class ExampleModule {}
