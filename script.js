// script.js

// Функция для выполнения поиска пользователей
function searchUser() {
    const searchInput = document.getElementById('searchUserInput').value;
    
    // Отправляем запрос на сервер для поиска пользователей
    fetch(`/search?query=${searchInput}`)
        .then(response => response.json())
        .then(data => {
            const searchResults = document.getElementById('searchResults');
            searchResults.innerHTML = ''; // Очищаем предыдущие результаты

            // Отображаем результаты поиска
            data.forEach(user => {
                const userElement = document.createElement('div');
                userElement.textContent = user.username;
                searchResults.appendChild(userElement);
            });
        })
        .catch(error => console.error('Ошибка при поиске пользователей:', error));
}

// Функция для начала нового чата
function startChat() {
    // Логика для начала нового чата
}
