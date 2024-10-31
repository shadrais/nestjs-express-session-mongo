import { Transform } from 'class-transformer';
import {
  IsEnum,
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
  @IsEnum(['asc', 'desc'], { message: 'Sort order must be asc or desc' })
  sortOrder?: SortOrder;

  @IsOptional()
  @IsEnum(['title', 'created_at'], {
    message: 'Sort by must be title or created_at',
  })
  sortBy?: string;
}
