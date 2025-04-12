// Выход из личного кабинета 
const logout = new LogoutButton();
logout.action = function() {
    ApiConnector.logout(response => {
        if (response.success) {
            location.reload();
        }
    }); 
}

// Получение информации о пользователе
ApiConnector.current(response => {
    if (response.success) {
        ProfileWidget.showProfile(response.data);
    }
});

// Получение текущих курсов валюты
const rates = new RatesBoard();

function getcourse() {
    ApiConnector.getStocks(response => {
        if (response.success) {
            rates.clearTable();
            rates.fillTable(response.data);
        }
    });
}
getcourse();
setInterval(getcourse, 60000);

// Пополнение баланса
const moneyManager = new MoneyManager();

moneyManager.addMoneyCallback = function({currency, amount}) {
    ApiConnector.addMoney({currency, amount}, response => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, "Транзакция прошла успешно!")
        } else {
            moneyManager.setMessage(false, response.error)
        }
    });
}

// Реализуйте конвертирование валюты
moneyManager.conversionMoneyCallback = function({fromCurrency, targetCurrency, fromAmount}) {
    ApiConnector.convertMoney({fromCurrency, targetCurrency, fromAmount}, response => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, "Транзакция прошла успешно!");
        } else {
            moneyManager.setMessage(false, response.error);
        }
    });
}

// Реализуйте перевод валюты
moneyManager.sendMoneyCallback = function({to, currency, amount}) {
    ApiConnector.transferMoney({to, currency, amount}, response => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, "Транзакция прошла успешно!");
        } else {
            moneyManager.setMessage(false, response.error);
        }
    });
}

// Запросите начальный список избранного
const favoritesWidget = new FavoritesWidget();

ApiConnector.getFavorites(response => {
    if (response.success) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
    } else {
        favoritesWidget.setMessage(false, response.error);
    }
});

// Реализуйте добавления пользователя в список избранных
favoritesWidget.addUserCallback = function({id, name}) {
    ApiConnector.addUserToFavorites({id, name}, response => {
        if (response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            favoritesWidget.setMessage(true, "Пользователь добавлен в избранные");
        } else {
            favoritesWidget.setMessage(false, response.error);
        }
    });
}

// Реализуйте удаление пользователя из избранного
favoritesWidget.removeUserCallback = function(id) {
    ApiConnector.removeUserFromFavorites(id, response => {
        if (response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            favoritesWidget.setMessage(true, "Пользователь удален из избранные");
        } else {
            favoritesWidget.setMessage(false, response.error);
        }
    })
}