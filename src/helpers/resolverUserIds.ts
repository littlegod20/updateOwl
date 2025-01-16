import { WebClient } from "@slack/web-api";

export const resolveUserIds = async (
  inputs: string[],
  client: WebClient
): Promise<string[]> => {
  const userIds: string[] = [];
  
  try {
    // Fetch all users
    const allUsers = await client.users.list({});
    if (!allUsers.members) {
      console.warn("No members found in the users list.");
      return [];
    }

    // Iterate through the input strings and find matching users
    for (const input of inputs) {
      const matchedUser = allUsers.members.find(
        (user) =>
          user.id === input || // Check if input matches user ID
          user.name?.toLowerCase() === input.toLowerCase() || // Check if input matches username
          user.profile?.real_name?.toLowerCase() === input.toLowerCase() // Check if input matches real name
      );

      if (matchedUser?.id) {
        userIds.push(matchedUser.id);
      } else {
        console.warn(`No user found for input: "${input}"`);
      }
    }
  } catch (error) {
    console.error("Error fetching users from Slack API:", error);
  }

  return userIds;
};
