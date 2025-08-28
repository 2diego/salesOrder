import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from 'src/entities/category.entity';
import { CreateCategoryDTO } from './dto/create-category-dto';
import { UpdateCategoryDTO } from './dto/update-category-dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDTO): Promise<Category> {
    // Verificar si ya existe una categoría con el mismo nombre
    const existingCategory = await this.categoryRepository.findOne({
      where: { name: createCategoryDto.name }
    });

    if (existingCategory) {
      throw new ConflictException('Category with this name already exists');
    }

    const category = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find({
      order: { name: 'ASC' }
    });
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id }
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDTO): Promise<Category> {
    const category = await this.findOne(id);

    // Si se va a actualizar el nombre, verificar que no exista
    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const existingCategory = await this.categoryRepository.findOne({
        where: { name: updateCategoryDto.name }
      });

      if (existingCategory) {
        throw new ConflictException('Category with this name already exists');
      }
    }

    await this.categoryRepository.update(id, updateCategoryDto);
    
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    const category = await this.findOne(id);
    
    // Verificar si hay productos usando esta categoría
    const productsCount = await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoin('category.products', 'product')
      .where('category.id = :id', { id })
      .getCount();

    if (productsCount > 0) {
      throw new ConflictException('Cannot delete category that has products');
    }

    await this.categoryRepository.remove(category);
    
    return { message: `Category "${category.name}" has been deleted` };
  }
}
