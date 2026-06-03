import { expect, test } from "@playwright/test";

const featuredPostTitle = "GraphQL: the enterprise honeymoon is over";

test.describe("home page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("introduces the blog", async ({ page }) => {
    await expect(page).toHaveTitle("John James Blog");
    await expect(page.getByRole("heading", { level: 1, name: "John James." })).toBeVisible();
    await expect(page.getByText("Notes on web, JS/TS, CI/CD, and experiments.")).toBeVisible();
  });

  test("shows a featured post and more stories", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 2, name: featuredPostTitle })).toBeVisible();
    await expect(
      page.getByRole("img", { name: `Cover Image for ${featuredPostTitle}` }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "More Stories" })).toBeVisible();

    const storyLinks = page.getByRole("heading", { level: 3 }).getByRole("link");
    await expect(storyLinks).not.toHaveCount(0);
  });

  test("opens the featured post", async ({ page }) => {
    await page
      .getByRole("heading", { level: 2, name: featuredPostTitle })
      .getByRole("link")
      .click();

    await expect(page).toHaveURL("/posts/graphql-the-enterprise-honeymoon-is-over");
    await expect(page.getByRole("heading", { level: 1, name: featuredPostTitle })).toBeVisible();
  });
});
