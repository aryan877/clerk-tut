import dbConnect from "@/lib/dbConnect";
import Post from "@/model/Post";
import { auth } from "@clerk/nextjs";

export async function DELETE(request: Request) {
  // Connect to the database
  await dbConnect();

  // Get the user ID from the authenticated session
  const { userId } = auth();
  console.log("Authenticated User ID:", userId);

  try {
    // Extract postId from the request parameters
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("postid");

    // Find the post by its ID and user ID
    const postToDelete = await Post.findOne({ _id: id, userId });

    if (!postToDelete) {
      // If the post is not found, return a not found response
      return Response.json(
        {
          success: false,
          message: "Post not found",
        },
        { status: 404 }
      );
    }

    // Delete the post
    await postToDelete.deleteOne();

    // Return a successful response
    return Response.json(
      {
        success: true,
        message: "Post deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting post:", error);
    // Return an error response if deleting the post fails
    return Response.json(
      {
        success: false,
        message: "Error deleting post",
      },
      { status: 500 }
    );
  }
}
