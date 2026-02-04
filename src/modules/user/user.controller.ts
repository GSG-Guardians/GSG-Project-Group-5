import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { UserService } from './user.service';
import type { CreateUserDto, UpdateUserDto } from './dto/request.dto';
import {
  CreateUserRequestSwaggerDto,
  UpdateUserRequestSwaggerDto,
  UserResponseSwaggerDto,
} from './dto/swagger.dto';
import {
  userValidationSchema,
  updateUserValidationSchema,
} from './schema/user.schema';

import {
  ApiSuccess,
  ApiSuccessPaginated,
} from '../../helpers/swaggerDTOWrapper.helpers';
import type { IPaginationQuery } from '../../types/pagination.types';
import { ZodValidationPipe } from '../../pipes/zodValidation.pipe';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiBody({ type: CreateUserRequestSwaggerDto })
  @ApiSuccess(UserResponseSwaggerDto)
  create(
    @Body(new ZodValidationPipe(userValidationSchema)) body: CreateUserDto,
  ) {
    return this.userService.create(body);
  }

  @Get()
  @ApiSuccessPaginated(UserResponseSwaggerDto)
  findAll(@Query() query: IPaginationQuery) {
    return this.userService.findAll(query);
  }

  @Get('search')
  @ApiOperation({
    summary: 'Search users',
    description: 'Search users to add participants for group bills',
  })
  @ApiQuery({
    name: 'name',
    required: true,
    description: 'Search query (name or email)',
  })
  searchUsers(@Query('name') name: string) {
    return this.userService.searchUsers(name);
  }

  @Get(':id')
  @ApiSuccess(UserResponseSwaggerDto)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateUserRequestSwaggerDto })
  @ApiSuccess(UserResponseSwaggerDto)
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateUserValidationSchema))
    body: UpdateUserDto,
  ) {
    return this.userService.update(id, body);
  }

  @Delete(':id')
  @ApiSuccess(UserResponseSwaggerDto)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
