import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { JwtUser } from '../../auth/jwt-user';
import { UserRole } from '../../entities/user.entity';
import { ChangeOwnPasswordDto } from './dto/change-own-password.dto';
import { CreateUserDTO } from './dto/create-user-dto';
import { UpdateUserDTO } from './dto/update-user-dto';
import { UserResponseDTO } from './dto/user-response-dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  async create(@Body() newUser: CreateUserDTO): Promise<UserResponseDTO> {
    return this.usersService.create(newUser);
  }

  @Get()
  async findAll(): Promise<UserResponseDTO[]> {
    return this.usersService.findAll();
  }

  @Patch('me/password')
  async changeOwnPassword(
    @Req() req: Request & { user: JwtUser },
    @Body() dto: ChangeOwnPasswordDto,
  ): Promise<{ message: string }> {
    return this.usersService.changePassword(
      req.user.userId,
      dto.currentPassword,
      dto.newPassword,
    );
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDTO> {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDTO,
  ): Promise<UserResponseDTO> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    return this.usersService.remove(id);
  }
}
