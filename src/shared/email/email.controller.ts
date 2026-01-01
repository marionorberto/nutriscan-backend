import { Controller } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}
  // @Post('send')
  // async sendMailer(@Body() createEmailDto: CreateEmailDto) {
  //   return this.emailService.sendEmail(createEmailDto);
  // }
}
