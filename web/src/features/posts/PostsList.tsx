import { gql, useQuery } from "@apollo/client";
import React from "react";
import { Button, Callout, Spinner } from "@blueprintjs/core";
import PostCard from "./PostCard";
import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../auth/authSlice";

const POSTS = gql`
  query posts {
    posts {
      id
      title
    }
  }
`;

const PostLists: React.FC = () => {
  const { loading, error, data, refetch } = useQuery(POSTS);
  const [show, setShow] = React.useState(false);
  const user = useAppSelector(selectUser);
  if (error) {
    return <Callout intent="danger">{String(error)}</Callout>;
  }
  if (loading) {
    return <Spinner />;
  }
  return (
    <>
      {show && <PostCard mode="add" onChange={async () => await refetch()} />}
      <br />
      <Button icon="plus" disabled={!user} onClick={() => setShow(!show)}>
        {!show ? "Add new" : "Close"}
      </Button>
      {data.posts?.map((post: any) => (
        <>
          <br />
          <PostCard post={post} onChange={async () => await refetch()} />
          <br />
        </>
      ))}
    </>
  );
};

export default PostLists;
