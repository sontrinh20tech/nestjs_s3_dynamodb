import {
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { S3Service } from 'src/services/s3.service';

@Controller('example')
export class ExampleController {
  constructor(private s3Servive: S3Service) {}

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
}
