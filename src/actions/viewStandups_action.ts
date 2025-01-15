import { App } from "@slack/bolt";
import { publishStandupView } from "../views/standup_view";


export const viewStandups_action = (app:App) => {

    app.action("view_standups", async ({ ack, client, body }) => {
        console.log("Viewing Standups");
        await ack(); // Acknowledge the action
      
        try{
      
          await publishStandupView(client, body.user.id);
          
          console.log("✅ Updated App Home with standup data");
        }catch (error) {
      
          console.error("❌ Error Fetching Standup View: ", error);
      
        }
      });
}