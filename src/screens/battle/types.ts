export type ShipNames = "carrier" | "battleship" | "cruiser" | "submarine" | "aircraft";

export type ShipType = { id: number; size: number; count: number };

export type DIRECTION = "UP" | "DOWN" | "LEFT" | "RIGHT";

export const DIRECTIONS = {
    UP: "UP",
    DOWN: "DOWN",
    RIGHT: "RIGHT",
    LEFT: "LEFT",
};

export const SHIP_LIST_OBJECT: Record<ShipNames, ShipType> = {
    carrier: { id: 1, size: 2, count: 1 },
    battleship: { id: 2, size: 4, count: 1 },
    cruiser: { id: 3, size: 3, count: 1 },
    submarine: { id: 4, size: 3, count: 1 },
    aircraft: { id: 5, size: 5, count: 1 },
};

export const eachRowLength = 10;
export const eachRowStartingEdge = 0;
export const eachRowEndingEdge = 9;
