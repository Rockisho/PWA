// Seletores de elementos
const feedLink = document.getElementById('feedLink');
const registerLink = document.getElementById('registerLink');
const loginLink = document.getElementById('loginLink');
const addMissingLink = document.getElementById('addMissingLink');
const pages = document.querySelectorAll('.page');

const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const addMissingForm = document.getElementById('addMissingForm');
const missingPersonsDiv = document.getElementById('missingPersons');

// Dados simulados
const users = JSON.parse(localStorage.getItem('users')) || [];
const missingPersons = JSON.parse(localStorage.getItem('missingPersons')) || [];
let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser')) || null;

// Funções de navegação
function showPage(pageId) {
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

feedLink.addEventListener('click', () => showPage('feed'));
registerLink.addEventListener('click', () => showPage('register'));
loginLink.addEventListener('click', () => showPage('login'));
addMissingLink.addEventListener('click', () => showPage('addMissing'));

// Função para renderizar o feed
function renderFeed() {
    missingPersonsDiv.innerHTML = '';
    missingPersons.forEach(person => {
        const card = document.createElement('div');
        card.className = 'missing-card';
        card.innerHTML = `
            <h3>${person.name}</h3>
            <p>${person.details}</p>
            <div class="comments">
                <h4>Comentários</h4>
                ${person.comments.map(comment => `<p>${comment}</p>`).join('')}
                ${loggedInUser ? `<textarea placeholder="Comente..."></textarea>
                <button>Comentar</button>` : '<p>Faça login para comentar.</p>'}
            </div>
        `;
        if (loggedInUser) {
            const commentButton = card.querySelector('button');
            const commentInput = card.querySelector('textarea');
            commentButton.addEventListener('click', () => {
                if (commentInput.value.trim()) {
                    person.comments.push(`${loggedInUser.username}: ${commentInput.value}`);
                    localStorage.setItem('missingPersons', JSON.stringify(missingPersons));
                    renderFeed();
                }
            });
        }
        missingPersonsDiv.appendChild(card);
    });
}

// Cadastro de usuário
registerForm.addEventListener('submit', e => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (users.some(user => user.username === username)) {
        alert('Usuário já existe!');
    } else {
        users.push({ username, password });
        localStorage.setItem('users', JSON.stringify(users));
        alert('Usuário cadastrado com sucesso!');
        showPage('login');
    }
});

// Login de usuário
loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        loggedInUser = user;
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        alert('Login realizado com sucesso!');
        showPage('feed');
        renderFeed();
    } else {
        alert('Credenciais inválidas!');
    }
});

// Registro de desaparecido
addMissingForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('missingName').value;
    const details = document.getElementById('missingDetails').value;
    missingPersons.push({ name, details, comments: [] });
    localStorage.setItem('missingPersons', JSON.stringify(missingPersons));
    alert('Desaparecido registrado com sucesso!');
    showPage('feed');
    renderFeed();
});

// Inicializar feed
renderFeed();
