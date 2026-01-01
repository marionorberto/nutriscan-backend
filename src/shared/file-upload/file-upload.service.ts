import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FileUploadeToReturn } from './interfaces/file-uploaded-to-return';

@Injectable()
export class FileUploadService {
  handleFileUpload(file: Express.Multer.File): FileUploadeToReturn {
    try {
      if (!file) {
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

      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new HttpException(
          {
            statusCode: 400,
            method: 'POST',
            message: 'Invalid File Type.',
            path: '/uploads',
            timestamp: Date.now(),
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
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

      return {
        statusCode: 201,
        method: 'POST',
        message: 'File Uploaded sucessfully',
        filePath: file.path,
        filename: file.filename,
        path: '/uploads',
        timestamp: Date.now(),
      };
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
