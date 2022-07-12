import { PageRoutes } from '@pages/pages-routes';
import { AppE2eSelectors } from '@universal-helpers/selectors';

describe('5 - Testing the funcionality of drop down menu', () => {
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

  //* 5.1 -

  // * GTS: User wants to see customer details into the tile populated in the view list
  // * UDS: User clicks on the drop down arrow
  // * WES: The customer account details should appear in a collapsed list

  it('5.1 - should click in the drop down arrow and appear the collapsed list containing accounts details  ', () => {
    // Given: User clicks in button all tiles
    cy.get(AppE2eSelectors.components.heatmap.selectAlltiles).click();

    // When: user clicks in the first toggle button
    cy.get(AppE2eSelectors.components.table.toggleBtn).first().click();

    // Then: check if the customer resume card details exists
    cy.get(AppE2eSelectors.components.customer.customerSprintResumeCard.advancedUsers).should('exist');
    cy.get(AppE2eSelectors.components.customer.customerSprintResumeCard.emailConversations).should('exist');
    cy.get(AppE2eSelectors.components.customer.customerSprintResumeCard.emailEngagementScore).should('exist');
    cy.get(AppE2eSelectors.components.customer.customerSprintResumeCard.eventEngagementScore).should('exist');
    cy.get(AppE2eSelectors.components.customer.customerSprintResumeCard.marketingEngagementScore).should('exist');
    cy.get(AppE2eSelectors.components.customer.customerSprintResumeCard.meetingAttendees).should('exist');
    cy.get(AppE2eSelectors.components.customer.customerSprintResumeCard.productEngagementScore).should('exist');
    cy.get(AppE2eSelectors.components.customer.customerSprintResumeCard.productUsers).should('exist');
    cy.get(AppE2eSelectors.components.customer.customerSprintResumeCard.supportCaseCount).should('exist');
  });

  //* 5.2 -

  // * GTS: User no wants to see customer details into collapsed list
  // * UDS: User clicks on the drop down arrow
  // * WES: The customer account details should disappear

  it('5.2 - should click in the drop down arrow and disappear the collapsed list ', () => {
    // Given: user does not want sees the account details
    // When: user clicks in the first toggle button
    cy.get(AppE2eSelectors.components.table.toggleBtn).first().click();
    // Then: check if the customer resume card details disappear
    cy.get(AppE2eSelectors.components.customer.customerSprintResumeCard.component).should('not.exist');
  });
});
