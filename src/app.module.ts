import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { SpaceModule } from './space/space.module';

@Module({
  imports: [AuthModule, PrismaModule, SpaceModule],
})
export class AppModule {}
