import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api/v1')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  getHealth() {
    return this.appService.getHealth();
  }

  @Get('hello')
  getHello() {
    return this.appService.getHello();
  }
}
