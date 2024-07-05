import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SystemGateway } from './system/system.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, SystemGateway],
})
export class AppModule {}
