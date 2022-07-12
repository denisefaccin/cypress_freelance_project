// RUN O BROWSER

import { AppE2eSelectors } from '@universal-helpers/selectors';

const selectors = {
  login: AppE2eSelectors.pages.publicOnlyPages.login,
  topBar: AppE2eSelectors.pages.privatePages.topBar,
};

declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      alert(what: string): typeof alert;
    }
  }
}

Cypress.Commands.add('alert', (what: string) => {
  alert(what);
});

function alert(what: string): void {
  console.log(`
  ########### TESTER ALERT ###########
  ${what}
  ###### GOOD LUCKY  WITH THAT #######
  `);
}
