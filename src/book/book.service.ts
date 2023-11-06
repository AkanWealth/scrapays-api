import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async findOne(id: number): Promise<Book> {
    try {
      const book = await this.bookRepository.findOne({ where: { id } });

      if (!book) {
        throw new NotFoundException('Book not found');
      }

      return book;
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<Book[]> {
    return this.bookRepository.find();
  }

  async create(book: Book): Promise<Book> {
    return this.bookRepository.save(book);
  }

  async update(id: number, book: Book): Promise<Book> {
    try {
      const updateResult = await this.bookRepository.update(id, book);

      if (updateResult.affected === 0) {
        throw new NotFoundException('Book not found');
      }

      return this.bookRepository.findOne({ where: { id } });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number): Promise<Book> {
    try {
      const book = await this.bookRepository.findOne({ where: { id } });

      if (!book) {
        throw new NotFoundException('Book not found');
      }

      await this.bookRepository.remove(book);

      return book;
    } catch (error) {
      throw error;
    }
  }
}
