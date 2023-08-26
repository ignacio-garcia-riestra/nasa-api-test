describe("template spec", () => {
  it("passes", () => {
    cy.visit("/");

    cy.get("#home-header").contains("Lets explore Mars!!");
  });
});

export {};
