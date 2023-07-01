'use strict'
const userForm = new UserForm();

userForm.loginFormCallback = ({login, password}) => {
	ApiConnector.login({login, password}, (response) => {
		if (response.success) {  
			location.reload(); // Перезагрузка страницы после успешной авторизации
		} else {
			userForm.setLoginErrorMessage(response.error); // Установка текста ошибки на форму
		}
	});
};

userForm.registerFormCallback = ({login, password}) => {
	ApiConnector.register({login, password}, (response) => {
		if (response.success) {
			location.reload(); // Перезагрузка страницы после успешной регистрации 
		} else {
			userForm.setRegisterErrorMessage(response.error);
		}
	});
};