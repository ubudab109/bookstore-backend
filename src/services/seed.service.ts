import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from 'src/entities/book.entity';
import { Customer } from 'src/entities/customer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async seedAll() {
    await this.seedBooks();
    await this.seedCustomers();
  }

  private generateRandomTags(): string[] {
    const allTags = ['fiction', 'non-fiction', 'science', 'essay'];
    const numTags = Math.floor(Math.random() * allTags.length) + 1; // Random number of tags
    const tags = [];
    for (let i = 0; i < numTags; i++) {
      const randomIndex = Math.floor(Math.random() * allTags.length);
      tags.push(allTags[randomIndex]);
    }
    return tags;
  }

  async seedBooks(): Promise<void> {
    for (let i = 1; i < 21; i++) {
      const tags = this.generateRandomTags();
      await this.bookRepository.upsert(
        {
          id: i,
          title: 'Book - ' + i,
          writer: 'Writer - ' + i,
          cover_image:
            'https://images-na.ssl-images-amazon.com/images/I/51Ga5GuElyL._AC_SX184_.jpg',
          price: i,
          tags: tags,
        },
        {
          conflictPaths: ['id'],
          skipUpdateIfNoValuesChanged: true,
        },
      );
    }
  }

  async seedCustomers(): Promise<void> {
    for (let i = 1; i < 21; i++) {
      const isExists = await this.customerRepository.findOneBy({
        username: 'user' + i,
      });
      if (isExists) {
        await this.customerRepository.update(i, {
          name: 'user - ' + i,
          username: 'user' + i,
          password: '123123123',
          points: 100,
        });
      } else {
        await this.customerRepository.insert({
          name: 'user - ' + i,
          username: 'user' + i,
          password: '123123123',
          points: 100,
        });
      }
    }
  }
}
