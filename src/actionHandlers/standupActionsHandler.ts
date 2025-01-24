import { App,
    BlockAction,
    AllMiddlewareArgs,
    SlackActionMiddlewareArgs,
  } from '@slack/bolt';
import { WebClient, Block, KnownBlock, ConversationsSelect } from "@slack/web-api";
import { filterStandups } from '../functions/filterStandups';
import { getStats } from "../functions/getStats";
import { createStandupsDashboard, updateStatsOverview, updateTeamResponses } from '../views/standup_view';

  
  type FilterArgs = SlackActionMiddlewareArgs<BlockAction> & AllMiddlewareArgs;



  
//   export const filterByUser = async ({ ack, action, body, client }: FilterArgs) => {
//     await ack();
  
//     const userId = (action as any).selected_user; // Type assertion 
//     // const teamId = body.team?.id || ''; // Safely get team ID
//     const channelId = body.channel?.id || ''; 
    
//     const filteredResponses = await filterStandups({ memberId: userId });
//     const stats = await getStats(channelId);
  
//     await client.views.update({
//       view_id: body.view?.id || "",
//       view: {
//         type: "home",
//         blocks: await createStandupsDashboard(stats, filteredResponses),
//       },
//     });
//   };
  
  
//   export const filterByDate = async ({ ack, body, client }: FilterArgs) => {
//     await ack();
  
//     const stateValues = body.view?.state?.values || {};
//     // const teamId = body.team?.id || ''; // Safely get team ID
//     const channelId = body.channel?.id || ''; 
//     console.log("body.channel?.id ", body.channel?.id )
  
//     const filters = {
//         date: stateValues.date_filter?.date?.selected_date ?? undefined,
//         memberId: typeof stateValues.user_filter?.selected_user === "string"
//           ? stateValues.user_filter?.selected_user
//           : undefined,
//         teamId: typeof stateValues.channel_filter?.selected_channel === "string"
//           ? stateValues.channel_filter?.selected_channel
//           : undefined,
//     };
  
//     const filteredResponses = await filterStandups(filters);
//     const stats = await getStats(channelId);
  
//     await client.views.update({
//       view_id: body.view?.id || "",
//       view: {
//         type: "home",
//         blocks: await createStandupsDashboard(stats, filteredResponses),
//       },
//     });
//   };
  
//   export const filterByChannel = async ({ ack, body, client }: FilterArgs) => {
//     await ack();
  
//     // const channelId = (body.actions?.[0] as any)?.selected_channel; 
//     // const teamId = channelId || body.team?.id || '';
//     // Extract the channelId from the body
//     const channelId = (body.actions?.[0] as any)?.selected_conversation; // Safely access the selected conversation

//   if (!channelId) {
//     console.error("No channel ID found in the conversations_select action.");
//     return;
//   }

  
//     const filteredResponses = await filterStandups({ teamId: channelId });
//     const stats = await getStats(channelId);

  
//     await client.views.update({
//       view_id: body.view?.id || "",
//       view: {
//         type: "home",
//         blocks: await createStandupsDashboard(stats, filteredResponses) ,
//       },
//     });
  
//     console.log(`Filtered standups for channel ID: ${channelId}`);
//   };




  
export const applyFilters = async ({ ack, body, client }: FilterArgs) => {
  await ack();

  const stateValues = body.view?.state?.values || {};
  console.log("body.view?.state?.values: ", stateValues);

  // Extract filters from the nested state values dynamically
  let channelId, date, memberId;

  for (const blockId in stateValues) {
    const block = stateValues[blockId];
    if (block['filter_by_channel']?.type === 'conversations_select') {
      channelId = block['filter_by_channel'].selected_conversation;
      if(channelId == 'G12345678'){
        channelId = undefined;
      }
    }
    if (block['filter_by_date']?.type === 'datepicker') {
      date = block['filter_by_date'].selected_date;
    }
    if (block['filter_by_user']?.type === 'users_select') {
      memberId = block['filter_by_user'].selected_user;
      if(memberId == 'U12345678'){
        memberId = undefined;
      }
    }
  }

  const filters = {
    date: date || undefined,
    memberId: memberId || undefined,
    teamId: channelId || undefined, // Use the retrieved channelId
  };

  console.log("Filters: ", filters);

  const filteredResponses = await filterStandups(filters);
  const filteredResponsesBlocks = await updateTeamResponses(filteredResponses);
  const stats = await getStats(channelId);
  const statsBlocks = updateStatsOverview(stats);

  await client.views.update({
    view_id: body.view?.id || "",
    view: {
      type: "home",

      blocks: await createStandupsDashboard(statsBlocks, filteredResponsesBlocks),
    },
  });
};





