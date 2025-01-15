import { App } from "@slack/bolt";
import { publishHomeView } from "../views/home_view";
import { publishManageTeamsView } from "../views/manageTeams_view";



export const goBack_action = (app: App) => {

    
    app.action("go_back", async ({ ack, client, body }) => {
    await ack(); // Acknowledge the action
  
    try{    
      // Fetch user info to personalize the greeting
      const userInfo = await client.users.info({ user: body.user.id });
      const userName = userInfo.user?.real_name || "there";
      
      // Re-publish the default App Home view
      await publishHomeView(client, userName, body.user.id)
      
      console.log("✅ Reset App Home to default view");
    }catch (error) {
        
        console.error("❌ Error Going Back To App Home:", error);
        
    }
});
}



export const goBackToManageTeams_action = (app:App) => {
    app.action("go_back_to_manage_teams_view", async ({ ack, client, body }) => {
        await ack(); // Acknowledge the action
      
        try{    
          // Fetch user info to personalize the greeting
          const userInfo = await client.users.info({ user: body.user.id });
          const userName = userInfo.user?.real_name || "there";
          
          // Re-publish the default Manage Teams view
          await publishManageTeamsView(client, body.user.id);
      
          
          console.log("✅ Reset App Home to Manage Teams view");
        }catch (error) {
      
          console.error("❌ Error Going Back To Manage Teams View:", error);
      
        }
      });
}