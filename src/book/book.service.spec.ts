import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { BookService } from './book.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';

describe('BookService', () => {
  let bookService: BookService;
  let bookRepository: Repository<Book>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getRepositoryToken(Book),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    bookService = module.get<BookService>(BookService);
    bookRepository = module.get<Repository<Book>>(getRepositoryToken(Book));
  });

  it('should be defined', () => {
    expect(bookService).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a book', async () => {
      const mockBook = { id: 1, title: 'Sample Book' };
      (bookRepository.findOne as jest.Mock).mockResolvedValue(mockBook);

      const result = await bookService.findOne(1);

      expect(result).toEqual(mockBook);
    });

    it('should throw NotFoundException when the book is not found', async () => {
      (bookRepository.findOne as jest.Mock).mockResolvedValue(undefined);

      await expect(bookService.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return an array of books', async () => {
      const mockBooks = [
        { id: 1, name: 'Book 1', describe: 'Book 1 Description' },
        { id: 2, name: 'Book 2', describe: 'Book 2 Description' },
      ];
      (bookRepository.find as jest.Mock).mockResolvedValue(mockBooks);

      const result = await bookService.findAll();

      expect(result).toEqual(mockBooks);
    });
  });

  describe('create', () => {
    it('should create a new book', async () => {
      const newBook: Book = {
        id: 3,
        name: 'Author Name',
        description: 'Book Description',
      };
      const savedBook: Book = {
        id: 3,
        name: 'Author Name',
        description: 'Book Description',
      };
      (bookRepository.save as jest.Mock).mockResolvedValue(savedBook);

      const result = await bookService.create(newBook);

      expect(result).toEqual(savedBook);
    });
  });

  describe('update', () => {
    it('should update an existing book', async () => {
      const updatedBook: Book = {
        id: 1,
        name: 'Updated Author Name',
        description: 'Updated Book Description',
      };
      (bookRepository.update as jest.Mock).mockResolvedValue({ affected: 1 });
      (bookRepository.findOne as jest.Mock).mockResolvedValue(updatedBook);

      const result = await bookService.update(1, updatedBook);

      expect(result).toEqual(updatedBook);
    });

    it('should throw NotFoundException when the book to update is not found', async () => {
      const updatedBook: Book = {
        id: 1,
        name: 'Updated Author Name',
        description: 'Updated Book Description',
      };
      (bookRepository.update as jest.Mock).mockResolvedValue({ affected: 0 });

      await expect(bookService.update(1, updatedBook)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove an existing book', async () => {
      const bookToRemove = { id: 1, title: 'Book to Remove' };
      (bookRepository.findOne as jest.Mock).mockResolvedValue(bookToRemove);
      (bookRepository.remove as jest.Mock).mockResolvedValue(bookToRemove);

      const result = await bookService.remove(1);

      expect(result).toEqual(bookToRemove);
    });

    it('should throw NotFoundException when the book to remove is not found', async () => {
      (bookRepository.findOne as jest.Mock).mockResolvedValue(undefined);

      await expect(bookService.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
