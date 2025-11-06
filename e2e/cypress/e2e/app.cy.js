describe('Demo App E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('loads the app successfully', () => {
    cy.contains('Demo App').should('be.visible');
  });

  it('displays existing items', () => {
    cy.get('[data-testid="items-list"]', { timeout: 10000 }).should('exist');
  });

  it('creates a new item', () => {
    const itemName = `Test Item ${Date.now()}`;
    
    cy.get('[data-testid="item-input"]').type(itemName);
    cy.get('[data-testid="add-button"]').click();
    
    // Wait for the item to appear
    cy.contains(itemName, { timeout: 10000 }).should('be.visible');
  });

  it('full workflow: create and verify item appears', () => {
    const itemName = `E2E Item ${Date.now()}`;
    
    // Create item
    cy.get('[data-testid="item-input"]').type(itemName);
    cy.get('[data-testid="add-button"]').click();
    
    // Verify it appears in the list
    cy.contains(itemName).should('be.visible');
    
    // Refresh page and verify persistence
    cy.reload();
    cy.contains(itemName, { timeout: 10000 }).should('be.visible');
  });
});
