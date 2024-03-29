document.addEventListener('DOMContentLoaded', function() {
    // Найти все кнопки "Добавить в друзья" на странице
    const addFriendButtons = document.querySelectorAll('.add-friend-button');

    // Для каждой кнопки добавить обработчик события клика
    addFriendButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Получить email пользователя из атрибута data-useremail
            const friendEmail = this.dataset.useremail;

            // Отправить AJAX-запрос на сервер для добавления пользователя в друзья
            fetch('/addFriend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ friendEmail }) // Отправляем email друга на сервер
            })
            .then(response => response.json())
            .then(data => {
                // Обработать ответ от сервера, например, показать сообщение пользователю
                alert(data.message);
            })
            .catch(error => {
                console.error('Ошибка при добавлении друга:', error);
            });
        });
    });
});
