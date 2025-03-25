// select the books container
const booksContainer = document.querySelector(".books-container");
const searchBox = document.getElementById("search-box");
const sortBookSelect = document.getElementById("sort");
const listViewBtn = document.getElementById("list-view");
const gridView = document.getElementById("grid-view");
const book = document.querySelector(".book");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

listViewBtn.addEventListener("click", () => {
  booksContainer.classList.add("list-view");
  listViewBtn.style.color = "rgb(252, 103, 4)";
  gridView.style.color = "white";
});

gridView.addEventListener("click", () => {
  booksContainer.classList.remove("list-view");
  gridView.style.color = "rgb(252, 103, 4)";
  listViewBtn.style.color = "white";
});

// Function to sort and update books
function sortBooks() {
  const option = sortBookSelect.value;
  const books = Array.from(document.querySelectorAll(".book"));

  if (option === "title") {
    books.sort((a, b) => {
      const titleA = a.querySelector("#book-title").innerText.toLowerCase();
      const titleB = b.querySelector("#book-title").innerText.toLowerCase();
      return titleA.localeCompare(titleB);
    });
  } else if (option === "year") {
    books.sort((a, b) => {
      const yearA = parseInt(a.querySelector("#published-date").innerText) || 0;
      const yearB = parseInt(b.querySelector("#published-date").innerText) || 0;
      return yearA - yearB;
    });
  }

  booksContainer.innerHTML = "";
  books.forEach((book) => booksContainer.appendChild(book));
}

// add event listener to sort the books
sortBookSelect.addEventListener("change", sortBooks);

// function to search for a book
function searchBook() {
  const searchTerm = searchBox.value;
  const books = document.querySelectorAll(".book");

  books.forEach((book) => {
    const title = book.querySelector("#book-title").innerText;
    const author = book.querySelector("#author").innerText;
    if (
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      author.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      book.style.display = "flex";
    } else {
      book.style.display = "none";
    }
  });
}

// event listener to search for a book
searchBox.addEventListener("input", searchBook);

// separate function to create a book element
function createBookElement(books) {
  books.forEach((book) => {
    const bookElm = document.createElement("div");
    bookElm.classList.add("book");
    bookElm.innerHTML = `
        <img src=${book?.volumeInfo?.imageLinks?.thumbnail} alt="thumbnail" id="thumbnail" loading="lazy"/>
        <div class="book-info">
          <h2 id="book-title">${book?.volumeInfo?.title}</h2>
          <p id="author">${book?.volumeInfo?.authors[0]}</p>
          <small>${book?.volumeInfo?.publisher}</small>
          <div class="more_info">
              <p id="published-date">${book?.volumeInfo?.publishedDate}</p>
              <a href=${book?.volumeInfo?.infoLink} target="_blank" >More info</a>
          </div>
        </div>
    `;
    booksContainer.appendChild(bookElm);
  });
}

// pagination starts here -------------------------------------------------------------
const totalItems = 210;
const totalPages = 21;
const itemsPerPage = totalItems / totalPages;
const paginationBtns = document.querySelector(".pagination-btns-container");
let currentPage = 1;

for (let i = 1; i <= totalPages; i++) {
  const btn = document.createElement("button");
  btn.innerText = i;
  paginationBtns.appendChild(btn);
  btn.addEventListener("click", () => {
    currentPage = i;
    btn.style.backgroundColor = "rgb(252, 103, 4)";
    fetchBooks(currentPage);
  });
  btn.addEventListener("blur", () => {
    btn.style.backgroundColor = "rgba(148, 40, 248, 0.4)";
    fetchBooks(i);
  });
}
prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    fetchBooks(currentPage);
    updateActiveButton();
  }
});
nextBtn.addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
    fetchBooks(currentPage);
    updateActiveButton();
  }
});

// Function to highlight active pagination button
function updateActiveButton() {
  const buttons = paginationBtns.querySelectorAll("button");
  buttons.forEach((btn, index) => {
    btn.style.backgroundColor =
      index + 1 === currentPage
        ? "rgb(252, 103, 4)"
        : "rgba(148, 40, 248, 0.4)";
  });
}

// pagnation ends here ------------------------------------------------------------------

// function to fetch the books from the given API ------------------------------------------------------------------------
async function fetchBooks(page = 1) {
  gridView.style.color = "rgb(252, 103, 4)";
  const url = `https://api.freeapi.app/api/v1/public/books/?limit=${itemsPerPage}&page=${page}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Could not fetch the data", response?.status);
    }
    const data = await response.json();
    const books = data?.data?.data;

    document.querySelector(".books-container").innerHTML = "";

    // create a book element for each book
    createBookElement(books);
  } catch (error) {
    console.log(error.message);
  }
}

// calling the function as soon as the DOM contents are loaded
document.addEventListener("DOMContentLoaded", () => {
  fetchBooks(currentPage);
  updateActiveButton();
});
