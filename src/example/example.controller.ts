import {
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { S3Service } from 'src/services/s3.service';
import { Example } from './example.repository';

@Controller('example')
export class ExampleController {
  constructor(
    private s3Servive: S3Service,
    private exampleRepository: Example,
  ) {}

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.s3Servive.uploadFileToPublicBucket({
      file: file,
      path: 'uploads',
    });
  }

  @Get('/download')
  async download(@Query('file') file: string, @Res() res: Response) {
    const fileStream = await this.s3Servive.getFileFromPublicBucket(file);
    const filename = file.split('/').pop();
    const safeFileName = encodeURIComponent(filename);

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${safeFileName}"`,
    );
    res.setHeader('Content-Type', 'application/octet-stream');

    fileStream.pipe(res);
  }

  @Delete('/delete')
  async delete(@Query('file') file: string) {
    return this.s3Servive.deleteFileFromPublicBucket(file);
  }

  @Get('/get-all')
  async getListTables() {
    const data = await this.exampleRepository.getAll();

    return data;
  }

  @Get('/get-101')
  async testGet() {
    const data = await this.exampleRepository.getById('101');
    return data;
  }

  @Post('/store')
  async store() {
    await this.exampleRepository.store({
      id: '104',
      content: 'This is a test content.',
      updatedAt: Date.now(),
    });

    return {
      message: 'successfully',
    };
  }

  @Put('/update')
  async update() {
    const data = await this.exampleRepository.update({
      id: '104',
      content: 'This is a test content.1',
    });

    return data;
  }
}
