import { getCoordinatesFromID, getRandomDirection, shuffle } from "./logic.ts";
import { DIRECTIONS } from "./types.ts";

describe("Login/Generation related tests", () => {
    it("should shuffle an array", () => {
        const array = [0, 1, 2, 3, 4, 5, 6];
        let misMatchCount = 0;

        for (let i = 1; i <= 3; i++) {
            const shuffledArray = shuffle([...array]);
            if (shuffledArray[0] !== array[0]) {
                misMatchCount++;
            }
        }

        expect(misMatchCount).toBeGreaterThan(0);
    });

    it("should get random possible direction", () => {
        const someSize = 3;
        const topLeftCornerID = 0,
            topRightCornerID = 9,
            bottomLeftCornerID = 90,
            bottomRightCornerID = 99;

        const topLeftRandomDirection = getRandomDirection(topLeftCornerID, someSize);
        expect([DIRECTIONS.RIGHT, DIRECTIONS.DOWN]).toContain(topLeftRandomDirection);

        const topRightRandomDirection = getRandomDirection(topRightCornerID, someSize);
        expect([DIRECTIONS.LEFT, DIRECTIONS.DOWN]).toContain(topRightRandomDirection);

        const bottomLeftRandomDirection = getRandomDirection(bottomLeftCornerID, someSize);
        expect([DIRECTIONS.RIGHT, DIRECTIONS.UP]).toContain(bottomLeftRandomDirection);

        const bottomRightRandomDirection = getRandomDirection(bottomRightCornerID, someSize);
        expect([DIRECTIONS.LEFT, DIRECTIONS.UP]).toContain(bottomRightRandomDirection);
    });

    it("should get correct coordinates from the id", () => {
        const id1 = 1;
        const id2 = 5;
        const id3 = 90;
        const id4 = 99;

        const [y1, x1] = getCoordinatesFromID(id1);
        expect(y1).toBe(0);
        expect(x1).toBe(1);

        const [y2, x2] = getCoordinatesFromID(id2);
        expect(y2).toBe(0);
        expect(x2).toBe(5);

        const [y3, x3] = getCoordinatesFromID(id3);
        expect(y3).toBe(9);
        expect(x3).toBe(0);

        const [y4, x4] = getCoordinatesFromID(id4);
        expect(y4).toBe(9);
        expect(x4).toBe(9);
    });
});
