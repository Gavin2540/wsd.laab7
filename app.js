document.addEventListener('DOMContentLoaded', function() {
    const bookList = document.getElementById('book-list');
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const genreFilter = document.getElementById('genre-filter');
    const sortBooks = document.getElementById('sort-books');
    const pagination = document.getElementById('pagination');
    
    let allBooks = [];
    let currentPage = 1;
    const booksPerPage = 5;

    function fetchBooks() {
        fetch('https://gavin2540.github.io/wsd.lab7/books.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                allBooks = data;
                updateDisplay();  
            })
            .catch(err => {
                error.textContent = `Error: ${err.message}`;
            })
            .finally(() => {
                loading.style.display = 'none';
            });
    }

    function displayBooks(books) {
        bookList.innerHTML = ''; 
        books.forEach(book => {
            const bookDiv = document.createElement('div');
            bookDiv.className = 'book';
            bookDiv.innerHTML = `
                <img src="${book.cover}" alt="${book.title} Cover" />
                <h2>${book.title}</h2>
                <p><strong>Author:</strong> ${book.author}</p>
                <p><strong>Genre:</strong> ${book.genre}</p>
                <p><strong>Published:</strong> ${book.published}</p>
            `;
            bookList.appendChild(bookDiv);
        });
    }

    function displayBooksWithPagination(books) {
        bookList.innerHTML = '';  
        pagination.innerHTML = '';  
       
        const totalPages = Math.ceil(books.length / booksPerPage);
        const start = (currentPage - 1) * booksPerPage;
        const end = start + booksPerPage;
        const booksToDisplay = books.slice(start, end);

        displayBooks(booksToDisplay);

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.className = i === currentPage ? 'active' : '';
            pageButton.addEventListener('click', function() {
                currentPage = i;
                updateDisplay();
            });
            pagination.appendChild(pageButton);
        }
    }

    function filterBooksByGenre(genre, books) {
        if (genre === 'all') {
            return books;  
        } else {
            return books.filter(book => book.genre === genre);
        }
    }

    function sortBooksBy(criteria, books) {
        let sortedBooks = [...books];  

        if (criteria === 'title') {
            sortedBooks.sort((a, b) => a.title.localeCompare(b.title));
        } else if (criteria === 'published') {
            sortedBooks.sort((a, b) => b.published - a.published);
        }

        return sortedBooks;
    }

    function updateDisplay() {
        const filteredBooks = filterBooksByGenre(genreFilter.value, allBooks);
        const sortedBooks = sortBooksBy(sortBooks.value, filteredBooks);
        displayBooksWithPagination(sortedBooks);
    }

    genreFilter.addEventListener('change', function() {
        currentPage = 1;
        updateDisplay();
    });

    sortBooks.addEventListener('change', function() {
        currentPage = 1;
        updateDisplay();
    });

    fetchBooks();
});
