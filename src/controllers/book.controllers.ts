import { Controller, Get, Query, Res } from '@nestjs/common';
import { BookService } from 'src/services/book.service';
import { Book } from 'src/entities/book.entity';
import { ApiResponse } from 'src/interface/api_response.interface';
import { Response } from 'express';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  async findAll(
    @Res() res: Response,
    @Query('keyword') keyword?: string,
  ): Promise<void> {
    let title: string | undefined;
    let writer: string | undefined;

    // If keyword is provided, use it to search for both title and writer
    if (keyword) {
      title = keyword;
      writer = keyword;
    }
    const books = await this.bookService.findAll(title, writer);
    const response: ApiResponse<Book[]> = {
      success: true,
      message: 'Data book successfully fetched',
      data: books,
    };
    res.json(response);
  }
}
