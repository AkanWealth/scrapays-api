import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './entities/book.entity';
import { ConfigModule } from '@nestjs/config';
import { BookResolver } from './book.resolver';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Book]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
    }),
  ],
  providers: [BookResolver, BookService],
})
export class BookModule {}
