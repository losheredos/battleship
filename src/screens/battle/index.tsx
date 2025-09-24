import { View, FlatList, Image, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ReactNode, useEffect, useState } from "react";

import { useDeviceOrientation } from "@react-native-community/hooks";

import { BattleLayout, createBattleLayout } from "./logic.ts";
import BlockItem from "@screens/battle/BlockItem.tsx";
import { images } from "@assets/index.ts";

export const SHIP_TYPES = {
    carrier: { id: 1, size: 2, count: 1 },
    battleship: { id: 2, size: 4, count: 1 },
    cruiser: { id: 3, size: 3, count: 1 },
    submarine: { id: 4, size: 3, count: 1 },
    aircraft: { id: 5, size: 5, count: 1 },
};

const Battle = () => {
    const orientation = useDeviceOrientation();
    const [layout, setLayout] = useState<BattleLayout[]>([]);

    const isPortrait = orientation === "portrait";

    useEffect(() => {
        setInitialLayout();
    }, []);

    function setInitialLayout() {
        setLayout(createBattleLayout());
    }

    function selectSpot(id: string) {
        const newLayout = [...layout];
        const itemToModify = newLayout.find(each => each.id === id);
        if (itemToModify) {
            itemToModify.isSelected = true;
            setLayout(newLayout);
        }
    }

    const _renderItem = ({ item }: { item: BattleLayout }) => {
        return <BlockItem key={item.id} item={item} onPress={selectSpot} isPortrait={isPortrait} />;
    };

    function renderShips() {
        const shipsToRender: ReactNode[] = [];
        Object.keys(SHIP_TYPES).forEach(key => {
            const ship = SHIP_TYPES[key];
            const foundLength = layout.filter(each => each.isSelected && each.shipID === ship.id)?.length;
            const shotImages = [];

            for (let i = 0; i < foundLength; i++) {
                shotImages.push(
                    <Image
                        key={key + i}
                        source={images.icons.hitSmall}
                        style={[styles.smallHitIcon, { marginLeft: i === 0 ? 10 : 6 }]}
                    />,
                );
            }

            function getShipStatusColor() {
                const isDestroyed = foundLength >= ship.size;
                if (isDestroyed) {
                    return "red";
                }
                if (foundLength > 0) {
                    return "darkorange";
                }
                return "darkgreen";
            }

            shipsToRender.push(
                <View style={styles.shipContainer} key={key}>
                    <Text style={[styles.shipIdText, { color: getShipStatusColor() }]}>
                        ID:{ship.id} ({foundLength}/{ship.size})
                    </Text>
                    <Image source={images.ships[key]} style={styles.shipImage} resizeMode="contain" />
                    {shotImages}
                </View>,
            );
        });
        return <View style={{ marginLeft: isPortrait ? 5 : 20, marginTop: 6 }}>{shipsToRender}</View>;
    }

    return (
        <View style={{ padding: 15 }}>
            <View style={{ flexDirection: isPortrait ? "column" : "row" }}>
                <View>
                    <TouchableOpacity onPress={setInitialLayout} style={{ marginBottom: 5 }}>
                        <Text style={{ color: "red" }}>Restart</Text>
                    </TouchableOpacity>
                    <FlatList
                        ListEmptyComponent={() => <Text>Loading...</Text>}
                        data={layout}
                        renderItem={_renderItem}
                        numColumns={10}
                        contentContainerStyle={styles.flatListColor}
                        scrollEnabled={false}
                        // Can be further optimized with related props
                    />
                </View>
                {renderShips()}
            </View>
        </View>
    );
};

export default Battle;

const styles = StyleSheet.create({
    shipContainer: {
        flexDirection: "row",
        alignItems: "center",
        height: 74,
    },
    shipIdText: {
        fontSize: 9,
        position: "absolute",
        top: 12,
        left: 0,
        zIndex: 1,
    },
    shipImage: {
        width: 125,
        marginTop: 8,
    },
    smallHitIcon: {
        width: 30,
        height: 30,
    },
    flatListColor: {
        borderWidth: 1,
        borderColor: "orange",
    },
});
