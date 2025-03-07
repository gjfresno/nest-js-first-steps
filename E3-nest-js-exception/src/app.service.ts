import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { from, map, catchError } from 'rxjs';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async findAll(name?: string) {
    try {
      if (name) {
        return this.prisma.user.findMany({
          where: { name: { contains: name, mode: 'insensitive' } },
        });
      }
      return this.prisma.user.findMany();
    } catch (error) {
      throw new BadRequestException('Error al buscar usuarios');
    }
  }

  async findById(id: string) {
    const userInfo = await this.prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!userInfo) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return userInfo;
  }

  findByIdReactive(id: string) {
    return from(
      this.prisma.user.findUnique({
        where: { id: parseInt(id) },
      })
    ).pipe(
      map(userInfo => {
        if (!userInfo) {
          throw new NotFoundException(`Usuario con ID ${id} no encontrado usando ReactiveX`);
        }
        return userInfo;
      }),
      catchError(err => {
        throw err;
      })
    );
  }

  async create(createUserDto: CreateUserDto) {
    try {
      return await this.prisma.user.create({
        data: {
          name: createUserDto.name,
        }
      });
    } catch (error) {
      throw new BadRequestException('No se pudo crear el usuario');
    }
  }
}
