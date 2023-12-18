import { auth, clerkClient } from "@clerk/nextjs";
import dbConnect from "@/lib/dbConnect";
import Post from "@/model/Post";

/**
 * Handle GET requests to /api
 * @param {Request} request - The incoming GET request
 * @returns {Response} - The response containing the list of posts with user information
 */
export async function GET(request: Request) {
  // Connect to the database
  await dbConnect();

  // Get the organization ID from the authenticated session
  const { orgId } = auth();
  console.log("Authenticated Organization ID:", orgId);

  try {
    if (orgId) {
      // Fetch posts with organizationId
      const posts = await Post.find({ organizationId: orgId })
        .sort({ createdAt: -1 })
        .exec();

      // Fetch user information for each post
      const postsWithUserInfo = await Promise.all(
        posts.map(async (post) => {
          // Fetch user information for each post
          const user = await clerkClient.users.getUser(post.userId);
          console.log(user.firstName, user.lastName);

          // Merge user information into the post object
          return {
            ...post.toObject(),
            user: { firstName: user.firstName, lastName: user.lastName },
          };
        })
      );

      // Return a successful response with the list of posts and user information
      return Response.json(
        { success: true, data: postsWithUserInfo },
        { status: 200 }
      );
    } else {
      // Return an error response if orgId is not present
      return Response.json(
        { success: false, message: "Organization ID not found" },
        { status: 400 }
      );
    }
  } catch (error) {
    // Return an error response if fetching posts fails
    return Response.json({ success: false }, { status: 400 });
  }
}

/**
 * Handle POST requests to /api
 * @param {Request} request - The incoming POST request
 * @returns {Response} - The response containing the created post
 */
export async function POST(request: Request) {
  // Connect to the database
  await dbConnect();

  // Get the organization ID from the authenticated session
  const { orgId, userId } = auth();
  console.log("Authenticated Organization ID:", orgId);

  try {
    if (orgId) {
      // Create a new post using the request's JSON data
      const postData = await request.json();

      console.log("Received Post Data:", postData);

      // Add organizationId, userId, and createdAt to the post data
      const postWithIdsAndDate = {
        ...postData,
        organizationId: orgId,
        userId: userId,
        createdAt: new Date(),
      };

      console.log("Post Data with IDs and Date:", postWithIdsAndDate);

      // Create a new post with organizationId, userId, and createdAt
      const post = await Post.create(postWithIdsAndDate);

      // Return a successful response with the created post
      return Response.json({ success: true, data: post }, { status: 201 });
    } else {
      // Return an error response if Ids is not present
      return Response.json(
        { success: false, message: "Organization ID not found" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error creating post:", error);
    // Return an error response if creating a post fails
    return Response.json({ success: false }, { status: 400 });
  }
}
