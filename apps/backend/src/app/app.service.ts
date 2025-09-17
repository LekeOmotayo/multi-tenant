import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth(): { status: string; timestamp: string; uptime: number } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  getHello(): { message: string; timestamp: string } {
    return {
      message: 'Hello from Multi-Tenant SaaS Backend! 🚀',
      timestamp: new Date().toISOString(),
    };
  }
}
