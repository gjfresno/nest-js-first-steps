import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AppService {
  private users = [{ id: 1, name: 'Juan' }, { id: 2, name: 'Ana' }];

  findAll(name?: string) {
    if (name) {
      return this.users.filter(user => user.name.includes(name));
    }
    return this.users;
  }

  findById(id: string) {
    return this.users.find(user => user.id === parseInt(id));
  }

  create(createUserDto: CreateUserDto) {
    const newUser = { id: this.users.length + 1, ...createUserDto };
    this.users.push(newUser);
    return newUser;
  }
}
