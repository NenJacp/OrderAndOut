import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import connectDB from '../config/mongoDB.js';
import Admin from '../modules/Admin/admin.model.js';
import Order from '../modules/Order/order.model.js';
import Kiosk from '../modules/Kiosk/kiosk.model.js';
import Product from '../modules/Product/product.model.js';
import Category from '../modules/Category/category.model.js';
import Restaurant from '../modules/Restaurant/restaurant.model.js';
import StripeAccount from '../modules/Stripe/stripe.model.js';

const generateFakeData = async () => {
    await connectDB();
    console.log('✅ Conexión a la base de datos establecida.');

    // Contador para números de teléfono
    let phoneCounter = 9999009995;

    // Generar datos falsos
    for (let i = 0; i < 100; i++) {
        // Generar un administrador
        const admin = new Admin({
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            birthDate: faker.date.past(30),
            phone: phoneCounter.toString(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            restaurant: null,
            isVerified: faker.datatype.boolean(),
            verificationCode: faker.string.alphanumeric(10),
            resetPasswordCode: faker.string.alphanumeric(10),
        });
        await admin.save();
        console.log(`👤 Administrador ${i + 1} creado: ${admin.firstName} ${admin.lastName}, Teléfono: ${admin.phone}`);
        phoneCounter--; // Decrementar el contador

        // Generar un restaurante
        const restaurant = new Restaurant({
            name: faker.company.name(),
            image: faker.image.url(),
            location: {
                country: faker.location.country(),
                city: faker.location.city(),
                address: {
                    street: faker.location.street(),
                    number: faker.number.int({ min: 1, max: 100 }).toString(),
                    crossStreets: faker.location.street(),
                    colony: faker.location.city(),
                    references: faker.location.secondaryAddress(),
                },
                postalCode: faker.location.zipCode(),
                coordinates: {
                    lat: faker.location.latitude(),
                    lng: faker.location.longitude(),
                },
            },
            contact: {
                phone: phoneCounter.toString(),
                email: faker.internet.email(),
                website: faker.internet.url(),
            },
            adminId: admin._id, // Asignar el ID del administrador creado
        });
        await restaurant.save();
        console.log(`🏢 Restaurante ${i + 1} creado: ${restaurant.name}, Teléfono: ${restaurant.contact.phone}, Admin ID: ${restaurant.adminId}`);
        phoneCounter--; // Decrementar el contador

        // Generar una categoría
        const category = new Category({
            name: faker.commerce.department(),
            description: faker.commerce.productDescription(),
            restaurantId: restaurant._id, // Asignar el ID del restaurante creado
        });
        await category.save();
        console.log(`📦 Categoría ${i + 1} creada: ${category.name}`);

        // Generar un producto
        const product = new Product({
            name: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            image: faker.image.url(),
            costPrice: faker.commerce.price(1, 100, 2),
            salePrice: faker.commerce.price(1, 100, 2),
            currency: 'MXN',
            availability: faker.datatype.boolean(),
            ingredients: [faker.commerce.productMaterial(), faker.commerce.productMaterial()],
            restaurantId: restaurant._id, // Asignar el ID del restaurante creado
            category: category._id, // Asignar el ID de la categoría creada
        });
        // Asegurarse de que el precio de venta sea mayor que el costo
        if (product.salePrice <= product.costPrice) {
            product.salePrice = product.costPrice + 1;
        }
        await product.save();
        console.log(`🍔 Producto ${i + 1} creado: ${product.name}, Precio de venta: ${product.salePrice}`);

        // Generar un kiosco
        const kiosk = new Kiosk({
            name: faker.company.name(),
            password: faker.internet.password(),
            description: faker.lorem.sentence(),
            restaurantId: restaurant._id, // Asignar el ID del restaurante creado
            status: 'activo',
            tokenDuration: '7d',
            isConnected: faker.datatype.boolean(),
        });
        await kiosk.save();
        console.log(`🖥️ Kiosco ${i + 1} creado: ${kiosk.name}`);

        // Generar una orden
        const order = new Order({
            numOrder: faker.string.uuid(), // Generar un UUID
            products: [
                {
                    productId: product._id, // Asignar el ID del producto creado
                    name: product.name,
                    quantity: faker.number.int({ min: 1, max: 10 }),
                    costPrice: product.costPrice,
                    salePrice: product.salePrice,
                    category: {
                        id: category._id, // Asignar el ID de la categoría creada
                        name: category.name,
                    },
                },
            ],
            totalCost: faker.commerce.price(1, 100, 2),
            totalSale: faker.commerce.price(1, 100, 2),
            status: 'pendiente',
            notes: faker.lorem.sentence(),
            createdById: null, // Puedes asignar un usuario si lo deseas
            createdByName: faker.person.firstName() + ' ' + faker.person.lastName(),
            createdByType: 'customer',
            restaurantId: restaurant._id, // Asignar el ID del restaurante creado
            restaurantName: restaurant.name,
            customerName: faker.person.firstName() + ' ' + faker.person.lastName(),
            paymentId: null, // Puedes asignar un pago si lo deseas
            paymentMethod: 'efectivo',
            currency: 'MXN',
            orderType: 'llevar',
            paymentStatus: 'pendiente',
            stripePaymentId: null,
            stripePaymentUrl: null,
        });
        await order.save();
        console.log(`📋 Orden ${i + 1} creada: ${order.numOrder}, Cliente: ${order.customerName}`);

        // Generar una cuenta de Stripe
        const stripeAccount = new StripeAccount({
            restaurantId: restaurant._id, // Asignar el ID del restaurante creado
            stripeAccountId: faker.string.uuid(), // Generar un UUID
            isActive: faker.datatype.boolean(),
            payoutsEnabled: faker.datatype.boolean(),
            chargesEnabled: faker.datatype.boolean(),
            detailsSubmitted: faker.datatype.boolean(),
        });
        await stripeAccount.save();
        console.log(`💳 Cuenta de Stripe ${i + 1} creada: ${stripeAccount.stripeAccountId}`);
    }

    console.log('✅ Datos falsos generados exitosamente');
};

generateFakeData().catch(err => console.error('❌ Error al generar datos:', err)); 