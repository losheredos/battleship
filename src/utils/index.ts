import { Dimensions } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const BASE_WIDTH = 393; // Example: width of the design (e.g., iPhone 11 screen width)
const BASE_HEIGHT = 852; // Example: height of the design

const scaleWidth = SCREEN_WIDTH / BASE_WIDTH;

function scaledValue(value: number) {
    return value * scaleWidth;
}

export { SCREEN_WIDTH, SCREEN_HEIGHT, BASE_HEIGHT, scaledValue };
