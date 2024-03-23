import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from 'src/entities/book.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async findAll(
    title?: string,
    writer?: string,
    tags?: string[],
    page = 1,
    pageSize = 10,
  ): Promise<Book[]> {
    let query = this.bookRepository.createQueryBuilder('book');

    // Add conditions for title and writer if provided
    if (title) {
      query = query.where('book.title LIKE :title', { title: `%${title}%` });
    }
    if (writer) {
      query = query.orWhere('book.writer LIKE :writer', {
        writer: `%${writer}%`,
      });
    }

    if (tags && tags.length > 0) {
      const joinedTags: string = tags.join(',');
      query = query.orWhere(`book.tags LIKE :tags`, {
        tags: joinedTags,
      });
    }

    query = query.skip((page - 1) * pageSize).take(pageSize);
    return query.getMany();
  }
}
