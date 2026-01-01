import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly mailService: MailerService) {}

  async sendRegistrationCode(to: string) {
    try {
      console.log(to);
      const sentEmailInfo = await this.mailService.sendMail({
        to,
        subject: 'NUTRISCAN',
        text: 'Use este código para te registrares.',
        template: './registration-code.hbs',
      });

      return {
        statusCode: 201,
        method: 'POST',
        message: 'email sent sucessfully',
        data: sentEmailInfo,
        path: '/send/email',
        timestamp: Date.now(),
      };
    } catch (error) {
      console.log(`Failed to send email | Error Message: ${error.message}`);

      throw new HttpException(
        {
          statusCode: 400,
          method: 'POST',
          message: 'Failed to sent email',
          error: error.message,
          path: '/send/email',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
