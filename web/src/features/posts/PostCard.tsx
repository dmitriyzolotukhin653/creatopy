import React from "react";
import {
  Button,
  Card,
  FormGroup,
  InputGroup,
  Callout,
} from "@blueprintjs/core";
import { useFormik } from "formik";
import { gql, useMutation } from "@apollo/client";
import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../auth/authSlice";

interface PostCardProps {
  mode?: "add" | "edit" | "view";
  post?: any;
  onChange?: () => void;
}

const CREATE_POST = gql`
  mutation createPost($title: String!) {
    createPost(input: { title: $title }) {
      title
    }
  }
`;

const UPDATE_POST = gql`
  mutation updatePost($id: ID!, $title: String!) {
    updatePost(input: { id: $id, title: $title }) {
      title
    }
  }
`;

const DELETE_POST = gql`
  mutation deletePost($id: ID!) {
    deletePost(input: { id: $id })
  }
`;

const PostCard: React.FC<PostCardProps> = ({ mode, post, onChange }) => {
  const user = useAppSelector(selectUser);
  const [createPost, createOp] = useMutation(CREATE_POST);
  const [updatePost, updateOp] = useMutation(UPDATE_POST);
  const [deletePost] = useMutation(DELETE_POST);
  const [data, error, loading] = [
    mode !== "add" ? createOp.data : updateOp.data,
    mode !== "add" ? createOp.error : updateOp.error,
    mode !== "add" ? createOp.loading : updateOp.loading,
  ];
  const [cardMode, setCardMode] = React.useState(mode);
  const { values, handleChange, handleSubmit, errors, isValid } = useFormik({
    initialValues: {
      title: mode !== "add" ? post.title : "",
    },
    async onSubmit(values) {
      console.log("submitting", values);
      console.log("cardMode", cardMode);
      if (cardMode === "add") {
        await createPost({ variables: { title: values.title } });
      } else {
        await updatePost({ variables: { id: post.id, title: values.title } });
      }
      onChange && (await onChange());
    },
  });
  return (
    <Card>
      {cardMode === "add" && <h3>Add new post:</h3>}
      {error && (
        <>
          <Callout intent="danger">{String(error)}</Callout>
          <br />
        </>
      )}
      {cardMode === "view" ? (
        <>
          {/*<p>Created at: {post.createdAt}</p>*/}
          <p>{post?.title}</p>
        </>
      ) : (
        <FormGroup
          intent="danger"
          helperText={errors.title}
          label="Title"
          labelFor="title"
          disabled={loading}
        >
          <InputGroup
            id="title"
            intent={errors.title ? "danger" : "none"}
            name="title"
            value={values.title}
            onChange={handleChange}
          />
        </FormGroup>
      )}
      <Button
        intent="primary"
        onClick={async () => {
          switch (cardMode) {
            case "add":
            case "edit": {
              handleSubmit();
              //setCardMode("view");
              onChange && (await onChange());
              break;
            }
            case "view": {
              setCardMode("edit");
              break;
            }
          }
        }}
        disabled={loading || !isValid || !user}
        loading={loading}
      >
        {cardMode === "add" ? "Add" : "Edit"}
      </Button>{" "}
      {cardMode === "edit" && (
        <>
          <Button onClick={() => setCardMode("view")}>Close</Button>{" "}
        </>
      )}
      {cardMode !== "add" && (
        <Button
          intent="danger"
          disabled={loading || !user}
          loading={loading}
          onClick={async () => {
            await deletePost({ variables: { id: post.id } });
            onChange && onChange();
          }}
        >
          Delete
        </Button>
      )}
    </Card>
  );
};

PostCard.defaultProps = {
  mode: "view",
};

export default PostCard;
