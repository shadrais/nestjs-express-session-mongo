import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { GetAllPostDto } from 'src/post/dto/request-post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostService } from './post.service';

@Controller('post')
@UseGuards(AuthenticatedGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async create(@Body() createPostDto: CreatePostDto, @Req() req: Request) {
    try {
      createPostDto.author = req.user._id;
      console.log('createPostDto', createPostDto);
      return await this.postService.create(createPostDto);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  findAll(@Query() body: GetAllPostDto) {
    console.log('body', body);
    return this.postService.findAll(body);
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
