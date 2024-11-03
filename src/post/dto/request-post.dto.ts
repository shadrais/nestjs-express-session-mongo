import { Transform } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { SortOrder } from 'mongoose';

export class GetAllPostDto {
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => {
    return Number(value);
  })
  @Min(1)
  page: number;

  @IsNotEmpty()
  @IsNumberString({}, { message: 'Limit must be a number' })
  limit: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsArray()
  sortOrder?: SortOrder[];

  @IsOptional()
  @IsString()
  sortBy?: string[];
}
