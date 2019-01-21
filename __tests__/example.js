import { coalesce } from "./utils/coalesce.js";

test("it works", () => {});

test("coalesce works", () => {
  expect(coalesce(null, 0, "", "maybe", undefined)).toBe("maybe");
});
