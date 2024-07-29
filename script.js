// script.js

document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');

    searchForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const searchQuery = searchInput.value.trim();

        try {
            const response = await fetch(`/search?email=${searchQuery}`);
            const data = await response.json();

            if (response.ok) {
                // Выводим результаты поиска
                console.log(data);
            } else {
                // Выводим сообщение об ошибке
                console.error(data.message);
            }
        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error.message);
        }
    });
});
