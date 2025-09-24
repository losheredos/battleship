import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Battle from "@screens/battle";

function App() {
    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <Battle />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
export default App;
