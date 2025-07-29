import { Module } from '@nestjs/common';
import { SpaceController } from './space.controller';
import { SpaceService } from './space.service';
import { SpaceGateway } from './space.gateway';

@Module({
  controllers: [SpaceController],
  providers: [SpaceService, SpaceGateway]
})
export class SpaceModule {}
