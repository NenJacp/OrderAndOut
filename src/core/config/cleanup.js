const Admin = require('../../Intern/Admin/adminModel');

const cleanupExpiredRegistrations = async () => {
    try {
        const result = await Admin.deleteMany({
            isVerified: false,
            codeExpires: { $lt: Date.now() }
        });
    } catch (error) {
        console.error('Error en limpieza:', error);
    }
};

// Ejecutar cada 1 minuto
setInterval(cleanupExpiredRegistrations, 3600000);

module.exports = cleanupExpiredRegistrations; 