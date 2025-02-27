import { Toaster } from "react-hot-toast";
import { Approuter, } from "./router/AppRouter";

function App() {
  return (
    <>
      <Approuter />
      <Toaster position="top-right" />
    </>
  );
}

export default App;
