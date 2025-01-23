import { WebClient, Block, KnownBlock } from "@slack/web-api";


interface AnalyticsStats {
    totalTeams: number;
    totalUsers: number;
    averageResponseRate: number;
    totalBlockersReported: number;
    topPerformingTeams: { teamName: string; responseRate: number }[];
    lowPerformingTeams: { teamName: string; responseRate: number }[];
    frequentBlockers: { userName: string; blockerCount: number }[];
    responseTrends: { date: string; responseRate: number }[];
}
  
interface TeamReport {
teamName: string;
participationRate: number;
totalBlockers: number;
averageResponseTime: string;
keyInsights: string;
}

interface StandupAnalyticsData {
stats: AnalyticsStats;
teamReports: TeamReport[];
}
  

export const publishAnalyticsView = async (client: WebClient, user_id: string) => {
    try {
        const dummyAnalyticsData: StandupAnalyticsData = {
            stats: {
              totalTeams: 5,
              totalUsers: 50,
              averageResponseRate: 80,
              totalBlockersReported: 15,
              topPerformingTeams: [
                { teamName: "Team Alpha", responseRate: 95 },
                { teamName: "Team Beta", responseRate: 90 },
              ],
              lowPerformingTeams: [
                { teamName: "Team Gamma", responseRate: 60 },
                { teamName: "Team Delta", responseRate: 55 },
              ],
              frequentBlockers: [
                { userName: "Alice", blockerCount: 5 },
                { userName: "Bob", blockerCount: 3 },
                { userName: "Charlie", blockerCount: 2 },
              ],
              responseTrends: [
                { date: "2025-01-01", responseRate: 78 },
                { date: "2025-01-02", responseRate: 80 },
                { date: "2025-01-03", responseRate: 85 },
                { date: "2025-01-04", responseRate: 83 },
              ],
            },
            teamReports: [
              {
                teamName: "Team Alpha",
                participationRate: 95,
                totalBlockers: 2,
                averageResponseTime: "45m",
                keyInsights: "Excellent participation rate. Few blockers reported.",
              },
              {
                teamName: "Team Beta",
                participationRate: 90,
                totalBlockers: 3,
                averageResponseTime: "1h 5m",
                keyInsights: "Good participation rate. Monitor blockers.",
              },
              {
                teamName: "Team Gamma",
                participationRate: 60,
                totalBlockers: 4,
                averageResponseTime: "2h",
                keyInsights: "Participation needs improvement. Blockers are high.",
              },
              {
                teamName: "Team Delta",
                participationRate: 55,
                totalBlockers: 5,
                averageResponseTime: "2h 30m",
                keyInsights: "Critical issues with participation and blockers.",
              },
              {
                teamName: "Team Epsilon",
                participationRate: 70,
                totalBlockers: 1,
                averageResponseTime: "1h 30m",
                keyInsights: "Decent participation, minimal blockers.",
              },
            ],
          };
          
          
          
        

        // Update the App Home with standup data
        await client.views.publish({
            user_id: user_id,  // Corrected from user_id to user
            view: {
            type: "home",
            blocks: createAnalyticsDashboard(dummyAnalyticsData)
            },
        });  // Added the closing parenthesis here
  
      console.log("✅ Analytics View published successfully!");
    } catch (error) {
      console.error("❌ Error publishing Analytics View:", error);
    }
  };


  
  export const createAnalyticsDashboard = (
    data: StandupAnalyticsData
  ): (Block | KnownBlock)[] => {
    const { stats, teamReports } = data;

    return [
       {
        type: "actions",
        elements: [
            {
            type: "button",
            text: {
                type: "plain_text",
                text: "Go Back",
                emoji: true,
            },
            action_id: "go_back",
            },
        ],
        },
      // Header Section
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "📊 Analytics Dashboard",
          emoji: true
        }
      },
      // Stats Overview Section
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Total Teams*\n${stats.totalTeams}`
          },
          {
            type: "mrkdwn",
            text: `*Total Users*\n${stats.totalUsers}`
          },
          {
            type: "mrkdwn",
            text: `*Average Response Rate*\n${stats.averageResponseRate}%`
          },
          {
            type: "mrkdwn",
            text: `*Total Blockers Reported*\n${stats.totalBlockersReported}`
          }
        ]
      },
      {
        type: "divider"
      },
        // Response Trends Chart
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text: "*📈 Response Trends*"
            }
            },
        //   {
        //     type: "image",
        //     image_url: `https://your-chart-service.com/generate-trend-chart?data=${encodeURIComponent(
        //       JSON.stringify(stats.responseTrends)
        //     )}`,
        //     alt_text: "Response Trends Chart"
        //   },
            {
            type: "divider"
            },
      // Top Performing Teams Section
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*🌟 Top Performing Teams*"
        }
      },
      ...stats.topPerformingTeams.map((team) => ({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${team.teamName}*\nResponse Rate: ${team.responseRate}%`
        }
      })),
      {
        type: "divider"
      },
      // Low Performing Teams Section
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*⚠️ Low Performing Teams*"
        }
      },
      ...stats.lowPerformingTeams.map((team) => ({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${team.teamName}*\nResponse Rate: ${team.responseRate}%`
        }
      })),
      {
        type: "divider"
      },
      
      // Frequent Blockers Section
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*🚧 Frequent Blockers*"
        }
      },
      ...stats.frequentBlockers.map((blocker) => ({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${blocker.userName}*\nBlockers Reported: ${blocker.blockerCount}`
        }
      })),
      {
        type: "divider"
      },
      // Team Reports
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*📋 Team Performance Reports*"
        }
      },
      ...teamReports.flatMap((report) => [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Team:* ${report.teamName}\n*Participation Rate:* ${report.participationRate}%\n*Blockers Reported:* ${report.totalBlockers}\n*Avg Response Time:* ${report.averageResponseTime}\n*Key Insights:* ${report.keyInsights}`
          },
          accessory: {
            type: "button",
            text: {
              type: "plain_text",
              text: "View Details",
              emoji: true
            },
            action_id: `view_details_${report.teamName}`
          }
        },
        {
          type: "divider"
        }
      ]),
      // Generate Report Button
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*📤 Generate Full Report*"
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: "Generate PDF",
            emoji: true
          },
          style: "primary",
          action_id: "generate_full_report"
        }
      },
      {
        type: "divider"
      },
      // Export and Filter Controls
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Export Analytics",
              emoji: true
            },
            style: "primary",
            action_id: "export_analytics"
          },
        //   {
        //     type: "button",
        //     text: {
        //       type: "plain_text",
        //       text: "Apply Filters",
        //       emoji: true
        //     },
        //     action_id: "apply_filters"
        //   }
        ]
      }
    ];
  };