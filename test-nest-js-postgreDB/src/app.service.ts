import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async findAll(name?: string) {
    if (name) {
      return this.prisma.user.findMany({
        where: { name: { contains: name, mode: 'insensitive' } },
      });
    }
    return this.prisma.user.findMany();
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id: parseInt(id) },
    });
  }

  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        name: createUserDto.name,
      }
    });
  }
}
