import { Injectable } from '@nestjs/common';
import * as si from 'systeminformation';

@Injectable()
export class AppService {
  async getTotalMemory(): Promise<{total: number}> {
    const memData = await si.mem();
    return {total: memData.total};
  }
}
