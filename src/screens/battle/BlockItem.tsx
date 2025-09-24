import { ImageBackground, Text, TouchableOpacity, StyleSheet } from "react-native";

import { BattleLayout } from "@screens/battle/logic.ts";
import { images } from "@assets/index.ts";
import { scaledValue } from "../../utils";

interface Props {
    item: BattleLayout;
    onPress: (id: string) => void;
    isDebug?: boolean;
    isPortrait: "portrait" | "landscape";
}

const BlockItem = function BlockItemNonMemoized({ item, onPress, isDebug = false, isPortrait }: Props) {
    const { isSelected, shipID } = item;

    function getImage() {
        if (isSelected) {
            return shipID ? images.icons.hit : images.icons.miss;
        }
    }

    return (
        <TouchableOpacity style={styles.container} onPress={() => onPress(item.id)}>
            <ImageBackground
                source={getImage()}
                style={isPortrait ? styles.verticalImageContainer : styles.horizontalImageContainer}
            >
                {isDebug && <Text style={styles.debugText}>{shipID}</Text>}
            </ImageBackground>
        </TouchableOpacity>
    );
};

export default BlockItem;

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: "black",
        alignItems: "center",
        justifyContent: "center",
    },
    horizontalImageContainer: {
        height: scaledValue(31),
        width: scaledValue(31),
    },
    verticalImageContainer: {
        height: scaledValue(34.3),
        width: scaledValue(34.3),
    },
    debugText: {
        fontSize: 9,
        color: "green",
        fontWeight: "bold",
        marginLeft: 2,
        marginTop: 2,
    },
});
