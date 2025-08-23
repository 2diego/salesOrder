# Configuración de NestJS Backend

## Requisitos Previos

- Node.js (versión 18 o superior)
- MySQL
- npm o yarn

## Instalación

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno:**
   Crear un archivo `.env` en la raíz del proyecto con el siguiente contenido:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=tu_password_aqui
   DB_NAME=sales_order_db

   # Application Configuration
   NODE_ENV=development
   PORT=3000

   # JWT Configuration
   JWT_SECRET=tu_clave_secreta_jwt_aqui
   JWT_EXPIRES_IN=24h
   ```

3. **Crear la base de datos:**
   ```sql
   CREATE DATABASE sales_order_db;
   ```

## Estructura del Proyecto

```
src/
├── config/
│   └── database.config.ts    # Configuración de TypeORM
├── entities/                 # Entidades de la base de datos
│   ├── user.entity.ts
│   ├── client.entity.ts
│   ├── category.entity.ts
│   ├── product.entity.ts
│   ├── order.entity.ts
│   ├── order-item.entity.ts
│   ├── order-link.entity.ts
│   ├── order-validation.entity.ts
│   ├── entities-list.ts      # Lista de entidades para TypeORM
│   └── index.ts              # Exportaciones de entidades y enums
├── modules/                  # Módulos de la aplicación (a crear)
├── app.module.ts             # Módulo principal
├── app.controller.ts         # Controlador principal
├── app.service.ts            # Servicio principal
└── main.ts                   # Punto de entrada
```

## Comandos Disponibles

- **Desarrollo:**
  ```bash
  npm run start:dev
  ```

- **Producción:**
  ```bash
  npm run build
  npm run start:prod
  ```

- **Test:**
  ```bash
  npm run test
  npm run test:e2e
  ```

## Entidades de la Base de Datos

El sistema incluye las siguientes entidades principales:

1. **Users** - Usuarios del sistema (admin, seller)
2. **Clients** - Clientes de la empresa
3. **Categories** - Categorías de productos
4. **Products** - Productos disponibles
5. **Orders** - Órdenes de compra
6. **OrderItems** - Items de cada orden
7. **OrderLinks** - Enlaces para compartir órdenes
8. **OrderValidations** - Validaciones de órdenes

## Próximos Pasos

1. Crear los módulos para cada entidad
2. Implementar los controladores y servicios
3. Configurar autenticación JWT
4. Implementar validaciones de datos
5. Crear DTOs para las operaciones
6. Implementar middleware de autorización
