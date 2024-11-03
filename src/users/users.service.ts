import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { FilterQuery, Model } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
import { ApiResponse } from 'src/utils/response.utils';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password, firstName, lastName } = createUserDto;

    // Check if user already exists
    const existingUser = await this.userModel.findOne({ email }).exec();

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new this.userModel({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    const savedUser = await newUser.save();
    const { password: _, ...result } = savedUser.toObject();
    return ApiResponse.success(result, 'User created successfully');
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(query: FilterQuery<User>): Promise<User | null> {
    const user = await this.userModel.findOne(query).select('+password').exec();
    return user.toJSON();
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
