    let books = [
        { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'fiction', status: 'available' },
        { id: 2, title: 'A Brief History of Time', author: 'Stephen Hawking', category: 'science', status: 'available' },
        { id: 3, title: 'The Art of War', author: 'Sun Tzu', category: 'history', status: 'available' },
        { id: 4, title: 'Think and Grow Rich', author: 'Napoleon Hill', category: 'non-fiction', status: 'available' }
    ];

    let borrowingHistory = [];

    const booksGrid = document.getElementById('booksGrid');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const historyList = document.getElementById('historyList');

    function renderBooks() {
        booksGrid.innerHTML = '';
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;

        books.forEach(book => {
            if ((book.title.toLowerCase().includes(searchTerm) || 
                 book.author.toLowerCase().includes(searchTerm)) &&
                (selectedCategory === 'all' || book.category === selectedCategory)) {
                
                const bookCard = document.createElement('div');
                bookCard.className = 'book-card fade-in';
                bookCard.innerHTML = `
                    <h3>${book.title}</h3>
                    <p>Author: ${book.author}</p>
                    <p>Category: ${book.category}</p>
                    <span class="status ${book.status}">${book.status}</span>
                    <br>
                    <button onclick="toggleBorrow(${book.id})" 
                            ${book.status === 'borrowed' ? 'disabled' : ''}>
                        ${book.status === 'available' ? 'Borrow' : 'Borrowed'}
                    </button>
                `;
                booksGrid.appendChild(bookCard);
            }
        });
    }

    function toggleBorrow(bookId) {
        const book = books.find(b => b.id === bookId);
        if (book) {
            book.status = 'borrowed';
            
            const historyEntry = {
                bookId: bookId,
                bookTitle: book.title,
                borrowDate: new Date().toLocaleDateString(),
                returnDate: null
            };
            borrowingHistory.unshift(historyEntry);
            
            renderBooks();
            renderHistory();
        }
    }

    function renderHistory() {
        historyList.innerHTML = '';
        borrowingHistory.forEach(entry => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item fade-in';
            historyItem.innerHTML = `
                <p>"${entry.bookTitle}" - Borrowed on ${entry.borrowDate}</p>
                ${entry.returnDate ? `<p>Returned on ${entry.returnDate}</p>` : 
                `<button onclick="returnBook(${entry.bookId})">Return Book</button>`}
            `;
            historyList.appendChild(historyItem);
        });
    }

    function returnBook(bookId) {
        const book = books.find(b => b.id === bookId);
        if (book) {
            book.status = 'available';
            
            const historyEntry = borrowingHistory.find(h => h.bookId === bookId && !h.returnDate);
            if (historyEntry) {
                historyEntry.returnDate = new Date().toLocaleDateString();
            }
            
            renderBooks();
            renderHistory();
        }
    }

    searchInput.addEventListener('input', renderBooks);
    categoryFilter.addEventListener('change', renderBooks);

    renderBooks();
    renderHistory();