import { Body, Controller, Get, Param, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getUsers(@Query('name') name?: string) {
    return this.appService.findAll(name);
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.appService.findById(id);
  }

  @Get('/reac/:id')
  findByIdReactive(@Param('id') id: string) {
    return this.appService.findByIdReactive(id);
  }

/**
 * Crea el archivo `src/users/dto/create-user.dto.ts` con el siguiente contenido:
 *
 * ```typescript
 * import { IsString } from 'class-validator';
 *
 * export class CreateUserDto {
 *   @IsString()
 *   name: string;
 * }
 * ```
 *
 * Esto define un DTO (Data Transfer Object) con validación para garantizar que el campo `name` sea una cadena de texto.
 */

  @Post()
  @UsePipes(new ValidationPipe())
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.appService.create(createUserDto);
  }
}
