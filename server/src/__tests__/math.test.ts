import { sum } from "../math";

describe("math.js", () => {
  describe("sum", () => {
    it("should add 2 numbers", () => {
      expect(sum(1, 1)).toBe(2);
    });
  });
});
