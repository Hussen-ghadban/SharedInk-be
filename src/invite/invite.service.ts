import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class InviteService {
  constructor(private prisma: PrismaService) {}

  async createInvite(email: string, spaceId: string, inviterId: string) {
    const existing = await this.prisma.invitation.findFirst({
      where: { email, spaceId, status: 'PENDING' },
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

  async rejectInvite(inviteId: string) {
    return this.prisma.invitation.update({
      where: { id: inviteId },
      data: { status: 'REJECTED' },
    });
  }

  async getInvitesForUser(email: string) {
    return this.prisma.invitation.findMany({
      where: {
        email,
        status: 'PENDING',
      },
      include: {
        space: true,
        invitedBy: true,
      },
    });
  }
}
