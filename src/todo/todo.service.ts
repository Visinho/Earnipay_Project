import { Injectable } from '@nestjs/common';
import { CreateTodoInput } from './dto/create-todo.input';
import { UpdateTodoInput } from './dto/update-todo.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TodoService {
  findOneById: any;
  constructor(private prisma: PrismaService) {}
  create(createTodoInput: CreateTodoInput) {
    return this.prisma.todo.create({
      data: {
        title: createTodoInput.title,
        description: createTodoInput.description,
        completed: createTodoInput.completed,
      },
    });
  }

  findAll() {
    return this.prisma.todo.findMany();
  }

  findOne(id: number) {
    return this.prisma.todo.findUnique({ where: { id } });
  }

  update(id: number, updateTodoInput: UpdateTodoInput) {
    return this.prisma.todo.update({
      where: { id },
      data: {
        title: updateTodoInput.title,
        description: updateTodoInput.description,
        completed: updateTodoInput.completed,
      },
    });
  }

  remove(id: number) {
    return this.prisma.todo.delete({ where: { id } });
  }

  async getTodoListByTitleOrDescription(query: string) {
    const todoList = await this.prisma.todo.findMany({
      where: {
        OR: [
          { title: { contains: query } },
          { description: { contains: query } },
        ],
      },
    });
    return todoList;
  }

}
