import { Post } from "@/model/Post";
import { useOrganization } from "@clerk/nextjs";
import { Box, Button, Card, List, TextInput, Title } from "@mantine/core";
import axios from "axios";
import dayjs from "dayjs";
import React, { ChangeEvent, useEffect, useState } from "react";

function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState({ title: "", description: "" });
  const [isPosting, setIsPosting] = useState(false);
  const { organization } = useOrganization();

useEffect(() => {
  const fetchPosts = async () => {
    try {
      if (!organization?.id) {
        // Organization ID is not available, skip fetching posts
        return;
      }

      const response = await axios.get("/api/posts");
      setPosts(response.data.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  fetchPosts();
}, [organization?.id]);


  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPost((prev) => ({ ...prev, [name]: value }));
  };

  const handlePost = async () => {
    try {
      setIsPosting(true);

      await axios.post("/api/posts", newPost);

      // Fetch the updated list of posts after posting
      const response = await axios.get("/api/posts");
      setPosts(response.data.data);

      // Clear the input fields
      setNewPost({ title: "", description: "" });
    } catch (error) {
      console.error("Error posting new post:", error);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <Box p="md">
      <Title order={1} mb="md">
        Posts from {organization?.name}
      </Title>

      <Card shadow="sm" padding="md" radius="md">
        <TextInput
          placeholder="Title"
          label="Title"
          value={newPost.title}
          onChange={handleInputChange}
          name="title"
          required
          maxLength={40}
        />

        <TextInput
          mt="md"
          placeholder="Description"
          label="Description"
          value={newPost.description}
          onChange={handleInputChange}
          name="description"
          required
          maxLength={200}
        />

        <Button onClick={handlePost} mt="md" loading={isPosting}>
          {isPosting ? "Posting..." : "Post"}
        </Button>
      </Card>

      <List spacing="md">
        {posts.map((post) => (
          <Card key={post._id} p="md" radius="md" mt="md">
            <Title order={2}>{post.title}</Title>
            <p>{post.description}</p>
            <p>
              Posted by {post?.user?.firstName} {post?.user?.lastName} on{" "}
              {dayjs(post.createdAt).format("MMMM D, YYYY [at] h:mm A")}
            </p>
          </Card>
        ))}
      </List>
    </Box>
  );
}

export default Posts;
