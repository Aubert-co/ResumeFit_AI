import {
  BadRequestException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

import { DocumentService } from '../document.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/currentUser.decorator';
import type { JwtPayload } from '../../auth/types/JwtPayload.types';
const MAX_FILE_SIZE = 5 * 1024 * 1024;
@Controller('documents')
export class DocumentController {
  constructor(
    private readonly documentService: DocumentService,
  ) {}

  
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits:{
        fileSize:MAX_FILE_SIZE,
      },
     fileFilter: (req, file, cb) => {
        const allowed = [
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain',
        ];

        if (!allowed.includes(file.mimetype)) {
          return cb(new BadRequestException('Invalid file type'), false);
        }

        cb(null, true);
      }
    }),
  )
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async uploadDocument(
    @CurrentUser() user:JwtPayload,
    @UploadedFile() file: Express.Multer.File,
  ) {
   
    await this.documentService.create(file,user.id);

  }
}