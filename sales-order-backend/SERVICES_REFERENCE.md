# Referencia de Servicios - Sales Order System

## 📋 Resumen de Servicios

Este documento contiene la lista completa de todos los servicios implementados en el sistema de órdenes de venta, incluyendo sus métodos y funcionalidades.

---

## 🔧 Servicios del Sistema

### 1. **UsersService** (`/modules/users/`)
**Propósito**: Gestión completa de usuarios del sistema

#### Métodos Públicos:
- `create(createUserDto: CreateUserDTO): Promise<UserResponseDTO>`
  - Crea un nuevo usuario con validación de duplicados
  - Hashea la contraseña automáticamente
  - Valida username y email únicos

- `findAll(): Promise<UserResponseDTO[]>`
  - Obtiene todos los usuarios activos
  - Ordenados por fecha de creación descendente

- `findOne(id: number): Promise<UserResponseDTO>`
  - Busca un usuario por ID
  - Solo usuarios activos

- `findByUsername(username: string): Promise<User | null>`
  - Busca usuario por nombre de usuario
  - Para autenticación

- `update(id: number, updateUserDto: UpdateUserDTO): Promise<UserResponseDTO>`
  - Actualiza datos del usuario
  - Valida duplicados en username/email
  - Hashea nueva contraseña si se proporciona

- `remove(id: number): Promise<{ message: string }>`
  - Soft delete: marca usuario como inactivo
  - No elimina físicamente el registro

#### Métodos Privados:
- `mapToResponseDTO(user: User): UserResponseDTO`
  - Mapea entidad User a DTO de respuesta

---

### 2. **CategoriesService** (`/modules/categories/`)
**Propósito**: Gestión de categorías de productos

#### Métodos Públicos:
- `create(createCategoryDto: CreateCategoryDTO): Promise<Category>`
  - Crea nueva categoría
  - Valida nombre único

- `findAll(): Promise<Category[]>`
  - Lista todas las categorías
  - Ordenadas alfabéticamente

- `findOne(id: number): Promise<Category>`
  - Busca categoría por ID

- `update(id: number, updateCategoryDto: UpdateCategoryDTO): Promise<Category>`
  - Actualiza categoría
  - Valida nombre único

- `remove(id: number): Promise<{ message: string }>`
  - Elimina categoría
  - Valida que no tenga productos asociados

---

### 3. **ProductsService** (`/modules/products/`)
**Propósito**: Gestión de productos del catálogo

#### Métodos Públicos:
- `create(createProductDto: CreateProductDTO): Promise<Product>`
  - Crea nuevo producto
  - Valida que la categoría exista
  - Valida SKU único

- `findAll(): Promise<Product[]>`
  - Lista todos los productos
  - Incluye relación con categoría
  - Ordenados alfabéticamente

- `findOne(id: number): Promise<Product>`
  - Busca producto por ID
  - Incluye relación con categoría

- `update(id: number, updateProductDto: UpdateProductDTO): Promise<Product>`
  - Actualiza producto
  - Valida categoría y SKU únicos

- `remove(id: number): Promise<{ message: string }>`
  - Elimina producto
  - Valida que no esté en órdenes

- `findByCategory(categoryId: number): Promise<Product[]>`
  - Lista productos por categoría
  - Incluye relación con categoría

---

### 4. **ClientsService** (`/modules/clients/`)
**Propósito**: Gestión de clientes

#### Métodos Públicos:
- `create(createClientDto: CreateClientDTO): Promise<Client>`
  - Crea nuevo cliente
  - Valida email único

- `findAll(): Promise<Client[]>`
  - Lista todos los clientes
  - Ordenados alfabéticamente

- `findOne(id: number): Promise<Client>`
  - Busca cliente por ID

- `update(id: number, updateClientDto: UpdateClientDTO): Promise<Client>`
  - Actualiza cliente
  - Valida email único

- `remove(id: number): Promise<{ message: string }>`
  - Elimina cliente
  - Valida que no tenga órdenes asociadas

- `findByEmail(email: string): Promise<Client | null>`
  - Busca cliente por email

---

### 5. **OrdersService** (`/modules/orders/`)
**Propósito**: Gestión completa de órdenes de venta

#### Métodos Públicos:
- `create(createOrderDto: CreateOrderDto): Promise<OrderResponseDto>`
  - Crea nueva orden
  - Inicializa monto total en 0

- `findAll(filters?: { clientId?, createdById?, status? }): Promise<OrderResponseDto[]>`
  - Lista órdenes con filtros opcionales
  - Incluye todas las relaciones

- `findOne(id: number): Promise<OrderResponseDto>`
  - Busca orden por ID
  - Incluye todas las relaciones

- `update(id: number, updateOrderDto: UpdateOrderDto): Promise<OrderResponseDto>`
  - Actualiza orden
  - Valida que no esté validada

- `remove(id: number): Promise<void>`
  - Elimina orden
  - Valida que no esté validada

- `calculateTotalAmount(orderId: number): Promise<number>`
  - Recalcula monto total de la orden
  - Basado en items y precios

- `updateStatus(id: number, status: OrderStatus): Promise<OrderResponseDto>`
  - Actualiza estado de la orden

#### Métodos Privados:
- `formatOrderResponse(order: Order): OrderResponseDto`
  - Formatea respuesta con todas las relaciones

---

### 6. **OrdersItemsService** (`/modules/orders-items/`)
**Propósito**: Gestión de items de órdenes

#### Métodos Públicos:
- `create(createOrderItemDto: CreateOrderItemDto): Promise<OrderItemResponseDto>`
  - Agrega item a orden
  - Valida que la orden no esté validada
  - Si existe el producto, suma cantidades
  - Recalcula total automáticamente

