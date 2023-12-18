// Post.tsx
import React, { useState } from "react";
import { Button, Card, Title } from "@mantine/core";
import dayjs from "dayjs";
import { Post } from "@/model/Post";

interface PostProps {
  post: Post;
  onDelete: () => Promise<void>; 
  userId?: string | null;
}

const PostComponent: React.FC<PostProps> = ({ post, onDelete, userId }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card key={post._id} p="md" radius="md" mt="md">
      <Title order={2}>{post.title}</Title>
      <p>{post.description}</p>
      <p>
        Posted by {post?.user?.firstName} {post?.user?.lastName} on{" "}
        {dayjs(post.createdAt).format("MMMM D, YYYY [at] h:mm A")}
      </p>
      {userId === post.userId && (
        <Button
          variant="outline"
          color="red"
          onClick={handleDelete}
          mt="md"
          loading={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      )}
    </Card>
  );
};

export default PostComponent;
