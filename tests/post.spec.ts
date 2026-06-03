import { expect, test } from "@playwright/test";

const postTitle = "GraphQL: the enterprise honeymoon is over";
const postPath = "/posts/graphql-the-enterprise-honeymoon-is-over";

test.describe("post page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(postPath);
  });

  test("shows the article header", async ({ page }) => {
    await expect(page).toHaveTitle(`${postTitle} | John James`);

    const article = page.getByRole("article");
    await expect(article.getByRole("heading", { level: 1, name: postTitle })).toBeVisible();
    await expect(article.getByRole("img", { name: `Cover Image for ${postTitle}` })).toBeVisible();
    await expect(article.getByText("December 14, 2025", { exact: true })).toBeVisible();
    await expect(article.getByText(/\d+ min read/)).toBeVisible();
  });

  test("renders the post content", async ({ page }) => {
    const article = page.getByRole("article");

    await expect(
      article.getByText(
        "I’ve used GraphQL, specifically Apollo Client and Server, for a couple of years in a real enterprise-grade application.",
      ),
    ).toBeVisible();
    await expect(
      article.getByRole("heading", { level: 2, name: "What GraphQL is supposed to solve" }),
    ).toBeVisible();
    await expect(
      article.getByText("the client asks for exactly the fields it needs", { exact: true }),
    ).toBeVisible();
  });

  test("offers a path to continue reading", async ({ page }) => {
    const article = page.getByRole("article");

    await expect(article.getByText("Continue reading", { exact: true })).toBeVisible();
    await expect(
      article.getByRole("link", {
        name: "Automating Dependabot reviews: how AI cut 95% of dependency research time",
      }),
    ).toBeVisible();
    await expect(article.getByRole("link", { name: "All posts" })).toBeVisible();
  });

  test("omits continue reading on the oldest post", async ({ page }) => {
    await page.goto("/posts/cleaning-house-in-nx-monorepo-how-i-removed-120-unused-deps-safely");

    const article = page.getByRole("article");

    await expect(article.getByText("Continue reading", { exact: true })).toHaveCount(0);
    await expect(article.getByRole("link", { name: "All posts" })).toBeVisible();
  });

  test("returns to the home page", async ({ page }) => {
    await page.getByRole("link", { name: "← All posts" }).click();

    await expect(page).toHaveURL("/");
    await expect(page.getByRole("heading", { level: 1, name: "John James." })).toBeVisible();
  });
});
