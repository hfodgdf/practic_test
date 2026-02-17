// =======================
// Banking Simulator — ПРАКТИЧНЕ ЗАВДАННЯ ДЛЯ СТУДЕНТІВ
// У коді нижче є пробіли (TODO). Доповніть їх згідно з поясненнями.
// =======================

// 1) СТАН ЗАСТОСУНКУ
// Тут зберігаємо дані. Їх будемо змінювати і потім зберігати у localStorage.
let account = {
	balance: 0, // поточний баланс
	transactions: [], // список транзакцій: { id, type, amount, date }
}

// Поточний фільтр для історії транзакцій
// "all" показує все, "deposit" лише поповнення, "withdraw" лише зняття
let activeFilter = 'all'

// 2) ЕЛЕМЕНТИ СТОРІНКИ (DOM)
// TODO 1: Отримайте елементи за їх id через document.getElementById("id"). Один приклад нижче.
const balanceValue = document.getElementById('balanceValue')
const depositInput = document.getElementById('depositInput')
const withdrawInput = document.getElementById('withdrawInput')
const depositBtn = document.getElementById('depositBtn')
const withdrawBtn = document.getElementById('withdrawBtn')
const transactionsList = document.getElementById('transactionsList')
const emptyState = document.getElementById('emptyState')
const errorText = document.getElementById('errorText')
const clearBtn = document.getElementById('clearBtn')
const totalInValue = document.getElementById('totalInValue')
const totalOutValue = document.getElementById('totalOutValue')
const filterAllBtn = document.getElementById('filterAll')
const filterInBtn = document.getElementById('filterIn')
const filterOutBtn = document.getElementById('filterOut')

// 3) ДОПОМІЖНІ ФУНКЦІЇ
// TODO 2 — showError(text): встановити текст помилки в елемент errorText (textContent).
function showError(text) {
	if (!errorText) return
	errorText.textContent = text
}
function showError(text) {
	if (!errorText) return
	errorText.textContent = text
}

// Форматуємо число як гроші з 2 знаками після коми
function formatMoney(value) {
	const n = Number(value)
	if (!Number.isFinite(n)) return '0.00'
	return n.toFixed(2)
}

// Читаємо число з input і перевіряємо його
// Повертає число або null, якщо значення неправильне
function readAmount(inputEl) {
	const n = Number(inputEl.value)

	if (!Number.isFinite(n)) return null // не число
	if (n <= 0) return null // має бути > 0
	// Обрізаємо до 2 знаків після коми
	return Math.round(n * 100) / 100
}

// TODO 3 — makeId(): повернути унікальний id (наприклад String(Date.now())).
function makeId() {
	return String(Date.now())
}

// 4) localStorage
// TODO 4 — save(): зберегти account у localStorage під ключем "account".
function save() {
	localStorage.setItem('account', JSON.stringify(account))
}

// Завантажити account з localStorage
// Якщо дані зіпсовані, залишаємо дефолтний стан
function load() {
	const raw = localStorage.getItem('account')
	if (!raw) return
	try {
		const data = JSON.parse(raw)
		const balance = Number(data.balance)
		const transactions = Array.isArray(data.transactions)
			? data.transactions
			: []
		account = {
			balance: Number.isFinite(balance) ? balance : 0,
			transactions,
		}
	} catch (e) {
		account = { balance: 0, transactions: [] }
	}
}

// 5) ПІДРАХУНКИ
// TODO 5 — calcTotals(): у циклі forEach по account.transactions додавати amount до totalIn або totalOut залежно від t.type.
function calcTotals() {
	let totalIn = 0
	let totalOut = 0
	account.transactions.forEach(t => {
		const amount = Number(t.amount) || 0
		if (t.type === 'deposit') totalIn += amount
		if (t.type === 'withdraw') totalOut -= amount
	})
	return {
		totalIn: Math.round(totalIn * 100) / 100,
		totalOut: Math.round(totalOut * 100) / 100,
	}
}

// функція для оновлення Totals на сторінці
// TODO 6 — renderTotals(): вивести totalIn та totalOut у totalInValue.textContent та totalOutValue.textContent через formatMoney.
function renderTotals() {
	const totals = calcTotals()
	if (totalInValue) totalInValue.textContent = formatMoney(totals.totalIn)
	if (totalOutValue) totalOutValue.textContent = formatMoney(totals.totalOut)
}

// 6) ФІЛЬТРИ (модуль: умови, масиви — метод filter)
// TODO 7 — getVisibleTransactions(): допишіть
// 1) перевірку — якщо activeFilter === "all", повернути account.transactions;
// 2) інакше повернути результат filter (за типом t.type === activeFilter).
function getVisibleTransactions() {
	if (activeFilter === 'all') return account.transactions
	return account.transactions.filter(t => t.type === activeFilter)
}

// TODO 8 — updateFilterButtons(): допишіть у лапках ключові слова — classList і toggle
// element.classList.toggle("клас", умова) — додає або знімає клас за умови.
function updateFilterButtons(classList, toggle) {
	if (filterAllBtn) {
		filterAllBtn.classList.toggle('is-active', activeFilter === 'all')
		filterAllBtn.setAttribute('aria-selected', String(activeFilter === 'all'))
	}
	if (filterInBtn) {
		filterInBtn.classList.toggle('is-active', activeFilter === 'deposit')
		filterInBtn.setAttribute(
			'aria-selected',
			String(activeFilter === 'deposit'),
		)
	}
	if (filterOutBtn) {
		filterOutBtn.classList.toggle('is-active', activeFilter === 'withdraw')
		filterOutBtn.setAttribute(
			'aria-selected',
			String(activeFilter === 'withdraw'),
		)
	}
}

