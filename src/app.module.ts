import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { SpaceModule } from './space/space.module';
import { ConfigModule } from '@nestjs/config';
import { InviteModule } from './invite/invite.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [AuthModule, PrismaModule, SpaceModule,ConfigModule.forRoot({ isGlobal: true }), InviteModule,MulterModule.register(),],
})
export class AppModule {}
