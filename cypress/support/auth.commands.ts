// RUN O BROWSER
import { PageRoutes } from '@pages/pages-routes';
import { AppE2eSelectors } from '@universal-helpers/selectors';

const selectors = {
  login: AppE2eSelectors.pages.publicOnlyPages.login,
  topBar: AppE2eSelectors.pages.privatePages.topBar,
};

const LOCAL_STORAGE_MEMORY: any = {};

const user = Cypress.env('USER');
const password = Cypress.env('PASS');

declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      login(): typeof login;
      logout(): typeof logout;
      saveLocalStorage(): typeof saveLocalStorage;
      restoreLocalStorage(): typeof restoreLocalStorage;
      elementExists(el: any, cbk: any, errorCbk?: Function): typeof elementExists;
    }
  }
}

Cypress.Commands.add('saveLocalStorage', () => {
  saveLocalStorage();
});

Cypress.Commands.add('restoreLocalStorage', () => {
  restoreLocalStorage();
});

Cypress.Commands.add('login', () => {
  login();
});

Cypress.Commands.add('logout', () => {
  logout();
});

Cypress.Commands.add('elementExists', (element: Function, cbk: Function, errCbk?: Function) => {
  elementExists(element, cbk, errCbk);
});

function saveLocalStorage(): void {
  Object.keys(localStorage).forEach((key) => {
    const value = localStorage[key];
    if (key.includes('Cognito') && localStorage[key]) {
      LOCAL_STORAGE_MEMORY[key] = value;
    }
  });
}

function restoreLocalStorage(): void {
  Object.keys(LOCAL_STORAGE_MEMORY).forEach((key) => {
    const value = LOCAL_STORAGE_MEMORY[key];
    if (key.includes('Cognito') && value) {
      localStorage.setItem(key, value);
    }
  });
}

function clearLocalStorage(): void {
  Object.keys(LOCAL_STORAGE_MEMORY).forEach((key) => {
    if (key.includes('Cognito') && LOCAL_STORAGE_MEMORY[key]) {
      delete LOCAL_STORAGE_MEMORY[key];
    }
  });
}

function login() {
  cy.visit(PageRoutes.publicOnly.login);
  cy.get(selectors.login.e2eUsernameInput).type(user, { force: true });
  cy.get(selectors.login.e2ePasswordInput).type(password, { force: true });
  cy.get(selectors.login.e2eLoginButton).click({ force: true });
  return cy.get(selectors.topBar.userMenuButton, { timeout: 30e3 }).should('exist');
}

function logout() {
  clearLocalStorage();
  return cy.elementExists(selectors.topBar.userMenuButton, () => {
    cy.get(selectors.topBar.userMenuButton).click();
    cy.get(selectors.topBar.logoutButton).click();
    return cy.get(selectors.login.e2eUsernameInput).should('exist');
  });
}

function elementExists(element: any, cbk: Function, errorCbk?: Function) {
  cy.window().then((win) => {
    const identifiedElement = win.document.querySelector(element);
    if (identifiedElement) {
      cbk();
    } else if (errorCbk) {
      errorCbk();
    }
  });
}

Cypress.on('window:before:load', () => {
  restoreLocalStorage();
});

Cypress.on('url:changed', () => {
  restoreLocalStorage();
});

Cypress.on('before:url:changed', () => {
  restoreLocalStorage();
});
