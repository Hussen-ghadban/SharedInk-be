import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SpaceGateway } from './space.gateway';

@Injectable()
export class SpaceService {
  constructor(private prisma: PrismaService,private spaceGateway: SpaceGateway,) {}

  async createSpace(title: string, ownerId: string) {
    return await this.prisma.space.create({
      data: {
        title,
        ownerId,
      },
      include: {
        owner: true,
        collaborators: true,
      },
    });

  }
  async getSpaces(ownerId:string){
    const spaces=await this.prisma.space.findMany({
        where:{
          OR:[
            {ownerId:ownerId},
            {collaborators:{
              some:{
                id:ownerId
              }
            }}
        ] 
      }
    })
    return spaces;
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

async updateContent(spaceId: string, content: string, userId: string) {
  const space = await this.prisma.space.findUnique({
    where: { id: spaceId },
    include: { collaborators: true },
  });

  if (!space) {
    throw new NotFoundException('Space not found');
  }

  const isOwner = space.ownerId === userId;
  const isCollaborator = space.collaborators.some(user => user.id === userId);

  if (!isOwner && !isCollaborator) {
    throw new ForbiddenException('You are not allowed to edit this space');
  }

  const updatedSpace = await this.prisma.space.update({
    where: { id: spaceId }, 
    data: { content },
    include: {
      owner: true,
      collaborators: true,
    },
  });
  
    // Emit real-time update to other users in the space room
    this.spaceGateway.server.to(spaceId).emit('spaceUpdated', {
      content,
      spaceId,
    });

    return updatedSpace;
}

}