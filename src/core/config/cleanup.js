////////////////////////////////////////////////////////////
//            LIMPIEZA DE REGISTROS EXPIRADOS            ///
// Propósito: Eliminar registros de administradores no   ///
// verificados después de 1 hora                        ///
// Programación: Ejecución cada hora vía setInterval    ///
////////////////////////////////////////////////////////////

const Admin = require('../../modules/Admin/adminModel');

/**
 * @function cleanupExpiredRegistrations
 * @desc Elimina registros de admins no verificados con código expirado
 * @returns {Object} - Resultado de la operación MongoDB
 */
const cleanupExpiredRegistrations = async () => {
    try {
        const result = await Admin.deleteMany({
            isVerified: false,
            codeExpires: { $lt: Date.now() }
        });
        console.log(`🧹 Limpiados ${result.deletedCount} registros expirados`);
    } catch (error) {
        console.error('❌ Error en limpieza:', error);
    }
};

// Programar ejecución cada 1 hora (3600000 ms)
setInterval(cleanupExpiredRegistrations, 3600000);

module.exports = cleanupExpiredRegistrations; 