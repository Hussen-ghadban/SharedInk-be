import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SpaceService } from './space.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('spaces')
@UseGuards(JwtAuthGuard)
export class SpaceController {
  constructor(private spaceService: SpaceService) {}

  @Post()
  createSpace(@Body() body: { title: string }, @Req() req) {
    const ownerId = req.user.id;
    console.log("token",ownerId);
    return this.spaceService.createSpace(body.title, ownerId);
  }
  @Get()
  getSpaces(@Req() req){
    const ownerId=req.user.id;
    return this.spaceService.getSpaces(ownerId);
  }

  @Post(':id/invite')
  inviteUser(@Param('id') id: string, @Body() body: { userId: string }) {
    return this.spaceService.inviteUser(id, body.userId); // Removed +id conversion
  }

  @Get(':id')
  getSpace(@Param('id') id: string) {
    return this.spaceService.getSpaceById(id); // Removed +id conversion
  }

  @Patch(':id/content')
  updateContent(@Param('id') id: string, @Body() body: { content: string }) {
    return this.spaceService.updateContent(id, body.content); // Removed +id conversion
  }
}