import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { SpaceModule } from './space/space.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [AuthModule, PrismaModule, SpaceModule,ConfigModule.forRoot({ isGlobal: true }),],
})
export class AppModule {}
