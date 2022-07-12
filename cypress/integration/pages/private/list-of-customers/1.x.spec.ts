import { PageRoutes } from '@pages/pages-routes';
import { AppE2eSelectors } from '@universal-helpers/selectors';

describe('1 - List of Customers Page - List creation', () => {
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

  /** 1.3
   * GTS:  User selects the Customer lists in the nav bar
   * UDS: User clicks on a list in the nav bar
   * WES: Heatmap to reflect the list selected
   */
  it('1.3 - should have n accounts on heatmap tiles sum when the list was created with n accounts', () => {
    const nAccounts = [0, 1, 2, 5, 7];
    const nAccountLength = nAccounts.length;
    // open new list dialog
    cy.get(AppE2eSelectors.pages.privatePages.listOfcustomers.leftMenuNewListBtn).click();
    // set the new list name
    cy.get(AppE2eSelectors.components.listOfCustomers.listOfCustomersForm.nameInput).type(randomListName);
    // set the new list customer (only the first one)
    nAccounts.forEach((childIndex) => {
      cy.get(AppE2eSelectors.components.listOfCustomers.listOfCustomersForm.component)
        .find(AppE2eSelectors.components.table.selectBtn)
        .eq(childIndex)
        .click();
    });
    // save the new list
    cy.get(AppE2eSelectors.components.listOfCustomers.listOfCustomersFormDialog.saveBtn).click();
    // detect the new list creation
    cy.get(AppE2eSelectors.pages.privatePages.listOfcustomers.leftMenuNewListBtn).should('not.be.disabled');
    // verify if there is two accounts on the customer
    const tileBtns = cy.get(AppE2eSelectors.components.heatmap.tileBtn());
    let totalNumberOfAccounts: number = 0;
    tileBtns
      .each((el) => {
        const tileText = el.text();
        const totalTileAccounts = parseInt(tileText);
        totalNumberOfAccounts += totalTileAccounts;
      })
      .then(() => {
        expect(totalNumberOfAccounts).to.equal(nAccountLength);
      });
  });
});
