// Post.tsx
import React, { useState } from "react";
import { Button, Card, Title, Group, Text } from "@mantine/core";
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
    <Card
      key={post._id}
      padding="md"
      radius="md"
      mt="md"
      bg="#ffeb3b"
      style={{
        border: "2px solid #ffeb3b",
        color: "#212121",
      }}
    >
      <Title order={2} mb="md">
        {post.title}
      </Title>
      <Text>{post.description}</Text>
      <Text>
        Posted by {post?.user?.firstName} {post?.user?.lastName} on{" "}
        {dayjs(post.createdAt).format("MMMM D, YYYY [at] h:mm A")}
      </Text>
      {userId === post.userId && (
        <Group right={10} top={5}>
          <Button
            mt='md'
            variant="outline"
            color="red"
            onClick={handleDelete}
            loading={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </Group>
      )}
    </Card>
  );
};

export default PostComponent;
