import { PageRoutes } from '@pages/pages-routes';
import { AppE2eSelectors } from '@universal-helpers/selectors';

describe('4 - List of Customer Page - Customers List', () => {
  let notEmptyTileIndex: number;

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

  /** 4.2
   * GTS: User wants to see customer details in the heatmaps highest potential segments
   * UDS: User clicks on tile segment located in the top right corner (Tile 6.6) that has 12 customers in the tile
   * WES: The tile fills with coral; 12 customers from that tile are populated in the list view + 1) # Customers tab reflects 12, 2) customer ARR tab reflects total ARR from tile selected ($841K) and Pipeline tab reflects total sum of pipeline from selected tile ($920.9K)
   */
  it('4.2 - should mark the selected tile and show its accounts on customers list', () => {
    return cy
      .get(AppE2eSelectors.components.heatmap.tileBtn())
      .each((tileBtn, index) => {
        const tileText = tileBtn.text();
        const totalTileAccounts = parseInt(tileText);
        if (totalTileAccounts) {
          notEmptyTileIndex = index;
        }
      })
      .then(() => {
        // Given: user is in the list of customers page
        // When: user clicks on tile located in the top right corner
        cy.get(AppE2eSelectors.components.heatmap.tileBtn()).eq(notEmptyTileIndex).click();

        // Then: Check if the tile change color to coral
        cy.get(AppE2eSelectors.components.heatmap.tileBtn())
          .eq(notEmptyTileIndex)
          .should('have.css', 'background-color', 'rgb(249, 112, 104)');
        // Given: the number of accounts inside the selected tile
        return cy
          .get(AppE2eSelectors.components.heatmap.tileBtn())
          .eq(notEmptyTileIndex)
          .then((tileEl) => {
            const tileAccountsNumber = tileEl.text();
            const accountsNumber = parseInt(tileAccountsNumber);
            // Then: Check if the accounts of the selected tile are present in the customers list
            cy.get(AppE2eSelectors.components.table.tableRow).should('have.length', accountsNumber);
            // Then: Check if the number of customers are reflected in the tab customers
            cy.get(AppE2eSelectors.components.heatmap.heatmapTabCustomers).should('contain.text', accountsNumber);
            // TODO: Test the sum result
            // Then: Check if the total ARR of the tile selcted is reflected in the ARR tab
            cy.get(AppE2eSelectors.components.heatmap.heatmapTabARR).its('text').should('exist');
            // TODO: Test the sum result
            // Then: Check if the total pipeline sum is reflected in the pipeline tab
            cy.get(AppE2eSelectors.components.heatmap.heatmapTabPipeline).its('text').should('exist');

            // Deselect the tile before running the next test
            cy.get(AppE2eSelectors.components.heatmap.tileBtn()).eq(notEmptyTileIndex).click();
          });
      });
  });

  /** 4.3
   * GTS: User wants to select customers from the heatmap
   * UDS: User clicks on the top-right corner tile
   * WES: The accounts from the tile should be included and selected on the customers list
   */
  it('4.3 - should include and select the customers from a selected tile', () => {
    // Given: user is in the list of customers page
    // When: user clicks on the top-right-corner tile
    cy.get(AppE2eSelectors.components.heatmap.tileBtn()).eq(notEmptyTileIndex).click();
    // Then: Check if the accounts of the selected tile are shown in the customers list
    cy.get(AppE2eSelectors.components.heatmap.tileBtn())
      .eq(notEmptyTileIndex)
      .then((tileEl) => {
        const tileAccountsNumber = tileEl.text();
        const accountsNumber = parseInt(tileAccountsNumber);
        // Then: Check if the accounts of the selected tile are present in the customers list
        cy.get(AppE2eSelectors.components.table.tableRow).should('have.length', accountsNumber);
        // Then: Check if the accounts of the tile are selected in the customers list
        if (accountsNumber > 1) {
          return cy
            .get('[data-uid="app-table-row"] .mat-icon[data-mat-icon-name="BOX_SELECTED"]')
            .should('have.lenght', accountsNumber);
        } else {
          return cy.get('[data-uid="app-table-row"] .mat-icon[data-mat-icon-name="BOX_SELECTED"]').should('exist');
        }
      });
  });
});
