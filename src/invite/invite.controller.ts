import { InviteService } from './invite.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import {
  Controller,
  Post,
  Body,
  Param,
  Req,
  Get,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';


@Controller('invites')
@UseGuards(JwtAuthGuard)

export class InviteController {
  constructor(private inviteService: InviteService) {}

  @Post(':id')
  async invite(
    @Body() body: { email: string},
    @Param('id') id: string,
    @Req() req: any // assume req.user is populated by auth middleware
  ) {
    return this.inviteService.createInvite(body.email, id, req.user.id);
  }

  @Post(':id/accept')
  async accept(@Param('id') id: string, @Req() req: any) {
    return this.inviteService.acceptInvite(id, req.user.id);
  }

  @Put(':id/reject')
  async reject(@Param('id') id: string,
 @Req() req: any) {
    return this.inviteService.rejectInvite(id,req.user.id);
  }

  @Get()
  async getMyInvites(@Req() req: any) {
    return this.inviteService.getInvitesForUser(req.user.email);
  }
  @Delete(':id')
  async deleteInvite(@Req()req:any,@Param('id')id:string){
    return this.inviteService.deleteInvite(req.user.id,id);
  }
}
