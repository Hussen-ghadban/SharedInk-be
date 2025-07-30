import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InviteStatus } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class InviteService {
  constructor(private prisma: PrismaService) {}

  async createInvite(email: string, spaceId: string, inviterId: string) {
    const existing = await this.prisma.invitation.findFirst({
      where: { email, spaceId, status: InviteStatus.PENDING },
    });
    if (existing) {
      throw new BadRequestException('Already invited.');
    }

    return this.prisma.invitation.create({
      data: {
        email,
        spaceId,
        invitedById: inviterId,
      },
    });
  }

  async acceptInvite(inviteId: string, userId: string) {
    const invite = await this.prisma.invitation.findUnique({
      where: { id: inviteId },
    });

    if (!invite) {
      throw new NotFoundException('Invite not found.');
    }

    if (invite.status === 'ACCEPTED') {
      throw new BadRequestException('Invite already accepted.');
    }
    const user=await this.prisma.user.findUnique({
        where:{id:userId}
    })
    if(!user){
        throw new NotFoundException('User not found.');
    }
    if(user.email!=invite.email){
        throw new BadRequestException('You are not authorized to accept this invite.');
    }

    // Add user to collaborators in the space
    await this.prisma.space.update({
      where: { id: invite.spaceId },
      data: {
        collaborators: {
          connect: { id: userId },
        },
      },
    });

    return this.prisma.invitation.update({
      where: { id: inviteId },
      data: { status: 'ACCEPTED' },
    });
  }

  async rejectInvite(inviteId: string,id:string) {
        const invite = await this.prisma.invitation.findUnique({
      where: { id: inviteId },
    });

    if (!invite) {
      throw new NotFoundException('Invite not found.');
    }
    const user=await this.prisma.user.findUnique({
        where:{id}
    })
    if(!user){
        throw new NotFoundException('User not found.');
    }
    if(invite.email!=user.email){
        throw new BadRequestException('You are not authorized to reject this invite.');

    }
    return this.prisma.invitation.update({
      where: { id: inviteId },
      data: { status: 'REJECTED' },
    });
  }

  async getInvitesForUser(id: string) {
    const user=await this.prisma.user.findUnique({
        where:{id}
    })
    if(!user){
        throw new NotFoundException('User not found.');
    }

    // console.log("email",email)
    return this.prisma.invitation.findMany({
      where: {
        email:user.email,
        status: 'PENDING',
      },
      include: {
        space: true,
        invitedBy: true,
      },
    });
  }
  async deleteInvite(userId:string,id:string){
    const invite=await this.prisma.invitation.findUnique({
        where:{id}
    })
    if(!invite){
        throw new NotFoundException('Invitation not found.');
    }
    if(invite.invitedById!=userId){
        throw new BadRequestException('You are not authorized to delete this invite.');
    }
    await this.prisma.invitation.delete({
        where:{id}
    })
return { message: 'Invitation deleted successfully.' };
  }
}
