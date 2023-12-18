// PostList.tsx
import { Post } from "@/model/Post";
import { useOrganization, useUser } from "@clerk/nextjs";
import {
  Box,
  Button,
  Card,
  List,
  TextInput,
  Title,
  Loader,
} from "@mantine/core";
import axios from "axios";
import React, { ChangeEvent, useEffect, useState } from "react";
import PostComponent from "@/components/Post";

function PostListComponent() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState({ title: "", description: "" });
  const [isPosting, setIsPosting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { organization } = useOrganization();
  const { user } = useUser();
  const userId = user?.id;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("/api/posts");
        setPosts(response.data.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        // Set loading state to false when the data is fetched
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [organization?.id]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (postId: string) => {
    try {
      // Send a DELETE request to the API endpoint with the postId
      await axios.delete(`/api/delete_post?postid=${postId}`);
      // Fetch the updated list of posts after deleting
      const response = await axios.get("/api/posts");
      setPosts(response.data.data);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
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
        {organization?.id ? `Posts from ${organization.name}` : "Personal Wall"}
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

      {isLoading ? (
        <Loader size="md" my="md" />
      ) : (
        <List spacing="md">
          {posts.length === 0 ? (
            <p>No posts yet.</p>
          ) : (
            posts.map((post) => (
              <PostComponent
                key={post._id}
                post={post}
                onDelete={() => handleDelete(post._id)}
                userId={userId}
              />
            ))
          )}
        </List>
      )}
    </Box>
  );
}

export default PostListComponent;
