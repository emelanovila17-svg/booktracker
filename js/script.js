// Данные книг
const books = [
    {
        id: 1,
        title: "1984",
        author: "Джордж Оруэлл",
        genre: "fantasy",
        rating: 4,
        coverImage: "images/1984.webp", 
        description: "Антиутопический роман о тоталитарном обществе.",
        progress: 0 
    },
    {
        id: 2,
        title: "Мастер и Маргарита", 
        author: "Михаил Булгаков",
        genre: "classic",
        rating: 5,
        coverImage: "images/master-margarita.webp", 
        description: "Один из самых загадочных романов в истории русской литературы.",
        progress: 0  
    },
    {
        id: 3,
        title: "Преступление и наказание",
        author: "Фёдор Достоевский",
        genre: "classic",
        rating: 4,
        coverImage: "images/prestuplenie.webp",  
        description: "Психологический роман о студенте, совершившем убийство.",
        progress: 0  
    },
    {
        id: 4,
        title: "Три товарища",
        author: "Эрих Мария Ремарк",
        genre: "drama", 
        rating: 3,
        coverImage: "images/tri-tovarishcha.webp",  
        description: "Роман о дружбе, любви и потерях в послевоенной Германии.",
        progress: 0  
    },
    {
        id: 5,
        title: "Маленький принц",
        author: "Антуан де Сент-Экзюпери",
        genre: "classic",
        rating: 4,
        coverImage: "images/malenkiy-prints.webp",  
        description: "Философская сказка о мальчике с астероида.",
        progress: 0  
    },
    {
        id: 6,
        title: "Гарри Поттер",
        author: "Джоан Роулинг",
        genre: "fantasy",
        rating: 5,
        coverImage: "images/garri-potter.webp",  
        description: "История о молодом волшебнике и его друзьях.",
        progress: 0 
    }
];

let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

function toggleFavorite(event, bookId) {
    if (event) event.stopPropagation();
    
    if (favorites.includes(bookId)) {
        favorites = favorites.filter(id => id !== bookId);
        showMessage('Удалено из избранного');
    } else {
        favorites.push(bookId);
        showMessage('Добавлено в избранное');
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavorites();
}

function updateFavorites() {
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        const onclickAttr = btn.getAttribute('onclick');
        if (onclickAttr) {
            const bookIdMatch = onclickAttr.match(/toggleFavorite\(event,\s*(\d+)\)/);
            if (bookIdMatch) {
                const bookId = parseInt(bookIdMatch[1]);
                btn.textContent = favorites.includes(bookId) ? '❤️' : '🤍';
            }
        }
    });
}

function openBook(bookId) {
    window.location.href = `book.html?id=${bookId}`;
}

function searchBooks() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.toLowerCase();
    const filteredBooks = books.filter(book => 
        book.title.toLowerCase().includes(searchTerm) || 
        book.author.toLowerCase().includes(searchTerm)
    );
    
    if (document.getElementById('booksGrid')) {
        displayBooks(filteredBooks);
    } else {
        localStorage.setItem('lastSearch', searchTerm);
        window.location.href = `catalog.html?search=${encodeURIComponent(searchTerm)}`;
    }
}

function applyFilters() {
    const genreFilter = document.getElementById('genreFilter');
    if (!genreFilter) return;
    
    const genre = genreFilter.value;
    let filteredBooks = books;

    if (genre !== 'all') {
        filteredBooks = books.filter(book => book.genre === genre);
    }

    displayBooks(filteredBooks);
}

function displayBooks(booksToShow = books) {
    const booksGrid = document.getElementById('booksGrid');
    if (!booksGrid) return;
    
    booksGrid.innerHTML = '';

    booksToShow.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        bookCard.onclick = function() { openBook(book.id); };
        
        bookCard.innerHTML = `
            <div class="book-cover" style="background-image: url('${book.coverImage}')"></div>
            <div class="book-rating">${'⭐'.repeat(book.rating)}${'☆'.repeat(5-book.rating)}</div>
            <h3>${book.title}</h3>
            <p>${book.author}</p>
            <button class="favorite-btn" onclick="toggleFavorite(event, ${book.id})">🤍</button>
        `;
        
        booksGrid.appendChild(bookCard);
    });
    
    updateFavorites();
}

function openTab(tabName, event) {
    const tabContents = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove('active');
    }
    
    const tabButtons = document.getElementsByClassName('tab-btn');
    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove('active');
    }
    
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
}

function removeBook(button) {
    if (confirm('Удалить книгу из коллекции?')) {
        const bookCard = button.closest('.book-card');
        bookCard.style.opacity = '0';
        setTimeout(() => {
            bookCard.remove();
        }, 300);
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

function showMessage(message) {
    alert(message);
}

// Загрузка страницы
document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
    }
    
    if (document.getElementById('booksGrid')) {
        displayBooks();
    }
    
    updateFavorites();
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchBooks();
            }
        });
    }
});

// Глобальные переменные
window.books = books;
window.toggleFavorite = toggleFavorite;
window.openBook = openBook;
window.searchBooks = searchBooks;
window.applyFilters = applyFilters;
window.openTab = openTab;
window.removeBook = removeBook;
window.toggleTheme = toggleTheme;
