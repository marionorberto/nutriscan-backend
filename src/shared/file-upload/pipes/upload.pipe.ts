import {
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class UploadPipe implements PipeTransform {
  transform(value: any) {
    try {
      if (!value) {
        throw new HttpException(
          {
            statusCode: 400,
            method: 'POST',
            message: 'No File Uploaded.',
            path: '/upload',
            timestamp: Date.now(),
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const allowedMimeTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'application/pdf',
      ];

      if (!allowedMimeTypes.includes(value.mimetype)) {
        throw new HttpException(
          {
            statusCode: 400,
            method: 'POST',
            message: 'Invalid File Type.',
            path: '/upload',
            timestamp: Date.now(),
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const maxSize = 5 * 1024 * 1024;
      if (value.size > maxSize) {
        throw new HttpException(
          {
            statusCode: 400,
            method: 'POST',
            message: 'File Is Too Large.',
            path: '/upload',
            timestamp: Date.now(),
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      return value;
    } catch (error) {
      console.log(`Failed To Upload File | Error Message: ${error.message}`);

      throw new HttpException(
        {
          statusCode: 400,
          method: 'POST',
          message: 'Failed To Upload File',
          error: error.message,
          path: '/upload',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