- `findAll(filters?: { orderId?, productId? }): Promise<OrderItemResponseDto[]>`
  - Lista items con filtros opcionales
  - Incluye relaciones con producto y orden

- `findOne(id: number): Promise<OrderItemResponseDto>`
  - Busca item por ID

- `update(id: number, updateOrderItemDto: UpdateOrderItemDto): Promise<OrderItemResponseDto>`
  - Actualiza item
  - Valida que la orden no esté validada
  - Recalcula total automáticamente

- `remove(id: number): Promise<void>`
  - Elimina item
  - Valida que la orden no esté validada
  - Recalcula total automáticamente

- `findByOrderId(orderId: number): Promise<OrderItemResponseDto[]>`
  - Lista items de una orden específica

#### Métodos Privados:
- `recalculateOrderTotal(orderId: number): Promise<void>`
  - Recalcula monto total de la orden
- `formatOrderItemResponse(orderItem: OrderItem): OrderItemResponseDto`
  - Formatea respuesta del item

---

### 7. **OrdersLinksService** (`/modules/orders-links/`)
**Propósito**: Gestión de enlaces de órdenes para clientes

#### Métodos Públicos:
- `create(createOrderLinkDto: CreateOrderLinkDto): Promise<OrderLinkResponseDto>`
  - Genera enlace único para cliente
  - Valida que no exista enlace activo
  - Genera token único de 64 caracteres
  - Expira en 24 horas por defecto

- `findAll(filters?: { orderId?, createdById?, isActive? }): Promise<OrderLinkResponseDto[]>`
  - Lista enlaces con filtros opcionales
  - Incluye relaciones con orden y usuario

- `findOne(id: number): Promise<OrderLinkResponseDto>`
  - Busca enlace por ID

- `findByToken(token: string): Promise<OrderLinkResponseDto>`
  - Busca enlace por token
  - Valida que esté activo y no haya expirado

- `update(id: number, updateOrderLinkDto: UpdateOrderLinkDto): Promise<OrderLinkResponseDto>`
  - Actualiza enlace

- `deactivate(id: number): Promise<OrderLinkResponseDto>`
  - Desactiva enlace

- `remove(id: number): Promise<void>`
  - Elimina enlace

- `validateToken(token: string): Promise<boolean>`
  - Valida si un token es válido

#### Métodos Privados:
- `generateUniqueToken(): string`
  - Genera token único de 64 caracteres
- `formatOrderLinkResponse(orderLink: OrderLink): OrderLinkResponseDto`
  - Formatea respuesta del enlace

---

### 8. **OrdersValidationsService** (`/modules/orders-validations/`)
**Propósito**: Gestión de validaciones de órdenes

#### Métodos Públicos:
- `create(createOrderValidationDto: CreateOrderValidationDto): Promise<OrderValidationResponseDto>`
  - Crea validación de orden
  - Valida que la orden no esté ya validada
  - Actualiza estado de la orden automáticamente

- `findAll(filters?: { orderId?, validatedById? }): Promise<OrderValidationResponseDto[]>`
  - Lista validaciones con filtros opcionales
  - Incluye relaciones con orden y validador

- `findOne(id: number): Promise<OrderValidationResponseDto>`
  - Busca validación por ID

- `findByOrderId(orderId: number): Promise<OrderValidationResponseDto[]>`
  - Lista validaciones de una orden

- `update(id: number, updateOrderValidationDto: UpdateOrderValidationDto): Promise<OrderValidationResponseDto>`
  - **NO PERMITIDO**: Las validaciones son inmutables

- `remove(id: number): Promise<void>`
  - **NO PERMITIDO**: Las validaciones no se pueden eliminar

- `validateOrder(orderId: number, validatedById: number, status: OrderStatus, notes?: string): Promise<OrderValidationResponseDto>`
  - Método simplificado para validar orden

#### Métodos Privados:
- `formatOrderValidationResponse(orderValidation: OrderValidation): OrderValidationResponseDto`
  - Formatea respuesta de la validación

---

## 🔄 Flujo de Integración entre Servicios

### Creación de Orden Completa:
1. **OrdersService.create()** → Crea orden inicial
2. **OrdersItemsService.create()** → Agrega items (recalcula total)
3. **OrdersLinksService.create()** → Genera enlace para cliente
4. **OrdersValidationsService.create()** → Valida orden final

### Características de Integración:
- **Recálculo Automático**: OrdersItemsService recalcula totales
- **Validación de Estados**: Todos los servicios validan estados antes de operaciones
- **Relaciones Completas**: Todos los servicios incluyen relaciones necesarias
- **Manejo de Errores**: Excepciones específicas para cada caso

---

## 📊 Estadísticas de Implementación

- **Total de Servicios**: 8
- **Total de Métodos Públicos**: 45
- **Total de Métodos Privados**: 8
- **Servicios con Recálculo Automático**: 2 (Orders, OrdersItems)
- **Servicios con Validación de Estados**: 4 (Orders, OrdersItems, OrdersLinks, OrdersValidations)
- **Servicios con Soft Delete**: 1 (Users)
- **Servicios Inmutables**: 1 (OrdersValidations)

---

## 🎯 Patrones de Diseño Utilizados

- **Repository Pattern**: Todos los servicios usan TypeORM Repository
- **DTO Pattern**: Separación de datos de entrada/salida
- **Service Layer Pattern**: Lógica de negocio encapsulada
- **Dependency Injection**: Inyección de dependencias con NestJS
- **Exception Handling**: Manejo centralizado de errores
- **Data Validation**: Validación con class-validator

---

*Documento generado automáticamente - Sales Order System v1.0*
