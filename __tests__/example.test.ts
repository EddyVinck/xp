import coalesce from "./utils/coalesce";

test("it works", () => {});

test("coalesce works", () => {
  expect(coalesce(null, 0, "", "maybe", undefined)).toBe(0);
});
