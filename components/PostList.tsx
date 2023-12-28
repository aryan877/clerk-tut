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
  SimpleGrid,
  Text,
} from "@mantine/core";
import axios from "axios";
import React, { ChangeEvent, useEffect, useState } from "react";
import PostComponent from "@/components/Post";

function PostListComponent() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState({ title: "", description: "" });
  const [isPosting, setIsPosting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { organization } = useOrganization(); // Added switchOrganization
  const { user } = useUser();
  const userId = user?.id;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Fetch posts only if the organization ID is present
        if (organization?.id) {
          const response = await axios.get("/api/posts");
          setPosts(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
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
      if (organization?.id) {
        await axios.delete(`/api/posts?postid=${postId}`);
        const response = await axios.get("/api/posts");
        setPosts(response.data.data);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handlePost = async () => {
    try {
      setIsPosting(true);

      if (organization?.id) {
        await axios.post("/api/posts", newPost);
        const response = await axios.get("/api/posts");
        setPosts(response.data.data);
        setNewPost({ title: "", description: "" });
      }
    } catch (error) {
      console.error("Error posting new post:", error);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <Box p="md">
      {organization?.id ? (
        <>
          <Title order={2} mb="md">
            Posts from {organization.name}
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
            <Box my="md">
              <List spacing="md">
                {posts.length === 0 ? (
                  <p>No posts yet.</p>
                ) : (
                  <>
                    <Text>All Posts ({posts.length})</Text>
                    <SimpleGrid cols={3}>
                      {posts.map((post) => (
                        <PostComponent
                          key={post._id}
                          post={post}
                          onDelete={() => handleDelete(post._id)}
                          userId={userId}
                        />
                      ))}
                    </SimpleGrid>
                  </>
                )}
              </List>
            </Box>
          )}
        </>
      ) : (
        <Box ta="center" mt="5">
          <Title order={1}>
            Switch to an organization to create or view posts
          </Title>
          {/* <Button onClick={() => switchOrganization()}>
            Switch Organization
          </Button> */}
        </Box>
      )}
    </Box>
  );
}

export default PostListComponent;
