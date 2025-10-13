import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { MantineProvider } from "@mantine/core"; 

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container as HTMLElement);

root.render(
  <Router>
    <MantineProvider> 
      <App />
    </MantineProvider>
  </Router>
);
