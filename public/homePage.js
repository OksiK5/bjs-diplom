const logoutButton = new LogoutButton();

logoutButton.action = function() {  // Записываем функцию в свойство action
    ApiConnector.logout((response) => {   // Вызываем запрос деавторизации
        if (response.success) {   // Проверяем успешность запроса
                    location.reload();  // Обновляем страницу
        }
    });
}

// Выполнение запроса на получение текущего пользователя
ApiConnector.current((response) => {
    if (response.success) {   // Если ответ успешный, отображаем данные профиля
        ProfileWidget.showProfile(response.data);
    }
});

//получение текущих курсов валюты
const ratesBoard = new RatesBoard();

function getExchangeRates() {
    ApiConnector.getStocks((response) => {
        if (response.success) {
            ratesBoard.clearTable(); //очищаем таблицу
            ratesBoard.fillTable(response.data);  //заполняем таблицу полученными данными
        }
    });
}
getExchangeRates();
setInterval(getExchangeRates, 60000);


//пополнение баланса
const moneyManager = new MoneyManager();

moneyManager.addMoneyCallback = function({currency, amount}) {
    ApiConnector.addMoney({currency, amount}, (response) => {  //запрос на пополнение баланса
        if (response.success) {
            ProfileWidget.showProfile(response.data); //отображаем в профиле новые данные
            moneyManager.setMessage(response.success, 'Ваш баланс успешно пополнен.');
        } else {
            moneyManager.setMessage(response.success, response.error);
        }
    });
}

//конвертирование валюты
moneyManager.conversionMoneyCallback = function({fromCurrency, targetCurrency, fromAmount}) {
    ApiConnector.convertMoney({fromCurrency, targetCurrency, fromAmount}, (response) => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(response.success, 'Конвертация прошла успешно.');
        } else {
            moneyManager.setMessage(response.success, response.error);
        }
    });
}

//перевод валюты
moneyManager.sendMoneyCallback = function({to, amount, currency}) {
    ApiConnector.transferMoney({to, amount, currency}, (response) => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(response.success, 'Ваши средства переведены.');
        } else {
            moneyManager.setMessage(response.success, response.error);
        }
    });
}

//начальный список избранного
const favoritesWidget = new FavoritesWidget();

ApiConnector.getFavorites((response) => { //запрос на получение списка избранного
    if (response.success) {
        favoritesWidget.clearTable(); //очищаем текущий список
        favoritesWidget.fillTable(response.data); //заполняем полученными данными
        moneyManager.updateUsersList(response.data); //заполняем выпадающий список для перевода денег
    }
});

//добавляем пользователя в список избранных
favoritesWidget.addUserCallback = function({id, name}) {
    ApiConnector.addUserToFavorites({id, name}, (response) => { //запрос на добавлене пользователя
        if (response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            favoritesWidget.setMessage(response.success, 'Пользователь добавлен.');
        } else {
            favoritesWidget.setMessage(response.success, response.error);
        }
    });
}

//удаление пользователя
favoritesWidget.removeUserCallback = function(userId) {
    ApiConnector.removeUserFromFavorites(userId, (response) => {
        if (response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            favoritesWidget.setMessage(response.success, 'Пользователь удалён.');
        } else {
            favoritesWidget.setMessage(response.success, response.error);
        }
    });
}