const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const { initializeApp } = require("firebase/app");
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require("firebase/auth");
const { getFirestore, collection, query, where, getDocs, addDoc, doc, setDoc, getDoc } = require('firebase/firestore');
const ejs = require('ejs'); // Подключаем EJS

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

// Указываем Express использовать EJS в качестве движка для шаблонов
app.set('view engine', 'ejs');

// Указываем директорию, где будут находиться шаблоны
app.set('views', __dirname + '/views');

// Ваша конфигурация Firebase
const firebaseConfig = {
  apiKey: "", // Your API key
  authDomain: "", // Your authDomain
  databaseURL: "", // Your databaseURL
  projectId: "", // Your projectId
  storageBucket: "", // Your storageBucket
  messagingSenderId: "", // Your messagingSenderId
  appId: "", // Your appId
  measurementId: "" // measurementId
};

// Инициализация Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

// Middleware для проверки аутентификации пользователя
const requireAuth = (req, res, next) => {
    if (req.session.user) {
        next(); // Если пользователь аутентифицирован, переходим к следующему обработчику
    } else {
        res.redirect('/login'); // Если пользователь не аутентифицирован, перенаправляем на страницу входа
    }
};

// Middleware для проверки роли пользователя
const checkRole = (role) => (req, res, next) => {
    if (req.session.user && req.session.user.role === role) {
        next(); // Если у пользователя соответствующая роль, переходим к следующему обработчику
    } else {
        res.status(403).json({ message: 'Доступ запрещен' }); // Если роль не соответствует, отправляем сообщение о запрете доступа
    }
};

// Middleware для обновления данных о пользователе в сессии
const updateUserSession = async (req, res, next) => {
    try {
        const currentUser = req.session.user;

        if (currentUser && currentUser.uid) {
            const userDocRef = doc(firestore, "users", currentUser.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                req.session.user = { ...userData, uid: currentUser.uid }; // Обновляем данные пользователя в сессии
            } else {
                throw new Error('Данные пользователя не найдены в Firestore');
            }
        }
        next();
    } catch (error) {
        console.error('Ошибка при обновлении данных о пользователе:', error.message);
        res.status(500).json({ message: 'Ошибка при обновлении данных о пользователе' });
    }
};

// Применяем middleware для всех запросов
app.use(updateUserSession);

// Обработчики маршрутов

// Страница регистрации
app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/register.html');
});

app.post('/register', async (req, res) => {
    const { email, password, role } = req.body;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userDocRef = doc(firestore, "users", user.uid);
        const userData = {
            email: user.email,
            role: role || 'User', 
            uid: user.uid
        };
        await setDoc(userDocRef, userData);

        req.session.user = userData;
        res.redirect('/');
    } catch (error) {
        console.error('Ошибка при регистрации пользователя:', error.message);
        res.status(500).json({ message: 'Ошибка при регистрации пользователя' });
    }
});

// Страница входа
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userDocRef = doc(firestore, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            req.session.user = { ...userData, uid: user.uid };
            res.redirect('/');
        } else {
            throw new Error('Пользователь не найден в базе данных');
        }
    } catch (error) {
        console.error('Ошибка при аутентификации пользователя:', error.message);
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            res.status(400).json({ message: 'Неверный email или пароль' });
        } else {
            res.status(500).json({ message: 'Ошибка при аутентификации пользователя' });
        }
    }
});

// Главная страница
app.get('/', requireAuth, async (req, res) => {
    try {
        const currentUser = req.session.user;

        if (!currentUser || !currentUser.uid) {
            throw new Error('UID пользователя не определен');
        }

        const userChatsRef = collection(firestore, 'chats');
        const q = query(userChatsRef, where('participants', 'array-contains', currentUser.uid));
        const userChatsSnapshot = await getDocs(q);

        const chatsData = userChatsSnapshot.docs.map(doc => ({
            id: doc.id,
            title: doc.data().title
        }));

        let isAdmin = false;
        if (currentUser.role === 'Admin') {
            isAdmin = true;
        }

        res.render('index', { currentUser, isAdmin, chats: chatsData });
    } catch (error) {
        console.error('Ошибка при отображении главной страницы:', error.message);
        res.status(500).json({ message: 'Ошибка при отображении главной страницы' });
    }
});

