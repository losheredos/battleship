import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { createBattleLayout } from "@screens/battle/logic.ts";
import Battle from "@screens/battle";

function App() {
    createBattleLayout();
    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <Battle />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
export default App;
