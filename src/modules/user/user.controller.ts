import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UploadedFile,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import {
  ApiBody,
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiBearerAuth,
  ApiConsumes,
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
import type { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { FolderInterceptor } from '../../interceptors/assetFolder.interceptor';
import { AssetCleanupInterceptor } from '../../interceptors/assetCleanup.interceptor';
import { Roles } from '../../decorators/roles.decorators';
import { UserRole } from 'database/enums';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
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
  @UseInterceptors(
    FileInterceptor('avatar'),
    FolderInterceptor('USER'),
    AssetCleanupInterceptor,
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateUserRequestSwaggerDto })
  @ApiSuccess(UserResponseSwaggerDto)
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateUserValidationSchema))
    body: UpdateUserDto,
    @Req() request: Request,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.userService.update(
      request.user!.id,
      id,
      request.user!.role,
      body,
      file,
    );
  }

  @Roles([UserRole.ADMIN])
  @Delete(':id')
  @ApiSuccess(UserResponseSwaggerDto)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
