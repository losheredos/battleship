import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { createBattleLayout } from "@screens/battle/logic.ts";

function App() {
    createBattleLayout();
    return (
        <SafeAreaProvider>
            <SafeAreaView></SafeAreaView>
        </SafeAreaProvider>
    );
}
export default App;
