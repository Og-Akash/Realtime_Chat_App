import { Toaster } from "react-hot-toast";
import { Approuter } from "./router/AppRouter";
import { useThemeStore } from "./store/useThemeStore";

function App() {
  const { theme } = useThemeStore();
  return (
    <div className="bg-base-100 min-w-screen min-h-screen h-full" data-theme={theme}>
      <Approuter />
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