function setFilter(next) {
	activeFilter = next
	updateFilterButtons()
	render()
}

// функція для створення елементу транзакції
// Створюємо один елемент транзакції <li>
createElement = document.createElement
function createTransactionItem(t) {
	const li = document.createElement('li')
	li.className = 'tx'
	const left = document.createElement('div')
	left.className = 'tx-left'
	const title = document.createElement('div')
	title.className = 'tx-title'
	const isDeposit = t.type === 'deposit'
	const badge = document.createElement('span')
	badge.className = 'badge ' + (isDeposit ? 'badge-in' : 'badge-out')
	badge.textContent = isDeposit ? 'Deposit' : 'Withdraw'

	const label = document.createElement('span')
	label.textContent = 'Transaction'

	title.appendChild(badge)
	title.appendChild(label)

	const date = document.createElement('div')
	date.className = 'tx-date'
	date.textContent = t.date || ''

	left.appendChild(title)
	left.appendChild(date)
	const amount = document.createElement('div')
	amount.className = 'tx-amount ' + (isDeposit ? 'amount-in' : 'amount-out')
	amount.textContent = (isDeposit ? '+$' : '-$') + formatMoney(t.amount)

	li.appendChild(left)
	li.appendChild(amount)
	return li
}

// 7) РЕНДЕР (ОНОВЛЕННЯ ІНТЕРФЕЙСУ)
// Це головна функція, яка перемальовує все що бачить користувач.
// TODO 9 — render(): майже все заповнено. Допишіть тільки тіло циклу — додати функцію створення елементу транзакції до списку.

if (balanceValue) balanceValue.textContent = formatMoney(account.balance)

const visible = getVisibleTransactions()
if (transactionsList) {
	transactionsList.innerHTML = ''
	visible.forEach(t => {
		transactionsList.appendChild(createTransactionItem(t))
	})
}
function render() {
	// Показуємо баланс
	if (balanceValue) balanceValue.textContent = formatMoney(account.balance) // Отримуємо транзакції з урахуванням фільтра

	const visible = getVisibleTransactions()
	const hasAny = account.transactions.length > 0
	const hasVisible = visible.length > 0 // Налаштовуємо пустий стан

	if (emptyState) {
		if (!hasAny) {
			emptyState.style.display = 'block'
			emptyState.textContent = 'No transactions yet'
		} else if (!hasVisible) {
			emptyState.style.display = 'block'
			emptyState.textContent = 'No transactions in this filter'
		} else {
			emptyState.style.display = 'none'
		}
	} // Малюємо список транзакцій

	if (transactionsList) {
		transactionsList.innerHTML = ''
		visible.forEach(t => {
			transactionsList.appendChild(createTransactionItem(t))
		})
	} // Оновлюємо статистику (Total deposits / Total withdrawals)
	// TODO 10 — використайте функцію для оновлення Totals на сторінці (виклик по імені).
}
renderTotals()

// БІЗНЕС-ЛОГІКА
// TODO 11 — Допишіть ключове слово та перевірку умови оновлення балансу (if deposit — додати, if withdraw — відняти).
function addTransaction(type, amount) {
	const tx = {
		id: makeId(),
		type,
		amount,
		date: new Date().toLocaleString(),
	} // Додаємо в початок, щоб нові були зверху

	account.transactions.unshift(tx) // Оновлюємо баланс

	if (type === 'deposit') {
		account.balance += amount
	} else if (type === 'withdraw') {
		account.balance -= amount // Допишіть: аналогічно для withdraw
	} // Зберігаємо і оновлюємо інтерфейс

	save()
	render()
}

// 8) ПОДІЇ (модуль: addEventListener, click)
// TODO 12 — Обробник "Add": допишіть ключове слово для додавання події, та функцію повернення помилки з текстом "Enter a valid amount greater than 0"
if (depositBtn) {
	depositBtn.addEventListener('click', () => {
		showError('')

		const amount = readAmount(depositInput)
		if (amount === null) {
			// Допишіть: функцію повернення помилки з текстом "Enter a valid amount greater than 0"
			showError('Enter a valid amount greater than 0')
			return
		}

		addTransaction('deposit', amount)
		depositInput.value = ''
	})
}

// TODO 13 — Обробник "Take": допишіть функції повернення помилок а також ключове слово для додавання транзакції
if (withdrawBtn) {
	withdrawBtn.addEventListener('click', () => {
		showError('')
		const amount = readAmount(withdrawInput)
		if (amount === null) {
			showError('Enter a valid amount greater than 0')
			return
		}

		if (amount > account.balance) {
			// Допишіть: функцію повернення помилки з текстом "Not enough balance"
			showError('Not enough balance')
			return
		}

		addTransaction('withdraw', amount)
		withdrawInput.value = ''
	})
}

// Очистити все
if (clearBtn) {
	clearBtn.addEventListener('click', () => {
		showError('')
		account = { balance: 0, transactions: [] }
		save()
		render()
	})
}

// Фільтри
if (filterAllBtn) {
	filterAllBtn.addEventListener('click', () => setFilter('all'))
}
if (filterInBtn) {
	filterInBtn.addEventListener('click', () => setFilter('deposit'))
}
if (filterOutBtn) {
	filterOutBtn.addEventListener('click', () => setFilter('withdraw'))
}

load()
setFilter('all')
// 9) СТАРТ ЗАСТОСУНКУ
// 1) Завантажуємо дані
// 2) Ставимо фільтр "all" і малюємо все
// TODO 14 — допишіть виклики функцій
