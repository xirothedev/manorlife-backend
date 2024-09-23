import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { PrismaService } from 'src/prisma.service';
import { RoomController } from './room.controller';
import { MediaSerivce } from 'src/media.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [RoomService, PrismaService, MediaSerivce, JwtService],
  controllers: [RoomController]
})
export class RoomModule {}
