import React from "react";
import "./App.css";
import { ThemeProvider } from "@mui/material";
import theme from "./theme/theme";
import { ToDoList } from "./components/ToDoList";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <div className='bg'>
        <ToDoList />
      </div>
    </ThemeProvider>
  );
};

export default App;
