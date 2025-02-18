# Controlador del Administrador

El controlador del administrador maneja las solicitudes entrantes y las redirige a los servicios correspondientes. Los métodos incluyen:

| Método | Descripción |
| --- | --- |
| `startRegistration` | Inicia el registro de un nuevo administrador |
| `verifyAndActivate` | Verifica y activa una cuenta de administrador |
| `loginAdmin` | Inicia sesión como administrador |
| `requestPasswordReset` | Solicita el restablecimiento de la contraseña del administrador |
| `resetPassword` | Restablece la contraseña del administrador |
| `getAllAdmins` | Obtiene una lista de todos los administradores |
| `getAdminById` | Obtiene los detalles de un administrador específico |
| `updateAdminById` | Actualiza los detalles de un administrador específico |
| `deleteAdminById` | Elimina un administrador específico |
| `getAdminByJWT` | Obtiene los detalles del administrador autenticado |
| `updateAdminByJWT` | Actualiza los detalles del administrador autenticado |

## Servicio del Administrador

El servicio del administrador proporciona las operaciones CRUD para los administradores. Los métodos incluyen:

| Método | Descripción |
| --- | --- |
| `createAdmin` | Crea un nuevo administrador |
| `getAdminByEmail` | Busca un administrador por correo electrónico |
| `getAllAdmins` | Obtiene una lista de todos los administradores |
| `getAdminById` | Obtiene los detalles de un administrador específico |
| `updateAdminById` | Actualiza los detalles de un administrador específico |
| `deleteAdminById` | Elimina un administrador específico |
