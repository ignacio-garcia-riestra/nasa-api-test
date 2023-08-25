describe("template spec", () => {
  it("passes", () => {
    cy.visit("/");

    cy.get("h1").contains("NASA - API - TEST");

    cy.get("button").click({ multiple: true });

    cy.url().should(
      "contains",
      "/Spirit" || "Curiosity" || "Opportunity" || "Perseverance"
    );
  });
});
