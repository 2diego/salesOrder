# Flujo de Órdenes - Sales Order System

## Descripción del Flujo

### 1. Generación de Link por Vendedor
- El vendedor selecciona un cliente de la lista
- Se genera un link único con token de 24 horas de validez
- El vendedor envía el link al cliente

### 2. Pedido del Cliente
- El cliente accede al link (sin necesidad de registro)
- Completa su pedido seleccionando productos y cantidades
- El sistema calcula automáticamente el monto total
- El cliente confirma el pedido

### 3. Validación por Vendedor
- El vendedor revisa el pedido del cliente
- Puede hacer modificaciones si es necesario
- Valida o cancela la orden

## Estados de la Orden

- `PENDING`: Orden creada, esperando validación
- `VALIDATED`: Orden validada por el vendedor
- `CANCELLED`: Orden cancelada

## Endpoints del Sistema

### Orders (Órdenes)
- `GET /orders` - Listar todas las órdenes (con filtros: clientId, createdById, status)
- `GET /orders/:id` - Obtener orden específica
- `POST /orders` - Crear nueva orden (solo vendedor)
- `PATCH /orders/:id` - Actualizar orden
- `DELETE /orders/:id` - Eliminar orden
- `PATCH /orders/:id/status` - Actualizar estado de la orden
- `POST /orders/:id/calculate-total` - Recalcular monto total

### Order Links (Enlaces de Órdenes)
- `POST /order-links` - Generar link para cliente
- `GET /order-links` - Listar links (con filtros: orderId, createdById, isActive)
- `GET /order-links/:id` - Obtener link específico
- `GET /order-links/token/:token` - Validar y obtener datos del link
- `PATCH /order-links/:id` - Actualizar link
- `PATCH /order-links/:id/deactivate` - Desactivar link
- `DELETE /order-links/:id` - Eliminar link
- `GET /order-links/validate/:token` - Validar token del link

### Order Items (Items de Órdenes)
- `GET /order-items` - Listar items de órdenes (con filtros: orderId, productId)
- `GET /order-items/:id` - Obtener item específico
- `POST /order-items` - Agregar item a orden
- `PATCH /order-items/:id` - Actualizar item
- `DELETE /order-items/:id` - Eliminar item
- `GET /order-items/order/:orderId` - Obtener items de una orden específica

### Order Validations (Validaciones de Órdenes)
- `POST /order-validations` - Validar orden
- `GET /order-validations` - Listar validaciones (con filtros: orderId, validatedById)
- `GET /order-validations/:id` - Obtener validación específica
- `GET /order-validations/order/:orderId` - Obtener validaciones de una orden
- `POST /order-validations/validate` - Validar orden (método simplificado)

## Flujo de Datos

1. **Vendedor crea link**: `POST /order-links` con `clientId`
2. **Cliente accede**: `GET /order-links/:token` para obtener datos
3. **Cliente crea orden**: `POST /orders` con items
4. **Cliente agrega items**: `POST /order-items` para cada producto
5. **Vendedor valida**: `POST /order-validations` para aprobar/cancelar

## Consideraciones Técnicas

- Los links expiran en 24 horas
- Solo el vendedor puede crear links
- Los clientes no necesitan autenticación para acceder al link
- El monto total se calcula automáticamente
- Las validaciones son inmutables una vez creadas

## Resumen de la Implementación

### Entidades Implementadas
- **Order**: Entidad principal de órdenes con estados PENDING, VALIDATED, CANCELLED
- **OrderItem**: Items de las órdenes con relación a productos
- **OrderLink**: Enlaces únicos con tokens de 24 horas de validez
- **OrderValidation**: Validaciones inmutables de las órdenes

### Servicios Implementados
- **OrdersService**: Gestión completa de órdenes con cálculo automático de montos
- **OrdersItemsService**: Gestión de items con recálculo automático de totales
- **OrdersLinksService**: Generación y validación de enlaces únicos
- **OrdersValidationsService**: Validación inmutable de órdenes

### Características Implementadas
- ✅ Cálculo automático del monto total de las órdenes
- ✅ Validación de estados antes de operaciones
- ✅ Generación de tokens únicos para enlaces
- ✅ Expiración automática de enlaces (24 horas)
- ✅ Prevención de modificaciones en órdenes validadas
- ✅ Relaciones completas entre entidades
- ✅ DTOs de validación para todos los endpoints
- ✅ Filtros de búsqueda en todos los listados
- ✅ Manejo de errores con excepciones específicas

### Módulos Configurados
- Todos los módulos están correctamente configurados con TypeORM
- Dependencias inyectadas correctamente
- Exportaciones de servicios para uso en otros módulos
- Integración completa en el AppModule principal
