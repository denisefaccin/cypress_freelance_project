import { PageRoutes } from '@pages/pages-routes';
import { AppE2eSelectors } from '@universal-helpers/selectors';

describe('Login Page', () => {
  before(() => {
    return cy.logout();
  });

  it('Visits the Login Page', () => {
    cy.visit(PageRoutes.publicOnly.login);
    cy.location('pathname').should('eq', PageRoutes.publicOnly.login);
  });

  it('should login and see the user menu', () => {
    cy.login();
    const menuButtonSelector = AppE2eSelectors.pages.privatePages.topBar.userMenuButton;
    cy.get(menuButtonSelector).should('exist');
  });

  it('should logout', () => {
    cy.visit(PageRoutes.publicOnly.login);
    cy.logout();
    cy.location('pathname').should('eq', PageRoutes.publicOnly.login);
  });
});
