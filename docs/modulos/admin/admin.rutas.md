# Documentación de Obsidian para el Módulo de Administrador

## Rutas del Administrador

| Endpoint           | Método   | Parámetros                                                         | Respuesta                               |
| ------------------ | -------- | ------------------------------------------------------------------ | --------------------------------------- |
| `/start-register`  | `POST`   | `firstName`, `lastName`, `birthDate`, `phone`, `email`, `password` | tempId, envio de codigo al correo       |
| `/verify-account`  | `POST`   | `tempId`, `code`                                                   | Mensaje de éxito o error                |
| `/login/admin`     | `POST`   | `email`, `password`                                                | Token de autenticación o error          |
| `/forgot-password` | `POST`   | `email`                                                            | Mensaje de éxito o error                |
| `/reset-password`  | `POST`   | `email`, `code`, `newPassword`                                     | Mensaje de éxito o error                |
| `/me`              | `GET`    | Ninguno                                                            | Detalles del administrador autenticado  |
| `/me`              | `PUT`    | Campos a actualizar                                                | Administrador actualizado               |
| `/`                | `GET`    | Ninguno                                                            | Lista de todos los administradores      |
| `/:id`             | `GET`    | `id`                                                               | Detalles del administrador especificado |
| `/:id`             | `PUT`    | Campos a actualizar                                                | Administrador actualizado               |
| `/:id`             | `DELETE` | `id`                                                               | Mensaje de éxito o error                |