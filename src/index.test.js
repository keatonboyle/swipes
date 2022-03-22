const {
  PLANS,
  TIMES_OF_DAY,
  QUARTERS,
  findSwipes,
} = require('./index');

test("19P ends with 0 swipes", () => {
  expect(
    findSwipes(
      4, // Friday
      11, // Finals
      PLANS["19P"],
      TIMES_OF_DAY["late_night"])).toBe(0);
});

test("19 ends with 0 swipes", () => {
  expect(
    findSwipes(
      4, // Friday
      11, // Finals
      PLANS["19"],
      TIMES_OF_DAY["late_night"])).toBe(0);
});

test("14P ends with 0 swipes", () => {
  expect(
    findSwipes(
      4, // Friday
      11, // Finals
      PLANS["14P"],
      TIMES_OF_DAY["late_night"])).toBe(0);
});

test("14 ends with 0 swipes", () => {
  expect(
    findSwipes(
      4, // Friday
      11, // Finals
      PLANS["14"],
      TIMES_OF_DAY["late_night"])).toBe(0);
});

test("11P ends with 0 swipes", () => {
  expect(
    findSwipes(
      4, // Friday
      11, // Finals
      PLANS["11P"],
      TIMES_OF_DAY["late_night"])).toBe(0);
});

test("11 ends with 0 swipes", () => {
  expect(
    findSwipes(
      4, // Friday
      11, // Finals
      PLANS["11"],
      TIMES_OF_DAY["late_night"])).toBe(0);
});

test("19P is correct on Thursday of 10th week", () => {
  expect(
    findSwipes(
      3, // Thursday
      10, // 10th week
      PLANS["19P"],
      TIMES_OF_DAY["dinner"])).toBe(22);
});

test("19 is correct on Thursday of 10th week", () => {
  expect(
    findSwipes(
      3, // Thursday
      10, // 10th week
      PLANS["19"],
      TIMES_OF_DAY["dinner"])).toBe(7);
});

test("14P is correct on Thursday of 10th week", () => {
  expect(
    findSwipes(
      3, // Thursday
      10, // 10th week
      PLANS["14P"],
      TIMES_OF_DAY["dinner"])).toBe(16);
});

test("14 is correct on Thursday of 10th week", () => {
  expect(
    findSwipes(
      3, // Thursday
      10, // 10th week
      PLANS["14"],
      TIMES_OF_DAY["dinner"])).toBe(6);
});

test("11P is correct on Thursday of 10th week", () => {
  expect(
    findSwipes(
      3, // Thursday
      10, // 10th week
      PLANS["11P"],
      TIMES_OF_DAY["dinner"])).toBe(13);
});

test("11 is correct on Thursday of 10th week", () => {
  expect(
    findSwipes(
      3, // Thursday
      10, // 10th week
      PLANS["11"],
      TIMES_OF_DAY["dinner"])).toBe(3);
});

test("QUARTERS are in order", () => {
  for (let ii = 1; ii < QUARTERS.length; ii++) {
    expect(QUARTERS[ii].endTime).toBeGreaterThan(QUARTERS[ii-1].endTime);
  }
});



