import React from "react";
import {
  Button,
  Callout,
  Classes,
  Dialog,
  FormGroup,
  InputGroup,
} from "@blueprintjs/core";
import { useFormik } from "formik";
import * as Yup from "yup";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { useAppDispatch } from "../../app/hooks";
import { success } from "./authSlice";

interface LoginDialogProps {
  onClose: () => void;
}

const LOGIN = gql`
  query login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      username
      createdAt
      token
    }
  }
`;

const RESET_PASSWORD = gql`
  mutation resetPassword($username: String!, $password: String!) {
    resetPassword(input: { username: $username, newPassword: $password })
  }
`;

const LoginSchema = Yup.object().shape({
  login: Yup.string().required(),
  password: Yup.string().required(),
});

const LoginDialog: React.FC<LoginDialogProps> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const [mode, setMode] = React.useState<"login" | "reset">("login");
  const [resetPassword, resetPasswordOp] = useMutation(RESET_PASSWORD, {
    onCompleted() {
      setMode("login");
    },
  });
  const [login, loginOp] = useLazyQuery(LOGIN, {
    onCompleted(data) {
      console.log("login data", data);
      localStorage.setItem("token", data.login.token);
      dispatch(success(data.login));
      onClose();
    },
  });
  const [error, loading] = [
    mode === "reset" ? resetPasswordOp.error : loginOp.error,
    mode === "reset" ? resetPasswordOp.loading : loginOp.loading,
  ];
  const { values, handleChange, errors, handleSubmit, isValid } = useFormik({
    initialValues: {
      login: "",
      password: "",
      passwordConfirm: "",
    },
    validationSchema: LoginSchema,
    async onSubmit(values) {
      console.log("submitting", values);
      if (mode === "login") {
        login({
          variables: {
            username: values.login,
            password: values.password,
          },
        });
      } else {
        await resetPassword({
          variables: {
            username: values.login,
            password: values.password,
          },
        });
      }
    },
  });
  return (
    <Dialog
      isOpen
      canEscapeKeyClose
      canOutsideClickClose
      onClose={onClose}
      title={mode === "login" ? "Login" : "Reset password"}
    >
      <form className={Classes.DIALOG_BODY}>
        {error && (
          <>
            <Callout intent="danger">{String(error)}</Callout>
            <br />
          </>
        )}
        <FormGroup
          helperText={errors.login}
          label="Login"
          intent="danger"
          labelFor="login"
          disabled={loading}
        >
          <InputGroup
            id="login"
            name="login"
            onChange={handleChange}
            value={values.login}
            intent={errors.login ? "danger" : "none"}
          />
        </FormGroup>
        <FormGroup
          helperText={errors.password}
          intent="danger"
          label="Password"
          labelFor="password"
          disabled={loading}
        >
          <InputGroup
            id="password"
            type="password"
            name="password"
            onChange={handleChange}
            value={values.password}
            intent={errors.password ? "danger" : "none"}
          />
        </FormGroup>
        {mode === "login" && (
          <p>
            <a href="#" onClick={() => setMode("reset")}>
              Reset password
            </a>
          </p>
        )}
        <Button
          intent="primary"
          onClick={() => handleSubmit()}
          disabled={loading || !isValid}
          loading={loading}
        >
          {mode === "login" ? "Log in" : "Reset"}
        </Button>
      </form>
    </Dialog>
  );
};

export default LoginDialog;
