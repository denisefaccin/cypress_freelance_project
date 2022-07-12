import { PageRoutes } from '@pages/pages-routes';
import { AppE2eSelectors } from './../../../../../universal-helpers/selectors/index';

describe('6 - Testing the funcionality of using the heatmap to help drive a goal', () => {
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

  // * 6.1
  // * GTS: User wants to explore pipeline for each tile segment
  // * UDS: User clicks on pipeline tab in the heatmap
  // * WES: The information provided in the tiles changes to a $ dollar amount that reflects the sum of pipeline within each tile segment.

  it('6.1 - should click on pipeline tab in the heatmap and change to a dollar amount within each tile', () => {
    // * Given: User wants to explore pipeline for each tile segment
    cy.get(AppE2eSelectors.components.heatmap.heatmapTabPipeline).click();
    cy.get(AppE2eSelectors.components.heatmap.tileBtn()).should('contain.text', '$');
  });

  // * When: User clicks on pipeline tab in the heatmap

  // * Then: The information provided in the tiles changes to a $ dollar amount that reflects the sum of pipeline within each tile segment.
});
