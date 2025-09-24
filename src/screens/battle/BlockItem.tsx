import { ImageBackground, Text, TouchableOpacity, StyleSheet } from "react-native";

import { BattleLayout } from "@screens/battle/logic.ts";
import { images } from "@assets/index.ts";

interface Props {
    item: BattleLayout;
    onPress: (id: string) => void;
    isDebug?: boolean;
}

const BlockItem = function BlockItemNonMemoized({ item, onPress, isDebug = false }: Props) {
    const { isSelected, shipID } = item;

    function getImage() {
        if (isSelected) {
            return shipID ? images.icons.hit : images.icons.miss;
        }
    }

    return (
        <TouchableOpacity style={styles.container} onPress={() => onPress(item.id)}>
            <ImageBackground source={getImage()} style={styles.imageContainer}>
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
    imageContainer: {
        height: 36,
        width: 36,
    },
    debugText: {
        fontSize: 9,
        color: "green",
        fontWeight: "bold",
        marginLeft: 2,
        marginTop: 2,
    },
});
