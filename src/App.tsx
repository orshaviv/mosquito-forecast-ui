import { Main } from "./components/main";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { styled } from "@mui/material/styles";

const queryClient = new QueryClient();

const AppComponent = styled("div")({
  p: 0,
  m: 0,
  height: "100vh",
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppComponent>
        <Main />
      </AppComponent>
    </QueryClientProvider>
  );
}

export default App;
