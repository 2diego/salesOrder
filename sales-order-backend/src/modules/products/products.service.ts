import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'src/entities/product.entity';
import { Category } from 'src/entities/category.entity';
import { CreateProductDTO } from './dto/create-product-dto';
import { UpdateProductDTO } from './dto/update-product-dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createProductDto: CreateProductDTO): Promise<Product> {
    // Verificar que la categoria existe
    const category = await this.categoryRepository.findOne({
      where: { id: createProductDto.categoryId }
    });

    if (!category) {
      throw new NotFoundException(`Categoría con ID ${createProductDto.categoryId} no encontrada`);
    }

    // Verificar si ya existe un producto activo con el mismo código (name)
    const nameTrimmed = createProductDto.name?.trim();
    if (nameTrimmed) {
      const existingByName = await this.productRepository.findOne({
        where: { name: nameTrimmed, isActive: true },
      });
      if (existingByName) {
        throw new ConflictException('Ya existe un producto con este código');
      }
    }

    // Verificar si ya existe un producto con el mismo SKU
    if (createProductDto.sku) {
      const existingProduct = await this.productRepository.findOne({
        where: { sku: createProductDto.sku }
      });

      if (existingProduct) {
        throw new ConflictException('Ya existe un producto con este SKU');
      }
    }

    const product = this.productRepository.create({
      ...createProductDto,
      category
    });

    return this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({
      where: { isActive: true },
      relations: ['category'],
      order: { name: 'ASC' }
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id, isActive: true },
      relations: ['category']
    });

    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDTO): Promise<Product> {
    const product = await this.findOne(id);

    // Si se va a actualizar la categoría, verificar que existe
    if (updateProductDto.categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: updateProductDto.categoryId }
      });

      if (!category) {
        throw new NotFoundException(`Categoría con ID ${updateProductDto.categoryId} no encontrada`);
      }
    }

    // Si se va a actualizar el código (name), verificar que no exista en otro producto activo
    const nameTrimmed = updateProductDto.name?.trim();
    if (nameTrimmed && nameTrimmed !== product.name) {
      const existingByName = await this.productRepository.findOne({
        where: { name: nameTrimmed, isActive: true },
      });
      if (existingByName) {
        throw new ConflictException('Ya existe un producto con este código');
      }
    }

    // Si se va a actualizar el SKU, verificar que no exista
    if (updateProductDto.sku && updateProductDto.sku !== product.sku) {
      const existingProduct = await this.productRepository.findOne({
        where: { sku: updateProductDto.sku }
      });

      if (existingProduct) {
        throw new ConflictException('Ya existe un producto con este SKU');
      }
    }

    await this.productRepository.update(id, updateProductDto);
    
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    const product = await this.findOne(id);

    // Soft delete (archivar/desactivar) para no romper historial de pedidos
    product.isActive = false;
    await this.productRepository.save(product);

    return { message: `Producto "${product.name}" ha sido desactivado` };
  }

  async findByCategory(categoryId: number): Promise<Product[]> {
    return this.productRepository.find({
      where: { category: { id: categoryId }, isActive: true },
      relations: ['category'],
      order: { name: 'ASC' }
    });
  }
}
