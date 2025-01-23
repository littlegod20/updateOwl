import { App } from "@slack/bolt";
import { publishAnalyticsView } from "../views/analytics_view";


export const viewAnalytics_action = (app:App) => {

    app.action("see_analytics", async ({ ack, client, body }) => {
        console.log("Viewing Standups");
        await ack(); // Acknowledge the action
      
        try{
      
          await publishAnalyticsView(client, body.user.id);
          
          console.log("✅ Updated App Home with analytics data");
        }catch (error) {
      
          console.error("❌ Error Fetching Analytics View: ", error);
      
        }
      });
}