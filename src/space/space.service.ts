import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SpaceService {
  constructor(private prisma: PrismaService) {}

  async createSpace(title: string, ownerId: string) {
    // Option 1: Don't auto-add owner as collaborator
    return this.prisma.space.create({
      data: {
        title,
        ownerId,
      },
      include: {
        owner: true,
        collaborators: true,
      },
    });

    // Option 2: If you want to auto-add owner as collaborator, validate first
    /*
    // First verify the user exists
    const user = await this.prisma.user.findUnique({
      where: { id: ownerId }
    });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.space.create({
      data: {
        title,
        ownerId,
        collaborators: { connect: { id: ownerId } },
      },
      include: {
        owner: true,
        collaborators: true,
      },
    });
    */
  }
  async getSpaces(ownerId:string){
    const spaces=await this.prisma.space.findMany({
        where:{ownerId:ownerId}
    })
    return spaces;
  }
  async inviteUser(spaceId: string, userId: string) {
    // Add validation to check if space and user exist
    const [space, user] = await Promise.all([
      this.prisma.space.findUnique({ where: { id: spaceId } }),
      this.prisma.user.findUnique({ where: { id: userId } })
    ]);

    if (!space) throw new NotFoundException('Space not found');
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.space.update({
      where: { id: spaceId },
      data: {
        collaborators: {
          connect: { id: userId },
        },
      },
      include: {
        owner: true,
        collaborators: true,
      },
    });
  }

  async getSpaceById(spaceId: string) {
    const space = await this.prisma.space.findUnique({
      where: { id: spaceId },
      include: {
        owner: true,
        collaborators: true,
      },
    });
    if (!space) throw new NotFoundException('Space not found');
    return space;
  }

  async updateContent(spaceId: string, content: string) {
    // Add validation to check if space exists
    const space = await this.prisma.space.findUnique({
      where: { id: spaceId }
    });
    if (!space) throw new NotFoundException('Space not found');

    return this.prisma.space.update({
      where: { id: spaceId },
      data: { content },
      include: {
        owner: true,
        collaborators: true,
      },
    });
  }
}