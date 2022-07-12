import { IMPACT } from '@models/impact';
import { PageRoutes } from '@pages/pages-routes';
import { AppE2eSelectors } from '@universal-helpers/selectors';

describe('2 - List of Customers Page - Heatmap', () => {
  const randomListName = `${Date.now()}`;

  const topRightTileSelector = AppE2eSelectors.components.heatmap.tileBtn(5, 5);

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

  /** 2.1
   * GTS:  User selects the Customer lists in the nav bar
   * UDS: User clicks on a list in the nav bar
   * WES: Users sees a list of all selected customers
   */
  it('2.1 - should have same number of accounts on customers list as selected when the list was created', () => {
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
    // select all tiles
    cy.get(AppE2eSelectors.components.heatmap.selectAlltiles).click();
    // expect to have as muach accounts as selected when the list was created
    cy.get(AppE2eSelectors.components.table.tableRow).should('have.length', nAccountLength);
  });

  /** 2.2
   * GTS:  User selects the Customer lists in the nav bar
   * UDS: User clicks on a list in the nav bar
   * WES: Users sees the following details on customers list (if the info is available):customer name, CSM owner, ARR, Pipeline, Renewal date, potential, and engagement details within the list view
   */
  it('2.2 - should show account details and display [customer name, CSM owner, ARR, Pipeline, Renewal date, potential, engagement]', () => {
    const firstRow = cy.get(AppE2eSelectors.components.table.tableRow).eq(0);
    const customerCell = firstRow.get(AppE2eSelectors.components.table.rowCell).eq(1);
    customerCell.should('not.be.empty');
    const ownerCell = firstRow.get(AppE2eSelectors.components.table.rowCell).eq(2);
    ownerCell.should('not.be.empty');
    const arrCell = firstRow.get(AppE2eSelectors.components.table.rowCell).eq(3);
    arrCell.should('not.be.empty');
    const pipelineCell = firstRow.get(AppE2eSelectors.components.table.rowCell).eq(4);
    pipelineCell.should('not.be.empty');
    const renewalCell = firstRow.get(AppE2eSelectors.components.table.rowCell).eq(5);
    renewalCell.should('not.be.empty');
    const potentialCell = firstRow.get(AppE2eSelectors.components.table.rowCell).eq(6);
    potentialCell.should('not.be.empty');
    const engagementCell = firstRow.get(AppE2eSelectors.components.table.rowCell).eq(7);
    engagementCell.should('not.be.empty');
  });

  /** 4.1
   * GTS: User wants to explore the heatmap to find highest engaged customers with highest potential
   * UDS: User hovers over tile segment located in the top right corner (Tile 6.6) that has 12 customers in the tile
   * WES: The tile outlines in coral; pop up modal that shows “12 customers” and potential “high” engagement “high”
   */
  it(
    '4.1 - should show tile tooltip containing potential and engagement data and the number of accounts' +
      topRightTileSelector,
    () => {
      // Given: user is in the list of customers details page
      // When: Hover over top-right tile
      cy.get(topRightTileSelector).trigger('mouseenter');
      // Then: Check if the tooltip is shown
      cy.get(AppE2eSelectors.components.tooltip.component).should('exist');
      // Then: Check if the tooltip potential is high
      cy.get(AppE2eSelectors.components.heatmap.tooltipPotential).should('have.text', IMPACT.HIGH);
      // Then: Check if the tooltip engajament is high
      cy.get(AppE2eSelectors.components.heatmap.tooltipEngagement).should('have.text', IMPACT.HIGH);
      // Then: Check if the tile and tooltips number of accounts are the same
      cy.get(topRightTileSelector)
        .then((tileEl) => {
          const tileAccountsNumber = tileEl.text();
          return cy.get(AppE2eSelectors.components.heatmap.tooltipTitle).should('contain.text', tileAccountsNumber);
        })
        .then(() => {
          // When: Remove the top-right tile hover
          cy.get(topRightTileSelector).trigger('mouseleave');
          // Then: Check if the tooltip is hidden
          cy.get(AppE2eSelectors.components.tooltip.component).should('not.exist');
        });
    },
  );
});
