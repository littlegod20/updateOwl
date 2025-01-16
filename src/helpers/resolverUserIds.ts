import { WebClient } from "@slack/web-api";

export const resolveUserIds = async (
  inputs: string[],
  client: WebClient
): Promise<string[]> => {
  const userIds: string[] = [];
  let allUsers: any[] = [];
  let cursor: string | undefined;

  try {
    // Fetch all users (handle pagination)
    do {
      const response = await client.users.list({ cursor });
      allUsers = [...allUsers, ...(response.members || [])];
      cursor = response.response_metadata?.next_cursor;
    } while (cursor);

    console.log("All Users:", JSON.stringify(allUsers, null, 2));


    for (const input of inputs) {
      // Normalize input
      const normalizedInput = input.trim().toLowerCase();

      // Find matched user
      const matchedUser = allUsers.find(
        (user) =>
          user.profile?.real_name?.trim().toLowerCase() === normalizedInput ||
          user.profile?.display_name?.trim().toLowerCase() === normalizedInput ||
          user.name?.trim().toLowerCase() === normalizedInput
      );

      console.log("Matched User", matchedUser);
      if (matchedUser?.id) {
        userIds.push(matchedUser.id);
      } else {
        console.warn(`No user found for input: "${input}"`);
      }
    }
  } catch (error) {
    console.error("Error resolving user IDs:", error);
  }

  return userIds;
};

