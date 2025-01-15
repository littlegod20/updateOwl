import { App } from "@slack/bolt";
import { publishHomeView } from "../views/home_view";



export const appHome_event = (app:App) => {
    
    app.event("app_home_opened", async ({ event, client }) => {
        try {
          // Fetch user info to personalize the greeting
          const userInfo = await client.users.info({ user: event.user });
          const userName = userInfo.user?.real_name || "there";
      
          // Call the reusable function to publish the default App Home view
          await publishHomeView(client, userName, event.user);
      
          console.log("✅ App Home updated with dashboard view");
      
        } catch (error) {
      
          console.error("❌ Error updating App Home:", error);
      
        }
    });

}