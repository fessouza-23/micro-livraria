function newBook(book) {
    const div = document.createElement('div');
    div.className = 'column is-4';
    div.innerHTML = `
    <div class="card is-shady">
    <div class="card-image">
    <figure class="image is-4by3">
    <img
    src="${book.photo}"
    alt="${book.name}"
    class="modal-button"
    />
    </figure>
    </div>
    <div class="card-content">
    <div class="content book" data-id="${book.id}">
    <div class="book-meta">
    <p class="is-size-4">R$${book.price.toFixed(2)}</p>
    <p class="is-size-6">Disponível em estoque: ${book.quantity}</p>
    <h4 class="is-size-3 title">${book.name}</h4>
    <p class="subtitle">${book.author}</p>
    </div>
    <div class="field has-addons">
    <div class="control">
    <input class="input" type="text" placeholder="Digite o CEP" />
    </div>
    <div class="control">
    <a class="button button-shipping is-info" data-id="${book.id}"> Calcular Frete </a>
    </div>
    </div>
    <button class="button button-buy is-success is-fullwidth">Comprar</button>
    </div>
    </div>
    </div>`;
    return div;
}

function calculateShipping(id, cep) {
    fetch('http://localhost:3000/shipping/' + cep)
        .then((data) => {
            if (data.ok) {
                return data.json();
            }
            throw data.statusText;
        })
        .then((data) => {
            swal('Frete', `O frete é: R$${data.value.toFixed(2)}`, 'success');
        })
        .catch((err) => {
            swal('Erro', 'Erro ao consultar frete', 'error');
            console.error(err);
        });
}

function searchBookById(bookId) {
    const books = document.querySelector('.books');
    books.innerHTML = ''; // Limpa a lista de livros

    fetch('http://localhost:3000/products')
        .then((data) => {
            if (data.ok) {
                return data.json();
            }
            throw data.statusText;
        })
        .then((data) => {
            if (data) {
                // Converte bookId para número para garantir a comparação correta
                const id = parseInt(bookId, 10);
                // Filtra o livro pelo ID
                const foundBook = data.find(book => book.id === id);

                if (foundBook) {
                    books.appendChild(newBook(foundBook));
                    setupBookEventListeners();
                    swal('Sucesso', `Livro "${foundBook.name}" encontrado!`, 'success');
                } else {
                    swal('Não encontrado', `Nenhum livro encontrado com ID ${bookId}`, 'warning');
                    // Exibe todos os livros novamente se não encontrar o livro específico
                    data.forEach((book) => {
                        books.appendChild(newBook(book));
                    });
                    setupBookEventListeners();
                }
            }
        })
        .catch((err) => {
            swal('Erro', 'Erro ao buscar os livros', 'error');
            console.error(err);
        });
}

function loadAllBooks() {
    const books = document.querySelector('.books');
    books.innerHTML = ''; // Limpa a lista de livros

    fetch('http://localhost:3000/products')
        .then((data) => {
            if (data.ok) {
                return data.json();
            }
            throw data.statusText;
        })
        .then((data) => {
            if (data) {
                data.forEach((book) => {
                    books.appendChild(newBook(book));
                });
                setupBookEventListeners();
            }
        })
        .catch((err) => {
            swal('Erro', 'Erro ao listar os produtos', 'error');
            console.error(err);
        });
}

function setupBookEventListeners() {
    document.querySelectorAll('.button-shipping').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            const cep = document.querySelector(`.book[data-id="${id}"] input`).value;
            calculateShipping(id, cep);
        });
    });

    document.querySelectorAll('.button-buy').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            swal('Compra de livro', 'Sua compra foi realizada com sucesso', 'success');
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    // Carrega todos os livros no início
    loadAllBooks();

    // Configura o campo de busca e o botão
    const searchButton = document.getElementById('search-button');
    const bookIdInput = document.getElementById('book-id-input');

    if (searchButton && bookIdInput) {
        searchButton.addEventListener('click', () => {
            const bookId = bookIdInput.value.trim();
            if (bookId) {
                searchBookById(bookId);
            } else {
                loadAllBooks();
            }
        });

        bookIdInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const bookId = bookIdInput.value.trim();
                if (bookId) {
                    searchBookById(bookId);
                } else {
                    loadAllBooks();
                }
            }
        });
    }
});