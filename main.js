document.addEventListener('DOMContentLoaded', function () {
    const chatForm = document.getElementById('chatForm');
    const emailInput = document.getElementById('email');
    const chatList = document.getElementById('chatList');
    const chatRooms = document.getElementById('chatRooms');
    const chatWindow = document.getElementById('chatWindow');
    const messages = document.getElementById('messages');
    const messageInput = document.getElementById('messageInput');
    const sendMessageBtn = document.getElementById('sendMessage');

    chatForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const email = emailInput.value;

        try {
            const response = await fetch(`/search?email=${encodeURIComponent(email)}`);
            const userData = await response.json();

            if (response.ok) {
                // Пользователь найден
                chatList.style.display = 'block';
                chatWindow.style.display = 'none';
                renderChatRooms(userData.chatRooms);
            } else {
                // Пользователь не найден
                alert('Пользователь с указанным адресом не найден');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка при выполнении запроса');
        }
    });

    function renderChatRooms(chatRoomsData) {
        chatRooms.innerHTML = '';
        chatRoomsData.forEach(chatRoom => {
            const li = document.createElement('li');
            li.textContent = chatRoom.name;
            li.addEventListener('click', () => openChatRoom(chatRoom));
            chatRooms.appendChild(li);
        });
    }

    function openChatRoom(chatRoom) {
        chatList.style.display = 'none';
        chatWindow.style.display = 'block';
        messages.innerHTML = '';
        // Здесь можно загрузить сообщения из чата и отобразить их в окне чата
    }

    sendMessageBtn.addEventListener('click', async () => {
        const message = messageInput.value;
        // Здесь можно отправить сообщение на сервер и обновить чат
    });
});
