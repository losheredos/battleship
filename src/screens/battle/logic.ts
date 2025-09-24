import {
    DIRECTION,
    DIRECTIONS,
    eachRowEndingEdge,
    eachRowLength,
    eachRowStartingEdge,
    ShipNames,
    ShipType,
} from "./types.ts";

export interface BattleLayout {
    id: string;
    coordinates: [number, number];
    shipID?: number;
    isSelected?: boolean;
}

function shuffle(arr: any[]) {
    return arr.sort(() => (Math.random() > 0.5 ? -1 : 1));
}

function getRandomDirection(id: number, size: number): DIRECTION {
    const possibleDirections = [];
    const [y, x] = getCoordinatesFromID(id);
    if (x + size < eachRowEndingEdge) {
        possibleDirections.push(DIRECTIONS.RIGHT);
    }
    if (x - size > eachRowStartingEdge) {
        possibleDirections.push(DIRECTIONS.LEFT);
    }
    if (y + size < eachRowEndingEdge) {
        possibleDirections.push(DIRECTIONS.DOWN);
    }
    if (y - size > eachRowStartingEdge) {
        possibleDirections.push(DIRECTIONS.UP);
    }
    return shuffle(possibleDirections)[0];
}

function canFitEachSpotUntilTheEnd(
    start: number,
    end: number,
    otherCoordinate: number,
    coordinateToUpdate: "x" | "y",
    shipID: number,
    spots: BattleLayout[],
): [boolean, BattleLayout[]] {
    let canFit = true;
    const isStartBiggerThanEnd = start > end;

    for (let i = start; isStartBiggerThanEnd ? i > end : i < end; isStartBiggerThanEnd ? i-- : i++) {
        let nextX = 0;
        let nextY = 0;
        if (coordinateToUpdate === "x") {
            nextX += i;
            nextY = otherCoordinate;
        }
        if (coordinateToUpdate === "y") {
            nextY += i;
            nextX = otherCoordinate;
        }
        const spot = spots.find(each => {
            const [y, x] = each.coordinates;
            return x === nextX && y === nextY;
        });
        if (spot && spot.shipID) {
            canFit = false;
            break;
        }
    }

    if (canFit) {
        for (let i = start; isStartBiggerThanEnd ? i > end : i < end; isStartBiggerThanEnd ? i-- : i++) {
            let nextX = 0;
            let nextY = 0;
            if (coordinateToUpdate === "x") {
                nextX += i;
                nextY = otherCoordinate;
            }
            if (coordinateToUpdate === "y") {
                nextY += i;
                nextX = otherCoordinate;
            }
            const spot = spots.find(each => {
                const [y, x] = each.coordinates;
                return x === nextX && y === nextY;
            });
            if (spot && !spot.shipID) {
                spot.shipID = shipID;
            }
        }
    }

    return [canFit, spots];
}

function canFitToSpot(
    spotDetails: { id: string; coordinates: [number, number] },
    shipID: number,
    size: number,
    direction: DIRECTION,
    spotsToMap: BattleLayout[],
): [boolean, BattleLayout[]] {
    const { coordinates } = spotDetails;
    const [y, x] = coordinates;

    let finalX = x;
    let finalY = y;
    let canFitToSpot = false;

    if (direction === DIRECTIONS.UP) {
        finalY = y - size;
        if (finalY > eachRowStartingEdge) {
            let [result, finalSpots] = canFitEachSpotUntilTheEnd(finalY, y, x, "y", shipID, spotsToMap);
            canFitToSpot = result;
            spotsToMap = finalSpots;
        }
    }
    if (direction === DIRECTIONS.DOWN && !canFitToSpot) {
        finalY = y + size;
        if (finalY < eachRowEndingEdge) {
            let [result, finalSpots] = canFitEachSpotUntilTheEnd(finalY, y, x, "y", shipID, spotsToMap);
            canFitToSpot = result;
            spotsToMap = finalSpots;
        }
    }
    if (direction === DIRECTIONS.LEFT && !canFitToSpot) {
        finalX = x - size;
        if (finalX < eachRowEndingEdge) {
            let [result, finalSpots] = canFitEachSpotUntilTheEnd(finalX, x, y, "x", shipID, spotsToMap);
            canFitToSpot = result;
            spotsToMap = finalSpots;
        }
    }
    if (direction === DIRECTIONS.RIGHT && !canFitToSpot) {
        finalX = x + size;
        if (finalX < eachRowEndingEdge) {
            let [result, finalSpots] = canFitEachSpotUntilTheEnd(finalX, x, y, "x", shipID, spotsToMap);
            canFitToSpot = result;
            spotsToMap = finalSpots;
        }
    }

    return [canFitToSpot, spotsToMap];
}

function getCoordinatesFromID(id: number): [number, number] {
    const y = Math.floor(id / eachRowLength);
    const x = id % eachRowLength;
    return [y, x];
}

function findRandomEmptySpotForShip(layout: BattleLayout[], shipID: number, size: number): BattleLayout[] {
    for (let i = 0; i < layout.length; i += 1) {
        const emptySpot = layout[getRandomInt(0, layout.length - 1)]; // to get random spot
        const randomDirection = getRandomDirection(shipID, size);
        const [canFit, finalEmptySpots] = canFitToSpot(
            { id: emptySpot.id, coordinates: emptySpot.coordinates },
            shipID,
            size,
            randomDirection,
            layout,
        );
        if (canFit) {
            layout = finalEmptySpots;
            break;
        }
    }
    return layout;
}

function createBattleLayout(shipList: Record<ShipNames, ShipType>): BattleLayout[] {
    let layout = Array.from({ length: 100 }, (_, i) => ({
        id: getRandomStr(),
        coordinates: getCoordinatesFromID(i),
    }));
    (Object.keys(shipList) as ShipNames[]).forEach(key => {
        const value = shipList[key]; // typed as ShipType
        for (let i = 0; i < value.count; i++) {
            layout = findRandomEmptySpotForShip(layout, value.id, value.size);
        }
    });
    return layout;
}

function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomStr() {
    let str = "";
    const randomStrings = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S"];
    for (let i = 0; i < 6; i++) {
        str += shuffle(randomStrings)[0];
    }
    return str + getRandomInt(0, 100);
}

export { shuffle, getRandomDirection, getCoordinatesFromID, createBattleLayout };
