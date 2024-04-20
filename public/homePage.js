//выход из личного кабинета 
const logout = new LogoutButton();
logout.action = function() {   
    ApiConnector.logout(response => {
        if (response.success) {
            location.reload(); 
        } 
    });
}

// получение информации о пользователе
ApiConnector.current(response => { 
    if (response.success) {
        ProfileWidget.showProfile(response.data); 
    }
});

// получение текущих курсов валюты
const rates = new RatesBoard(); 
getcourse();
setInterval(getcourse, 60000);

function getcourse() {
    ApiConnector.getStocks(response => {
        if (response.success) {
            rates.clearTable();
            rates.fillTable(response.data)  
        }
    });
}

//пополнение баланса
const moneyManager = new MoneyManager();   
moneyManager.addMoneyCallback = function({currency, amount}) {
    ApiConnector.addMoney({currency, amount}, response => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, "Транзакция прошла успешно");
        } else {
            moneyManager.setMessage(false, response.error);
        }
    });
}
//конвертирование валюты
moneyManager.conversionMoneyCallback = function({fromCurrency, targetCurrency, fromAmount}) {
    ApiConnector.convertMoney({fromCurrency, targetCurrency, fromAmount}, response => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, "Транзакция прошла успешно");
        } else {
            moneyManager.setMessage(false, response.error);
        }
    });
}
//перевод валюты
moneyManager.sendMoneyCallback = function({to, currency, amount}) {
    ApiConnector.transferMoney({to, currency, amount}, response => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, "Транзакция прошла успешно");
        } else {
            moneyManager.setMessage(false, response.error);
        }
    });
}

//запрос начального списка избранного
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

//добавление пользователя в список избранных
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

//удаление пользователя из избранного
favoritesWidget.removeUserCallback = function(id) {
   ApiConnector.removeUserFromFavorites(id, response => {
    if (response.success) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
        favoritesWidget.setMessage(true, "Пользователь удален из избранных");
    } else {
        favoritesWidget.setMessage(false, response.error);
    }
   });
}