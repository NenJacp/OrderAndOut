# Documentación del Modelo de Administrador

El modelo de administrador define la estructura de los datos para los administradores en la base de datos. A continuación, se describe cada campo del modelo:

### Campos del Modelo

#### firstName
- Tipo: `String`
- Requerido: Sí
- Trim: Sí
- Máximo de caracteres: 50
- Descripción: El nombre del administrador.

#### lastName
- Tipo: `String`
- Requerido: Sí
- Trim: Sí
- Descripción: El apellido del administrador.

#### birthDate
- Tipo: `Date`
- Requerido: Sí
- Descripción: La fecha de nacimiento del administrador.

#### phone
- Tipo: `String`
- Requerido: Sí
- Único: Sí
- Validación: Expresión regular para números telefónicos válidos
- Descripción: El número telefónico del administrador.

#### email
- Tipo: `String`
- Requerido: Sí
- Único: Sí
- Validación: Expresión regular para correos electrónicos válidos
- Descripción: El correo electrónico del administrador.

#### password
- Tipo: `String`
- Requerido: Sí
- Descripción: La contraseña del administrador.

#### restaurant
- Tipo: `ObjectId`
- Referencia: `Restaurant`
- Predeterminado: `null`
- Descripción: La referencia al restaurante asociado al administrador.

#### creationDate
- Tipo: `Date`
- Predeterminado: `Date.now`
- Descripción: La fecha de creación del administrador.

#### isVerified
- Tipo: `Boolean`
- Predeterminado: `false`
- Descripción: Indica si el administrador ha completado la verificación por correo electrónico.

#### verificationCode
- Tipo: `String`
- Índice: Sí
- Expiración: 3600 segundos (1 hora)
- Descripción: Código de verificación temporal para el proceso de verificación.

#### codeExpires
- Tipo: `Date`
- Predeterminado: `null`
- Descripción: La fecha de expiración del código de verificación.

#### resetPasswordCode
- Tipo: `String`
- Predeterminado: `null`
- Descripción: Código de restablecimiento de contraseña.

#### resetPasswordExpires
- Tipo: `Date`
- Predeterminado: `null`
- Descripción: La fecha de expiración del código de restablecimiento de contraseña.

### Opciones del Esquema

- `timestamps`: Activado para incluir automáticamente campos de fecha de creación y actualización.

### Índices

- Índice compuesto sobre `email`, `phone`, y `isVerified` para búsquedas rápidas.

### Exportación

El modelo de administrador se exporta como `Admin` para su uso en otros módulos.
