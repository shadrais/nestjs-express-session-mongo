import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder } from 'mongoose';
import { GetAllPostDto } from 'src/post/dto/request-post.dto';
import { Post } from 'src/post/entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(@InjectModel('Post') private readonly postModel: Model<Post>) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const createdPost = await this.postModel.create(createPostDto);
    return createdPost;
  }

  async findAll(params: GetAllPostDto) {
    // Ensure page starts from 1 and convert to skip
    const page = Math.max(1, params.page);
    const limit = Math.max(1, params.limit);
    const skip = (page - 1) * limit;

    // Build search query
    const searchQuery = params?.search
      ? { title: { $regex: params.search, $options: 'i' } }
      : {};

    // Build sort query
    const sortQuery: { [key: string]: SortOrder } =
      params.sortBy && params.sortOrder
        ? { [params.sortBy]: params.sortOrder }
        : { createdAt: 'desc' };

    // Execute query with pagination
    const [posts, totalItems] = await Promise.all([
      this.postModel
        .find(searchQuery, {}, { lean: true })
        .skip(skip)
        .limit(limit)
        .sort(sortQuery)
        .populate('author', ['email', 'firstName', 'lastName'])
        .exec(),
      this.postModel.countDocuments(searchQuery),
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: posts,
      meta: {
        pagination: {
          totalItems,
          itemsPerPage: limit,
          currentPage: page,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
        ...((Object.keys(searchQuery).length > 0 ||
          Object.keys(sortQuery).length > 0) && {
          filtering: {
            ...(params.search && { search: params.search }),
            ...(params.sortBy && { sortBy: params.sortBy }),
            ...(params.sortOrder && { sortOrder: params.sortOrder }),
          },
        }),
      },
    };
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postModel.findById(id).populate('author').exec();
    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    return await this.postModel
      .findByIdAndUpdate(id, updatePostDto, { new: true })
      .populate('author')
      .exec();
  }

  async remove(id: string): Promise<Post> {
    const post = await this.postModel.findByIdAndDelete(id).exec();
    return post;
  }
}
