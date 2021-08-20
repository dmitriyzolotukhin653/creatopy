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
import { useAppDispatch } from "../../app/hooks";
import { gql, useMutation } from "@apollo/client";

interface RegisterDialogProps {
  onClose: () => void;
}

const REGISTER = gql`
  mutation register($username: String!, $password: String!) {
    register(input: { username: $username, password: $password }) {
      id
      username
      createdAt
    }
  }
`;

const SignupSchema = Yup.object().shape({
  login: Yup.string().required(),
  password: Yup.string().required(),
  passwordConfirm: Yup.string()
    .oneOf([Yup.ref("password")], "Password does not match")
    .required("Required"),
});

const RegisterDialog: React.FC<RegisterDialogProps> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const [register, { error, loading }] = useMutation(REGISTER, {
    onCompleted(data) {
      console.log("register data", data);
      onClose();
    },
  });
  const { values, handleChange, errors, handleSubmit, isValid } = useFormik({
    initialValues: {
      login: "",
      password: "",
      passwordConfirm: "",
    },
    validationSchema: SignupSchema,
    async onSubmit(values) {
      console.log("submitting", values);
      await register({
        variables: {
          username: values.login,
          password: values.password,
        },
      });
    },
  });
  return (
    <Dialog
      isOpen
      canEscapeKeyClose
      canOutsideClickClose
      onClose={onClose}
      title="Register"
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
          intent="danger"
          label="Login"
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
            intent={errors.password ? "danger" : "none"}
            id="password"
            type="password"
            name="password"
            onChange={handleChange}
            value={values.password}
          />
        </FormGroup>
        <FormGroup
          helperText={errors.passwordConfirm}
          intent="danger"
          label="Confirm password"
          labelFor="password-confirm"
          disabled={loading}
        >
          <InputGroup
            intent={errors.passwordConfirm ? "danger" : "none"}
            id="password-confirm"
            type="password"
            name="passwordConfirm"
            onChange={handleChange}
            value={values.passwordConfirm}
          />
        </FormGroup>
        <Button
          intent="primary"
          onClick={() => handleSubmit()}
          disabled={loading || !isValid}
          loading={loading}
        >
          Sign up
        </Button>
      </form>
    </Dialog>
  );
};

export default RegisterDialog;
