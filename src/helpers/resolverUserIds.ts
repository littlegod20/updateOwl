import { WebClient } from "@slack/web-api";

export const resolveUserIds = async (
  inputs: string[],
  client: WebClient
): Promise<string[]> => {
  const userIds: string[] = [];

  // console.log(
  //   "INputs:",
  //   inputs.map((item) => item)
  // );

  // console.log("AllUsers:", await client.users.list({}));
  for (const input of inputs) {
    try {
      // If not found by email, fetch all users and filter by display name
      const allUsers = await client.users.list({});
      const matchedUser = allUsers.members?.find(
        (user) =>
          user.profile?.real_name?.toLowerCase() === input.toLowerCase() ||
          user.name?.toLowerCase() === input.toLowerCase()
      );
      if (matchedUser?.id) {
        userIds.push(matchedUser.id);
      } else {
        console.warn(`No user found for input: ${input}`);
      }
    } catch (error) {
      console.error(`Error resolving user ID for "${input}":`, error);
    }
  }

  return userIds;
};
