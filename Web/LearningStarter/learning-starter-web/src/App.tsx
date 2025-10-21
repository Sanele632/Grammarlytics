import { Routes } from "./routes/config";
import { AuthProvider } from "./authentication/use-auth";
import {
  MantineProvider,
  Container,
  createTheme,
  useMantineColorScheme,
} from "@mantine/core";
import { MantineEmotionProvider, Global } from "@mantine/emotion";
import { Notifications } from "@mantine/notifications";
import "@mantine/core/styles.css";


const theme = createTheme({
  colors: {
    purple: [
      "#f5e9fa",
      "#ebd3f5",
      "#d9aef0",
      "#c58be8",
      "#ae64df",
      "#9440d6",
      "#702790",
      "#5a1f73",
      "#451757",
      "#2f0f3a",
    ],
  },
  primaryColor: "purple",
});

function GlobalBackground() {
  const { colorScheme } = useMantineColorScheme(); 
  const isDark = colorScheme === "dark";

  return (
    <Global
      styles={{
        body: {
          backgroundColor: isDark ? "#2f0f3a" : "#f5e9fa", 
          color: isDark ? "#f5e9fa" : "#2f0f3a",
          margin: 0,
          padding: 0,
          minHeight: "100vh",
          transition: "background-color 0.3s ease, color 0.3s ease",
        },
      }}
    />
  );
}

function App() {

  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <MantineEmotionProvider>
        <GlobalBackground />
        <Notifications position="top-right" autoClose={3000} limit={5} />
        <Container fluid px={0} className="App">
          <AuthProvider>
            <Routes />
          </AuthProvider>
        </Container>
      </MantineEmotionProvider>
    </MantineProvider>
  );
}

export default App;