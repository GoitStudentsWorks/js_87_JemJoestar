import {
  createUser,
  signInUser,
  signOutUser,
  onAuthUserChanged,
} from './firebase';

let timerId = null;

const form = document.getElementById('form-login-js');
const refs = {
  inputName: form.querySelector('[name="userName"]'),
  submitBtn: form.querySelector('#btn-submit-form'),
  signUp: document.getElementById('sign-up'),
  signIn: document.getElementById('sign-in'),
  logOutBtn: document.getElementById('btn-log-out'),
  backdrop: document.getElementById('backdrop-js'),
  openFormBtn: document.querySelector('.Authorization'),
  closeFormBtn: document.getElementById('btn-close-form'),
};

refs.openFormBtn.addEventListener('click', onOpenLoginForm);

//відкриваємо форму та вішаємо слухачів
function onOpenLoginForm() {
  form.addEventListener('submit', onSubmit);
  refs.signIn.addEventListener('click', onSignIn);
  refs.signUp.addEventListener('click', onSignUp);
  refs.closeFormBtn.addEventListener('click', onCloseLoginForm);

  refs.backdrop.classList.remove('is-hidden');
}
// дії при відправці форми
async function onSubmit(event) {
  event.preventDefault();

  const data = new FormData(form);
  const dataParams = {};
  for (const [key, value] of data.entries()) {
    dataParams[key] = value;
  }

  const { userEmail, userPassword } = dataParams;
  if (refs.submitBtn.textContent === 'SIGN UP') {
    createUser(userEmail, userPassword);
  } else {
    signInUser(userEmail, userPassword);
    refs.logOutBtn.addEventListener('click', outUser, { once: true });
  }

  timerId = setInterval(() => {
    onAuthUserChanged();
  }, 1000);

  form.reset();
}

//очищюємо інтервал коли User вийшов
function outUser() {
  signOutUser();
  clearInterval(timerId);
  timerId = null;
}

//змінюємо вид форми при натиснені SignIn
function onSignIn(event) {
  event.preventDefault();
  refs.inputName.toggleAttribute('required');
  refs.inputName.classList.add('is-hidden');
  refs.submitBtn.textContent = 'SIGN IN';
}

//змінюємо вид форми при натиснені SignUp
function onSignUp(event) {
  event.preventDefault();
  refs.inputName.toggleAttribute('required');
  refs.inputName.classList.remove('is-hidden');
  refs.submitBtn.textContent = 'SIGN UP';
}

//закриваємо форму і знімаємо всіх слухачів
function onCloseLoginForm() {
  refs.backdrop.classList.add('is-hidden');

  form.removeEventListener('submit', onSubmit);
  refs.signIn.removeEventListener('click', onSignIn);
  refs.signUp.removeEventListener('click', onSignUp);
  refs.closeFormBtn.removeEventListener('click', onCloseLoginForm);
}
