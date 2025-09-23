import { SHIP_TYPES } from "@screens/battle/index.tsx";

export interface BattleLayout {
    id: number;
    coordinates: [number, number];
    shipID?: number;
}

type DIRECTION = "UP" | "DOWN" | "LEFT" | "RIGHT";

const DIRECTIONS = {
    UP: "UP",
    DOWN: "DOWN",
    RIGHT: "RIGHT",
    LEFT: "LEFT",
};

const eachRowLength = 10;
const eachRowStartingEdge = 0;
const eachRowEndingEdge = 9;

function shuffle(arr: any[]) {
    return arr.sort((a, b) => (Math.random() > 0.5 ? -1 : 1));
}

function getRandomDirection(id: number, size: number): DIRECTION {
    const possibleDirections = [];
    const [x, y] = getCoordinatesFromID(id);
    if (y + size < eachRowEndingEdge) {
        possibleDirections.push(DIRECTIONS.RIGHT);
    }
    if (y - size > eachRowStartingEdge) {
        possibleDirections.push(DIRECTIONS.LEFT);
    }
    if (x + size < eachRowEndingEdge) {
        possibleDirections.push(DIRECTIONS.DOWN);
    }
    if (x - size > eachRowStartingEdge) {
        possibleDirections.push(DIRECTIONS.UP);
    }
    return shuffle(possibleDirections)[0];
}

function getRandomSpot(emptySpots: any[]) {
    return shuffle(emptySpots)[0];
}

function canFitEachSpotUntilTheEnd(
    start: number,
    end: number,
    otherCoordinate: number,
    coordinateToUpdate: "x" | "y",
    spots: BattleLayout[],
): [boolean, BattleLayout[]] {
    let canFit = false;
    for (let i = start; i < end; start > end ? i-- : i++) {
        let nextX = 0;
        let nextY = 0;
        if (coordinateToUpdate === "x") {
            nextX += start;
            nextY = otherCoordinate;
        }
        if (coordinateToUpdate === "y") {
            nextY += start;
            nextY = otherCoordinate;
        }
        const spot = spots.find(each => {
            const [x, y] = each.coordinates;
            return x === nextX && y === nextY;
        });
        if (spot && !spot.shipID) {
            canFit = true;
            spot.shipID = 1111;
            break;
        }
    }
    return [canFit, spots];
}

function canFitToSpot(
    id: number,
    size: number,
    direction: DIRECTION,
    spotsToMap: BattleLayout[],
): [boolean, BattleLayout[]] {
    const [y, x] = getCoordinatesFromID(id);
    let finalX = x;
    let finalY = y;
    let canFitToSpot = false;
    if (direction === DIRECTIONS.UP) {
        finalY = y - size;
        if (finalY > eachRowStartingEdge) {
            let [result, finalSpots] = canFitEachSpotUntilTheEnd(finalY, y, x, "y", spotsToMap);
            canFitToSpot = result;
            spotsToMap = finalSpots;
        }
    }
    if (direction === DIRECTIONS.DOWN) {
        finalY = y + size;
        if (finalY < eachRowEndingEdge) {
            let [result, finalSpots] = canFitEachSpotUntilTheEnd(finalY, y, x, "y", spotsToMap);
            canFitToSpot = result;
            spotsToMap = finalSpots;
        }
    }
    if (direction === DIRECTIONS.LEFT) {
        finalX = x - size;
        if (finalX < eachRowEndingEdge) {
            let [result, finalSpots] = canFitEachSpotUntilTheEnd(finalX, x, y, "x", spotsToMap);
            canFitToSpot = result;
            spotsToMap = finalSpots;
        }
    }
    if (direction === DIRECTIONS.RIGHT) {
        finalX = x + size;
        if (finalX < eachRowEndingEdge) {
            let [result, finalSpots] = canFitEachSpotUntilTheEnd(finalX, x, y, "x", spotsToMap);
            canFitToSpot = result;
            spotsToMap = finalSpots;
        }
    }

    return [canFitToSpot, spotsToMap];
}

function getCoordinatesFromID(id: number): [number, number] {
    const x = Math.floor(id / eachRowLength);
    const y = id % eachRowLength;
    return [y, x];
}

export function findRandomEmptySpotForShip(
    layout: BattleLayout[],
    shipID: number,
    size: number,
): BattleLayout[] {
    let emptySpots = layout.filter(each => !each.shipID);
    for (let i = 0; i < emptySpots.length; i += 1) {
        const emptySpot = emptySpots[i];

        const randomDirection = getRandomDirection(shipID, size);
        const [canFit, finalEmptySpots] = canFitToSpot(
            emptySpot.id,
            size,
            randomDirection,
            emptySpots,
        );
        if (canFit) {
            emptySpots = finalEmptySpots;
            break;
        }
    }
    return emptySpots;
}

export function createBattleLayout(): BattleLayout[] {
    let layout = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        coordinates: getCoordinatesFromID(i),
    }));
    Object.keys(SHIP_TYPES).forEach(key => {
        const value = SHIP_TYPES[key] as { id: number; size: number };
    });
    layout = findRandomEmptySpotForShip(
        layout,
        SHIP_TYPES.battleShip.id,
        SHIP_TYPES.battleShip.size,
    );
    console.log(layout);
    return layout;
}
