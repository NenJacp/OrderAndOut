module.exports = {
    cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        domain: process.env.COOKIE_DOMAIN || 'localhost',
        path: '/',
        maxAge: 2 * 60 * 60 * 1000 // 2 horas
    }
}; 