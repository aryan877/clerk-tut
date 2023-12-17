import React, { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import { Title, Box, ListItem, List, TextInput, Button } from "@mantine/core";
import { Post } from "@/types/Post";

function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState({ title: "", description: "" });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("/api/posts");
        setPosts(response.data.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPost((prev) => ({ ...prev, [name]: value }));
  };

  const handlePost = async () => {
    try {
      await axios.post("/api/posts", newPost);
      // Fetch the updated list of posts after posting
      const response = await axios.get("/api/posts");
      setPosts(response.data.data);
      // Clear the input fields
      setNewPost({ title: "", description: "" });
    } catch (error) {
      console.error("Error posting new post:", error);
    }
  };

  return (
    <Box p="md">
      <Title>Posts</Title>

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

      <Button onClick={handlePost} mt="md">
        Post
      </Button>

      <List>
        {posts.map((post) => (
          <ListItem key={post._id}>{post.title}</ListItem>
        ))}
      </List>
    </Box>
  );
}

export default Posts;
