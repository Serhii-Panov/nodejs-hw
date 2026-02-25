import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { errors } from 'celebrate';
import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import cookieParser from 'cookie-parser';
import notesRoutes from './routes/notesRoutes.js';
import authRoutes from './routes/authRoutes.js';

await connectMongoDB();

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());
app.use(cors()); // Дозволяє запити з будь-яких джерел
app.use(logger); // Логування HTTP-запитів
app.use(cookieParser()); // Додаємо cookie-parser для роботи з cookies

app.use(authRoutes); // Роутер для аутентифікації
app.use(notesRoutes); // Роутер для нотаток

// Middleware 404 (після всіх маршрутів)
app.use(notFoundHandler);

// Middleware для обробки помилок
app.use(errors()); // Обробка помилок валідації celebrate
app.use(errorHandler);

app.listen(PORT, () => {
  console.log('server is running in port ' + PORT);
});
