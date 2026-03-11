/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user-dto';
import { UpdateUserDTO } from './dto/update-user-dto';
import { UserResponseDTO } from './dto/user-response-dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}
  
  async create(createUserDto: CreateUserDTO): Promise<UserResponseDTO> {
    // Verificar duplicados
    const existingUser = await this.userRepository.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email }
      ]
    });
  
    if (existingUser) {
      throw new ConflictException('El nombre de usuario o correo electrónico ya existe');
    }
  
    // Hash de la contraseña y mapeo correcto
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
  
    const newUser = this.userRepository.create({
      username: createUserDto.username,
      email: createUserDto.email,
      passwordHash: hashedPassword, // Mapear a passwordHash
      role: createUserDto.role || UserRole.SELLER,
      name: createUserDto.name,
      phone: createUserDto.phone,
      isActive: createUserDto.isActive ?? true, // Valor por defecto
    });

    const savedUser = await this.userRepository.save(newUser);
    return this.mapToResponseDTO(savedUser);
  }

  async findAll(): Promise<UserResponseDTO[]> {
    const users = await this.userRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' }
    });
    
    return users.map(user => this.mapToResponseDTO(user));
  }

  async findOne(id: number): Promise<UserResponseDTO> {
    const user = await this.userRepository.findOne({
      where: { id, isActive: true }
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return this.mapToResponseDTO(user);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { username, isActive: true }
    });
  }

  async update(id: number, updateUserDto: UpdateUserDTO): Promise<UserResponseDTO> {
    const user = await this.userRepository.findOne({
      where: { id, isActive: true }
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    // Si se va a actualizar username o email, verificar que no existan
    if (updateUserDto.username || updateUserDto.email) {
      const existingUser = await this.userRepository.findOne({
        where: [
          { username: updateUserDto.username || user.username },
          { email: updateUserDto.email || user.email }
        ]
      });

      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('El nombre de usuario o correo electrónico ya existe');
      }
    }

    // Preparar datos de actualización
    const updateData: any = {};
    
    if (updateUserDto.username) updateData.username = updateUserDto.username;
    if (updateUserDto.email) updateData.email = updateUserDto.email;
    if (updateUserDto.name) updateData.name = updateUserDto.name;
    if (updateUserDto.phone) updateData.phone = updateUserDto.phone;
    if (updateUserDto.role) updateData.role = updateUserDto.role;
    if (updateUserDto.isActive !== undefined) updateData.isActive = updateUserDto.isActive;
    
    // Si se actualiza la contraseña, hashearla
    if (updateUserDto.password) {
      const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
      updateData.passwordHash = hashedPassword;
    }

    // Actualizar solo los campos proporcionados
    await this.userRepository.update(id, updateData);

    // Obtener el usuario actualizado
    const updatedUser = await this.userRepository.findOne({
      where: { id }
    });

    if (!updatedUser) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado tras la actualización`);
    }

    return this.mapToResponseDTO(updatedUser);
  }

  async remove(id: number): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: { id, isActive: true }
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    // Soft delete: marcar como inactivo en lugar de eliminar
    await this.userRepository.update(id, { isActive: false });

    return { message: `Usuario con ID ${id} ha sido desactivado` };
  }

  // Método auxiliar para mapear User a UserResponseDTO
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
      updatedAt: user.updatedAt
    };
  }
}
