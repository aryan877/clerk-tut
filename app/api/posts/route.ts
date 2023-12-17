import { auth } from "@clerk/nextjs";
import dbConnect from "@/lib/dbConnect";
import Post from "@/model/Post";

/**
 * Handle GET requests to /api
 * @param {Request} request - The incoming GET request
 * @returns {Response} - The response containing the list of posts
 */
export async function GET(request: Request) {
  // Connect to the database
  await dbConnect();

  // Get the user ID from the authenticated session
  const { userId }: { userId: string | null } = auth();
  console.log(userId);

  try {
    // Fetch all posts from the database
    const posts = await Post.find({});

    // Return a successful response with the list of posts
    return Response.json({ success: true, data: posts }, { status: 200 });
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

  // Get the user ID from the authenticated session
  const { userId }: { userId: string | null } = auth();
  console.log(userId);

  try {
    // Create a new post using the request's JSON data
    const post = await Post.create(await request.json());

    // Return a successful response with the created post
    return Response.json({ success: true, data: post }, { status: 201 });
  } catch (error) {
    // Return an error response if creating a post fails
    return Response.json({ success: false }, { status: 400 });
  }
}
