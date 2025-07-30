import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { SpaceModule } from './space/space.module';
import { ConfigModule } from '@nestjs/config';
import { InviteModule } from './invite/invite.module';

@Module({
  imports: [AuthModule, PrismaModule, SpaceModule,ConfigModule.forRoot({ isGlobal: true }), InviteModule,],
})
export class AppModule {}
