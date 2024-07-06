import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('total')
  async getTotalMemory(): Promise<{total: number}> {
    return await this.appService.getTotalMemory();
  }
}
