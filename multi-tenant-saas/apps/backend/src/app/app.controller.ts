import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User, UserRole } from '@prisma/client';

@Controller('api/v1')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get('health')
  getHealth() {
    return this.appService.getHealth();
  }

  @Public()
  @Get('hello')
  getHello() {
    return this.appService.getHello();
  }

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getProtected(@CurrentUser() user: User) {
    return {
      message: 'This is a protected route',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin-only')
  getAdminOnly(@CurrentUser() user: User) {
    return {
      message: 'This is an admin-only route',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}
