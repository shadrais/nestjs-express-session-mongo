import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { SortOrder } from 'mongoose';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostService } from './post.service';

@Controller('post')
@UseGuards(AuthenticatedGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async create(@Body() createPostDto: CreatePostDto, @Req() req: Request) {
    createPostDto.author = req.user._id;
    return await this.postService.create(createPostDto);
  }

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search: string,
    @Query('sortBy', new DefaultValuePipe(['createdAt']), ParseArrayPipe)
    sortBy: string[],
    @Query('sortOrder', new DefaultValuePipe(['desc']), ParseArrayPipe)
    sortOrder: SortOrder[],
  ) {
    return this.postService.findAll({ limit, page, search, sortBy, sortOrder });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(id);
  }
}
