import React from "react";
import { Button, Navbar } from "@blueprintjs/core";
import LoginDialog from "./auth/LoginDialog";
import RegisterDialog from "./auth/RegisterDialog";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectUser, logout } from "./auth/authSlice";

const AppNavbar: React.FC = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const [mode, setMode] = React.useState<"login" | "register" | null>(null);
  return (
    <>
      <Navbar>
        <Navbar.Group align="left">
          <Navbar.Heading>Test</Navbar.Heading>
        </Navbar.Group>
        <Navbar.Group align="right">
          {user ? (
            <>
              <h3>Logged: {user.username}</h3>
              <Navbar.Divider />
              <Button intent="primary" large onClick={() => dispatch(logout())}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button intent="primary" large onClick={() => setMode("login")}>
                Login
              </Button>
              <Navbar.Divider />
              <Button
                intent="primary"
                large
                onClick={() => setMode("register")}
              >
                Sign up
              </Button>
            </>
          )}
        </Navbar.Group>
      </Navbar>
      {mode === "login" && <LoginDialog onClose={() => setMode(null)} />}
      {mode === "register" && <RegisterDialog onClose={() => setMode(null)} />}
    </>
  );
};

export default AppNavbar;
