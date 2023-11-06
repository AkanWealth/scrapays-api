import { NotFoundException, UseGuards } from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './entities/book.entity';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/authorization/authorization.guard';

@Resolver(() => Book)
export class BookResolver {
  constructor(private readonly bookService: BookService) {}

  @Query(() => Book)
  @UseGuards(AuthorizationGuard)
  async getBook(@Args('id') id: number) {
    try {
      return this.bookService.findOne(id);
    } catch (error) {
      throw new Error('An error occurred while fetching the book');
    }
  }

  @Query(() => [Book])
  // @UseGuards(AuthorizationGuard)
  async getBooks() {
    try {
      return this.bookService.findAll();
    } catch (error) {
      throw new Error('An error occurred while fetching all the books');
    }
  }

  @Mutation(() => Book)
  // @UseGuards(AuthorizationGuard)
  async createBook(
    @Args('name') name: string,
    @Args('description') description: string,
  ) {
    try {
      const book = new Book();
      book.name = name;
      book.description = description;
      return this.bookService.create(book);
    } catch (error) {
      throw new Error('An error occurred while creating the book');
    }
  }

  @Mutation(() => Book)
  // @UseGuards(AuthorizationGuard)
  async updateBook(
    @Args('id') id: number,
    @Args('name') name: string,
    @Args('description') description: string,
  ) {
    try {
      const book = new Book();
      book.name = name;
      book.description = description;
      return this.bookService.update(id, book);
    } catch (error) {
      throw new Error('An error occurred while updating the book');
    }
  }

  @Mutation(() => Book)
  // @UseGuards(AuthorizationGuard)
  async removeBook(@Args('id') id: number) {
    try {
      const book = await this.bookService.findOne(id);
      if (!book) {
        throw new NotFoundException(`Book with ID ${id} not found.`);
      }
      await this.bookService.remove(id);

      const placeholderBook = new Book();
      placeholderBook.id = id;

      return placeholderBook;
    } catch (error) {
      throw new Error('An error occurred while deleting this book');
    }
  }
}
