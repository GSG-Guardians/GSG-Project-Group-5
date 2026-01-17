import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { IdCheckDto } from 'src/Dtos/id-check.dto';
import { AdminRequestDto } from 'src/Dtos/user/admin.request.dto';
import { SearchUserDto } from 'src/Dtos/user/search-user.dto';
import { UserRoleFilterDto } from 'src/Dtos/user/user-role.filter.dto';
import { UserRequestDto } from 'src/Dtos/user/user.request.dto';
import { UserResponseDto } from 'src/Dtos/user/user.response.dto';
import { UpdateUserDto } from 'src/Dtos/user/user.update.dto';
import { UserE } from 'src/entities/user.entity';
import { RolesEnum } from 'src/enums/roles.enum';
import { UserService } from 'src/services/user.service';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a new admin' })
  @ApiBody({ type: AdminRequestDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'admin created successfully',
  })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Conflict' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  // @Roles([RolesEnum.ADMIN])
  @Post('create-admin')
  async createAdmin(
    @Body(new ValidationPipe()) adminRequestDto: AdminRequestDto,
  ) {
    return await this.userService.createUser(adminRequestDto);
  }

  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a new user' })
  @ApiBody({ type: UserRequestDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User created successfully',
  })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Conflict' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  // @Roles([RolesEnum.ADMIN])
  @Post('create-user')
  async createUser(
    @Body(new ValidationPipe())
    userRequestDto: UserRequestDto,
  ) {
    return await this.userService.createUser(userRequestDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'get all users' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'users retrieved successfully',
    isArray: true,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  @Roles([RolesEnum.ADMIN])
  @Get('all')
  async findAll(@Query() userRoleFilterDto: UserRoleFilterDto) {
    return await this.userService.findAll(userRoleFilterDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user Profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'user returned successfuly',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  @Roles([RolesEnum.ADMIN, RolesEnum.USER])
  @Get('me')
  async me(@CurrentUser() user: UserE) {
    // const userProfile = await this.userService.findOne(user.id);
    // if (!userProfile) {
    //   throw new NotFoundException('User not found ');
    // }
    return user;
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Search users by first name or last name' })
  @ApiQuery({
    name: 'searchTerm',
    description: 'Search term for first name or last name',
    required: true,
    type: String,
    example: 'john',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of users matching the search term',
    type: [UserResponseDto], // Use your User response DTO
  })
  @Roles([RolesEnum.ADMIN])
  @Get('search')
  async searchUsers(
    @Query(new ValidationPipe()) searchUserDto: SearchUserDto,
  ): Promise<UserResponseDto[]> {
    const users = await this.userService.searchByName(searchUserDto);
    return users.map((user) => UserResponseDto.createFromEntity(user));
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Terminate a User (soft delete)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User terminated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request - No approved termination request found',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  @ApiParam({ name: 'id', type: String, description: 'User UUID v4' })
  @Roles([RolesEnum.ADMIN])
  @Delete('terminate/:id')
  async terminateuser(@Param() params: IdCheckDto) {
    const user = await this.userService.terminateUser(params.id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return UserResponseDto.createFromEntity(user);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update User information' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User updated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Conflict - Unique field already exists',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Guard not found',
  })
  @ApiParam({ name: 'id', type: String, description: 'User UUID v4' })
  @Roles([RolesEnum.ADMIN])
  @Patch('update/:id')
  async updateUser(
    @Param() params: IdCheckDto,
    @Body(new ValidationPipe()) updateGuardDto: UpdateUserDto,
  ) {
    const user = await this.userService.updateUser(params.id, updateGuardDto);
    return UserResponseDto.createFromEntity(user);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'get User by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User returned successfuly',
    type: UserResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'NOT_FOUND' })
  @ApiParam({ name: 'id', type: String, description: 'uuid ID' })
  @Roles([RolesEnum.ADMIN])
  @Get(':id')
  async findOneById(@Param() id: IdCheckDto) {
    const user = await this.userService.findOne(id.id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return UserResponseDto.createFromEntity(user);
  }
}
