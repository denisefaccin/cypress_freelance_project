import { PageRoutes } from '@pages/pages-routes';
import { AppE2eSelectors } from '@universal-helpers/selectors';

describe('0 - List of Customers Page - Left Menu', () => {
  const randomListName = `${Date.now()}`;

  afterEach(() => {
    cy.saveLocalStorage();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  before(() => {
    return cy.login();
  });

  after(() => {
    return cy.logout();
  });

  it('Visits List of Customer Page', () => {
    cy.location('pathname').should('contain', PageRoutes.private.listOfCustomers.dashboard());
  });

  /** 0.1
   * GTS: User want to remove a lists
   * UDS: User click remove list button
   * WES: user should be redirected to another list and the menu item should be removed
   */
  it('0.1 - should have at least one ListOfcustomer on the Left Menu', () => {
    cy.get(AppE2eSelectors.pages.privatePages.listOfcustomers.leftMenu).should('exist');
    cy.get(AppE2eSelectors.pages.privatePages.listOfcustomers.leftMenuItem()).should('exist');
  });

  /** 0.2
   * GTS: User want to add a lists
   * UDS: User open list of customer page
   * WES: user see a New List button
   */
  it('0.2 - should have a New List button', () => {
    cy.get(AppE2eSelectors.pages.privatePages.listOfcustomers.leftMenuNewListBtn).should('exist');
  });

  /** 0.3
   * GTS: User want create
   * UDS: User create a new list
   * WES: menu show the new list
   */
  it('0.3 - should create a new List', () => {
    // open new list dialog
    cy.get(AppE2eSelectors.pages.privatePages.listOfcustomers.leftMenuNewListBtn).should('exist');
    cy.get(AppE2eSelectors.pages.privatePages.listOfcustomers.leftMenuNewListBtn).click();
    cy.get(AppE2eSelectors.components.listOfCustomers.listOfCustomersFormDialog.component).should('exist');
    cy.get(AppE2eSelectors.components.listOfCustomers.listOfCustomersForm.component).should('exist');
    cy.get(AppE2eSelectors.components.listOfCustomers.listOfCustomersFormDialog.saveBtn).should('exist');
    cy.get(AppE2eSelectors.components.listOfCustomers.listOfCustomersForm.nameInput).should('exist');
    // set the new list name
    cy.get(AppE2eSelectors.components.listOfCustomers.listOfCustomersForm.nameInput).type(randomListName);
    // set the new list customers
    cy.get(AppE2eSelectors.components.listOfCustomers.listOfCustomersForm.component)
      .find(AppE2eSelectors.components.table.selectAllBtn)
      .should('exist');
    cy.get(AppE2eSelectors.components.listOfCustomers.listOfCustomersForm.component)
      .find(AppE2eSelectors.components.table.selectAllBtn)
      .click();
    // save the new list
    cy.get(AppE2eSelectors.components.listOfCustomers.listOfCustomersFormDialog.saveBtn).click();
    // detect the new list creation
    cy.get(AppE2eSelectors.components.listOfCustomers.listOfCustomersFormDialog.component).should('not.exist');
    cy.get(AppE2eSelectors.pages.privatePages.listOfcustomers.leftMenuNewListBtn).should('not.be.disabled');
    // verify if the new list apears on left menu
    return cy
      .get(AppE2eSelectors.pages.privatePages.listOfcustomers.leftMenu)
      .find(`${AppE2eSelectors.pages.privatePages.listOfcustomers.leftMenuItem()}`, { timeout: 30e3 })
      .should('contain.text', randomListName);
  });

  /** 0.4
   * GTS: User want create a list
   * UDS: User add the new list
   * WES: user should see the new list on left menu
   */
  it('0.4 - should display a menu on the new ListOfcustomer on the Left Menu', () => {
    const newListLeftMenuItemMenu = cy
      .get(AppE2eSelectors.pages.privatePages.listOfcustomers.leftMenu)
      .find(`${AppE2eSelectors.pages.privatePages.listOfcustomers.leftMenuItem()}`)
      .contains(randomListName)
      .parent()
      .find(AppE2eSelectors.pages.privatePages.listOfcustomers.leftMenuItemMenu());
    newListLeftMenuItemMenu.should('exist');
  });

  /** 0.5
   * GTS: User want to remove a lists
   * UDS: User click remove list button
   * WES: user should be redirected to another list and the menu item should be removed
   */
  it('0.5 - should remove the new list created', () => {
    // open the menu
    const newListLeftMenuItemMenu = cy
      .get(AppE2eSelectors.pages.privatePages.listOfcustomers.leftMenu)
      .find(`${AppE2eSelectors.pages.privatePages.listOfcustomers.leftMenuItem()}`)
      .contains(randomListName)
      .parent()
      .find(AppE2eSelectors.pages.privatePages.listOfcustomers.leftMenuItemMenu());
    newListLeftMenuItemMenu.click();
    // click the remove button
    const newListLeftMenuItemMenuRemoveButton = cy.get(
      AppE2eSelectors.pages.privatePages.listOfcustomers.leftMenuItemRemoveBtn(),
    );
    newListLeftMenuItemMenuRemoveButton.should('exist');
    newListLeftMenuItemMenuRemoveButton.click();
    // approve the deletion
    cy.get(AppE2eSelectors.components.ask.component).should('exist');
    cy.get(AppE2eSelectors.components.ask.confirmBtn).click();
    cy.get(AppE2eSelectors.components.ask.component).should('not.exist');
    // detect the new list deletion
    cy.reload();
    cy.get(AppE2eSelectors.pages.privatePages.listOfcustomers.leftMenu)
      .find(`${AppE2eSelectors.pages.privatePages.listOfcustomers.leftMenuItem()}`)
      .contains(randomListName)
      .should('not.exist');
  });

  it('0.6 - should select the first list on the first time the user opens the list of customers page', () => {
    //
  });

  it('0.7 - should select the last opened list when the user opens the list of customers page', () => {
    //
  });
});
