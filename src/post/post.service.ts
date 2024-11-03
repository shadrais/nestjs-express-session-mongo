import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder } from 'mongoose';

import { IPaginatedResponse } from 'src/common/types/api-response.types';
import { GetAllPostDto } from 'src/post/dto/request-post.dto';
import { Post } from 'src/post/entities/post.entity';
import { UsersService } from 'src/users/users.service';
import { ApiResponse } from 'src/utils/response.utils';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    private readonly usersService: UsersService,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const createdPost = await this.postModel.create(createPostDto);

    await this.usersService.addPostToUser(
      createPostDto.author._id.toHexString(),
      createdPost._id.toHexString(),
    );

    return ApiResponse.success(
      (await createdPost.populate('author')).toJSON(),
      'Post created successfully',
      HttpStatus.CREATED,
    );
  }

  async findAll(params: GetAllPostDto): Promise<IPaginatedResponse<Post>> {
    // Ensure page starts from 1 and convert to skip
    const page = Math.max(1, params.page);
    const limit = Math.max(1, params.limit);
    const skip = (page - 1) * limit;

    // Build search query
    const searchQuery = params?.search
      ? { title: { $regex: params.search, $options: 'i' } }
      : {};

    const sortBy = params?.sortBy || [];
    const sortOrder = params?.sortOrder || [];

    const sortQuery: [string, SortOrder][] = sortBy.map((key, index) => [
      key,
      sortOrder[index] || 'asc',
    ]);

    // Execute query with pagination
    const [posts, totalItems] = await Promise.all([
      this.postModel
        .find(searchQuery)
        .skip(skip)
        .limit(limit)
        .sort(sortQuery)
        .populate('author', ['email', 'firstName', 'lastName', 'fullName'])
        .exec(),
      this.postModel.countDocuments(searchQuery),
    ]);

    return ApiResponse.paginated(
      posts.map((post) => post.toJSON()),
      totalItems,
      page,
      limit,
    );
  }

  async findOne(id: string) {
    const post = await this.postModel.findById(id).populate('author').exec();

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return ApiResponse.success(post.toJSON(), 'Post retrieved successfully');
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    const post = await this.postModel
      .findByIdAndUpdate(id, updatePostDto, {
        new: true,
      })
      .populate('author')
      .exec();
    return ApiResponse.success(post.toJSON(), 'Post updated successfully');
  }

  async remove(id: string) {
    const post = await this.postModel.findByIdAndDelete(id).exec();
    return ApiResponse.success(post.toJSON(), 'Post deleted successfully');
  }
}
