document.addEventListener("DOMContentLoaded", function () {
  const inputForm = document.getElementById("inputBook");
  const searchForm = document.getElementById("searchBook");

  inputForm.addEventListener("submit", function (e) {
    e.preventDefault();
    addBook();
  });

  searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    searchBook();
  });

  displayBooks();
});

function addBook() {
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = parseInt(document.getElementById("inputBookYear").value); // Mengubah tipe data ke number
  const isComplete = document.getElementById("inputBookIsComplete").checked;

  const book = {
    id: +new Date(),
    title: title,
    author: author,
    year: year,
    isComplete: isComplete,
  };

  let shelfList = isComplete
    ? "completeBookshelfList"
    : "incompleteBookshelfList";

  let books = getBooksFromStorage();
  books.push(book);
  saveBooksToStorage(books);

  displayBooks();
}

function searchBook() {
  const searchTitle = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();

  let books = getBooksFromStorage();
  let searchResult = books.filter((book) =>
    book.title.toLowerCase().includes(searchTitle)
  );

  displayBooks(searchResult);
}

function moveBookToShelf(bookId, isComplete) {
  let books = getBooksFromStorage();
  const movedBookIndex = books.findIndex((book) => book.id === bookId);

  if (movedBookIndex !== -1) {
    const movedBook = books.splice(movedBookIndex, 1)[0];
    movedBook.isComplete = isComplete;
    books.push(movedBook);
    saveBooksToStorage(books);

    displayBooks();
  }
}

function removeBook(bookId) {
  let books = getBooksFromStorage();
  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex !== -1) {
    books.splice(bookIndex, 1);
    saveBooksToStorage(books);

    displayBooks();
  }
}

function displayBooks(booksToDisplay) {
  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );
  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );

  incompleteBookshelfList.innerHTML = "";
  completeBookshelfList.innerHTML = "";

  let books = booksToDisplay || getBooksFromStorage();

  books.forEach((book) => {
    const newBook = document.createElement("article");
    newBook.classList.add("book_item");

    newBook.innerHTML = `
            <h3>${book.title}</h3>
            <p>Penulis: ${book.author}</p>
            <p>Tahun: ${book.year}</p>
            <div class="action">
                <button class="green" onclick="moveBookToShelf(${
                  book.id
                }, ${!book.isComplete})">
                    ${
                      book.isComplete
                        ? "Belum selesai di Baca"
                        : "Selesai dibaca"
                    }
                </button>
                <button class="red" onclick="removeBook(${
                  book.id
                })">Hapus buku</button>
            </div>
        `;

    if (book.isComplete) {
      completeBookshelfList.appendChild(newBook);
    } else {
      incompleteBookshelfList.appendChild(newBook);
    }
  });
}

function getBooksFromStorage() {
  const storedBooks = localStorage.getItem("books");
  return storedBooks ? JSON.parse(storedBooks) : [];
}

function saveBooksToStorage(books) {
  localStorage.setItem("books", JSON.stringify(books));
}
