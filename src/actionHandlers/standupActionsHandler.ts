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

 
  export const filterStatsByChannel = async ({ ack, body, client }: FilterArgs) => {
    await ack();

    const stateValues = body.view?.state?.values || {};
    let channelId, date;

    console.log("body.view?.state?.values: ", stateValues);

    for (const blockId in stateValues) {
      const block = stateValues[blockId];
        if (block['actionId-0']?.type === 'conversations_select') {
          channelId = block['actionId-0'].selected_conversation;
          if(channelId == 'G12345678'){
            channelId = undefined;
          }
          if (!channelId) {
            channelId = undefined;
            console.error("No channel ID found in the conversations_select action for stats.");
            return;
          }
        }
        if (block['actionId-1']?.type === 'datepicker') {
          date = block['actionId-1'].selected_date;
          if (!date) {
            date = undefined;
            console.error("No date  found in the selected_date action for stats.");
            return;
          }
        }
    }

    let filteredResponsesBlocks;
    // console.log("privateMetadata in body.view", body.view?.private_metadata);
    const privateMetadata = JSON.parse(body.view?.private_metadata || "{}");

    console.log("privateMetadata", privateMetadata);
    console.log("ChannelId in stat filter", channelId);
    // const filteredResponses = await filterStandups({ teamId: channelId });
    if(privateMetadata.filteredResponses){
       filteredResponsesBlocks = await updateTeamResponses(privateMetadata.filteredResponses);
    }
    else{
       filteredResponsesBlocks = await updateTeamResponses(undefined);
    }

    const stats = await getStats(channelId, date);
    console.log("Stats in ChannelStatsFilter ", stats);
    const statsBlocks = updateStatsOverview(stats);



  
    await client.views.update({
      view_id: body.view?.id || "",
      view: {
        type: "home",
        private_metadata: JSON.stringify({ statsData: stats, filteredResponses: privateMetadata.filteredResponses}),
        blocks: await createStandupsDashboard(statsBlocks, filteredResponsesBlocks) ,
      },
    });
  
    console.log(`Filtered standups for channel ID: ${channelId}`);
  };




  
export const applyFilters = async ({ ack, body, client }: FilterArgs) => {
  await ack();

  const stateValues = body.view?.state?.values || {};
  // console.log("body.view?.state?.values: ", stateValues);
  console.log("privateMetadata in body.view in apply Filters", body.view?.private_metadata);
  const privateMetadata = JSON.parse(body.view?.private_metadata || "{}");

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
  let statsBlocks;

  if(privateMetadata.statsData){
    statsBlocks = updateStatsOverview(privateMetadata.statsData);
  }
  else{
    statsBlocks = updateStatsOverview(undefined);
  }

  const filteredResponses = await filterStandups(filters);
  const filteredResponsesBlocks = await updateTeamResponses(filteredResponses);

  await client.views.update({
    view_id: body.view?.id || "",
    view: {
      type: "home",
      private_metadata: JSON.stringify({statsData: privateMetadata.statsData, filteredResponses: filteredResponses }),
      blocks: await createStandupsDashboard(statsBlocks, filteredResponsesBlocks),
    },
  });
};





