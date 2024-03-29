const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const { initializeApp } = require("firebase/app");
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require("firebase/auth");

const app = express();
const port = 3000;

// Middleware для обработки данных из формы
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware для использования сессий
app.use(session({
    secret: 'secret_key', // Секретный ключ для подписи куки
    resave: false,
    saveUninitialized: true
}));

// Ваша конфигурация Firebase
const firebaseConfig = {
    apiKey: "AIzaSyA4BVG7Ypwa6VI0ADTEcqwHj6px_CGCUoY",
    authDomain: "socialnetwork-37297.firebaseapp.com",
    databaseURL: "https://socialnetwork-37297-default-rtdb.firebaseio.com",
    projectId: "socialnetwork-37297",
    storageBucket: "socialnetwork-37297.appspot.com",
    messagingSenderId: "775756757662",
    appId: "1:775756757662:web:6f08910940368b8cb8198f",
    measurementId: "G-K163T0HH32"
};

// Инициализация Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

// Обработчик GET-запроса для отображения страницы регистрации
app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/register.html');
});

// Обработчик POST-запроса для регистрации пользователя
app.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Создание пользователя через Firebase
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("Пользователь успешно зарегистрирован:", user.uid);
        res.status(200).json({ message: 'Пользователь успешно зарегистрирован' });
        res.redirect('/');
    } catch (error) {
        console.error('Ошибка при регистрации пользователя:', error.message);
        res.status(500).json({ message: 'Ошибка при регистрации пользователя' });
    }
});

// Обработчик GET-запроса для отображения страницы регистрации
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

// Обработчик POST-запроса для аутентификации пользователя
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Аутентификация пользователя через Firebase
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("Пользователь успешно аутентифицирован:", user.uid);
        res.status(200).json({ message: 'Пользователь успешно аутентифицирован' });
        res.redirect('/');
    } catch (error) {
        console.error('Ошибка при аутентификации пользователя:', error.message);
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            res.status(400).json({ message: 'Неверный email или пароль' });
        } else {
            res.status(500).json({ message: 'Ошибка при аутентификации пользователя' });
        }
    }
});

// Массив пользователей (просто для демонстрации)
const users = [
    { id: 1, username: 'user1' },
    { id: 2, username: 'user2' },
    { id: 3, username: 'user3' }
];

// Обработчик GET-запроса для отображения главной страницы
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Обработчик GET-запроса для поиска пользователей
app.get('/search', (req, res) => {
    const query = req.query.query.toLowerCase();
    const filteredUsers = users.filter(user => user.username.toLowerCase().includes(query));
    res.json(filteredUsers);
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