// Страница админ панели
app.get('/admin', requireAuth, checkRole('Admin'), (req, res) => {
    const currentUser = req.session.user;
    res.render('admin', { currentUser });
});

// Страница панели администратора
app.get('/apanel', requireAuth, checkRole('Admin'), (req, res) => {
    const currentUser = req.session.user;
    res.render('apanel', { currentUser });
});

// Обработчик GET-запроса для отображения страницы чата по его ID
app.get('/chat/:chatId', requireAuth, async (req, res) => {
    try {
        const chatId = req.params.chatId;

        // Получаем данные чата из Firestore
        const chatRef = doc(firestore, 'chats', chatId);
        const chatDoc = await getDoc(chatRef);

        if (chatDoc.exists()) {
            const chatData = chatDoc.data();
            res.render('chat', { currentUser: req.session.user, chatId: chatId, chatData: chatData }); // Отображаем страницу чата
        } else {
            throw new Error('Чат не найден');
        }
    } catch (error) {
        console.error('Ошибка при отображении страницы чата:', error.message);
        res.status(500).json({ message: 'Ошибка при отображении страницы чата' });
    }
});


// Отправка сообщения
app.post('/sendMessage', requireAuth, async (req, res) => {
    try {
        const { chatId, message } = req.body;

        if (!message) {
            throw new Error('Сообщение не указано');
        }

        const chatRef = doc(firestore, 'chats', chatId);
        const chatDoc = await getDoc(chatRef);

        if (chatDoc.exists()) {
            const chatData = chatDoc.data();
            const currentMessages = chatData.messages || [];

            const newMessage = {
                sender: req.session.user.email,
                text: message,
                timestamp: new Date()
            };

            const updatedMessages = [...currentMessages, newMessage];
            await setDoc(chatRef, { messages: updatedMessages }, { merge: true });

            res.status(200).json({ message: 'Сообщение успешно отправлено' });
        } else {
            throw new Error('Чат не найден');
        }
    } catch (error) {
        console.error('Ошибка при отправке сообщения:', error.message);
        res.status(500).json({ message: 'Ошибка при отправке сообщения' });
    }
});

// Создание чата
app.post('/createChat', requireAuth, async (req, res) => {
    try {
        const currentUser = req.session.user;

        if (!currentUser || !currentUser.uid) {
            throw new Error('UID пользователя не определен');
        }

        const userEmail = req.body.email;

        if (!userEmail) {
            throw new Error('Email для создания чата не определен');
        }

        const userSnapshot = await getDocs(query(collection(firestore, 'users'), where('email', '==', userEmail)));

        if (!userSnapshot.empty) {
            const userData = userSnapshot.docs[0].data();
            const userId = userSnapshot.docs[0].id;

            const chatRef = collection(firestore, 'chats');
            const newChatDoc = await addDoc(chatRef, {
                participants: [currentUser.uid, userId],
                messages: []
            });

            res.status(200).json({ message: 'Чат успешно создан' });
        } else {
            throw new Error('Пользователь с указанным email не найден');
        }
    } catch (error) {
        console.error('Ошибка при создании чата:', error.message);
        res.status(500).json({ message: 'Ошибка при создании чата' });
    }
});

// Выход пользователя
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

// Перенаправление на сайт Firebase
app.get('/firebase', (req, res) => {
    res.redirect('https://console.firebase.google.com/u/0/project/socialnetwork-37297');
});

const fs = require('fs');
const path = require('path');

const modulesPath = path.join(__dirname, 'modules');

fs.readdir(modulesPath, (err, files) => {
  if (err) {
    return console.error('Не удалось прочитать директорию модулей:', err);
  }

  files.forEach(file => {
    const modulePath = path.join(modulesPath, file);
    if (path.extname(modulePath) === '.js') {
      const module = require(modulePath);
      if (module.enabled) {
        module.run();
      }
    }
  });
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://176.36.89.214:${port}`);
});
