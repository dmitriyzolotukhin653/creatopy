import React from "react";
import AppNavbar from "./features/AppNavbar";
import PostLists from "./features/posts/PostsList";
import classes from "./App.module.css";

function App() {
  return (
    <div className="App">
      <AppNavbar />
      <div className={classes.layout}>
        <PostLists />
      </div>
    </div>
  );
}

export default App;
