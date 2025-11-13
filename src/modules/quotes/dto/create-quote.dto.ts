import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Item } from '../entities/quote.entity';
import { isValidObjectId } from 'mongoose';

export class CreateQuoteDto {
  @IsArray()
  items: Item[];

  @IsNotEmpty()
  @IsString()
  clientId: string;
}
