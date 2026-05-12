import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryDeepPartialEntity } from 'typeorm';
import { User, UserRole } from '../../entities/user.entity';
import { CreateUserDTO } from './dto/create-user-dto';
import { UpdateUserDTO } from './dto/update-user-dto';
import { UserResponseDTO } from './dto/user-response-dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDTO): Promise<UserResponseDTO> {
    const existingUser = await this.userRepository.findOne({
      where: [{ username: createUserDto.username }, { email: createUserDto.email }],
    });

    if (existingUser) {
      throw new ConflictException(
        'El nombre de usuario o correo electrónico ya existe',
      );
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = this.userRepository.create({
      username: createUserDto.username,
      email: createUserDto.email,
      passwordHash: hashedPassword,
      role: createUserDto.role || UserRole.SELLER,
      name: createUserDto.name,
      phone: createUserDto.phone,
      isActive: createUserDto.isActive ?? true,
    });

    const savedUser = await this.userRepository.save(newUser);
    return this.mapToResponseDTO(savedUser);
  }

  async findAll(): Promise<UserResponseDTO[]> {
    const users = await this.userRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });

    return users.map((user) => this.mapToResponseDTO(user));
  }

  async findOne(id: number): Promise<UserResponseDTO> {
    const user = await this.userRepository.findOne({
      where: { id, isActive: true },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return this.mapToResponseDTO(user);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { username, isActive: true },
    });
  }

  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: { id: userId, isActive: true },
    });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    const matches = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!matches) {
      throw new UnauthorizedException('Contraseña actual incorrecta');
    }

    await this.userRepository.update(userId, {
      passwordHash: await bcrypt.hash(newPassword, 10),
    });

    return { message: 'Contraseña actualizada' };
  }

  async update(id: number, updateUserDto: UpdateUserDTO): Promise<UserResponseDTO> {
    const user = await this.userRepository.findOne({
      where: { id, isActive: true },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    if (updateUserDto.username || updateUserDto.email) {
      const existingUser = await this.userRepository.findOne({
        where: [
          { username: updateUserDto.username ?? user.username },
          { email: updateUserDto.email ?? user.email },
        ],
      });

      if (existingUser && existingUser.id !== id) {
        throw new ConflictException(
          'El nombre de usuario o correo electrónico ya existe',
        );
      }
    }

    const updateData: QueryDeepPartialEntity<User> = {};

    if (updateUserDto.username) updateData.username = updateUserDto.username;
    if (updateUserDto.email) updateData.email = updateUserDto.email;
    if (updateUserDto.name) updateData.name = updateUserDto.name;
    if (updateUserDto.phone) updateData.phone = updateUserDto.phone;
    if (updateUserDto.role) updateData.role = updateUserDto.role;
    if (updateUserDto.isActive !== undefined)
      updateData.isActive = updateUserDto.isActive;

    if (updateUserDto.password) {
      updateData.passwordHash = await bcrypt.hash(updateUserDto.password, 10);
    }

    await this.userRepository.update(id, updateData);

    const updatedUser = await this.userRepository.findOne({
      where: { id },
    });

    if (!updatedUser) {
      throw new NotFoundException(
        `Usuario con ID ${id} no encontrado tras la actualización`,
      );
    }

    return this.mapToResponseDTO(updatedUser);
  }

  async remove(id: number): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: { id, isActive: true },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    await this.userRepository.update(id, { isActive: false });

    return { message: `Usuario con ID ${id} ha sido desactivado` };
  }

  private mapToResponseDTO(user: User): UserResponseDTO {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      name: user.name,
      phone: user.phone,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
