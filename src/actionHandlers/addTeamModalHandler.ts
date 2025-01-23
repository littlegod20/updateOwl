import { 
    App, 
    BlockAction, 
    ViewStateValue,
    AllMiddlewareArgs,
    SlackActionMiddlewareArgs,
    SlackViewMiddlewareArgs,
    ViewOutput,
} from '@slack/bolt';
import { addTeams } from "../functions/addTeams";
import { Block, View, ModalView, InputBlock, PlainTextInput, MultiStaticSelect,MultiUsersSelect, StaticSelect, SectionBlock } from '@slack/web-api';


interface Question {
  id: string;
  type: 'free_text' | 'multiple_choice' | 'rating' | 'boolean' | 'numbered_list' ;
  text: string;
  options?: string[];
  required: boolean;
}

interface StandupState {
  questions: Question[];
  currentView: View;
}

// Validation function
const validateQuestion = (question: Question): string | null => {
    if (!question.text) {
      return 'Question text is required';
    }
    
    switch (question.type) {
      case 'multiple_choice':
        // Check for multiple-choice question options
        if (!question.options || question.options.length < 2) {
            // errors["question_options_block"] = "Please provide options for the multiple-choice question.";
            return `${question.type === 'multiple_choice' ? 'Choices' : 'Rating scale'} must have at least 2 options`;
            // throw new Error("Multiple-choice options are missing");
        }
      case 'rating':
        if (!question.options || question.options.length < 2) {
          return `${question.type === 'multiple_choice' ? 'Choices' : 'Rating scale'} must have at least 2 options`;
        }
        break;
    }
    
    return null;
};


export const handleRemoveQuestion = async ({
    ack,
    body,
    action,
    client
  }: SlackActionMiddlewareArgs<BlockAction> & AllMiddlewareArgs) => {
    try {
      await ack();
      
      if (!body.view) {
        console.log('No view in body');
        return;
      }
  
      console.log('Action:', action);
      console.log('Current view:', body.view);
  
      const questionId =(action as { value: string }).value; // Use action.value instead of parsing action_id
      console.log('Removing question with ID:', questionId);
  
      const currentQuestions = getQuestionsFromView(body.view);
      console.log('Current questions:', currentQuestions);
  
      const updatedQuestions = currentQuestions.filter(q => q.id !== questionId);
      console.log('Updated questions:', updatedQuestions);

      // Parse private metadata to get questions
      const privateMetadata = JSON.parse(body.view.private_metadata || '{}');
      privateMetadata.questions = updatedQuestions;
      console.log("Private Meta Data after removing question", privateMetadata.questions);
  
      await updateAddedQuestionsSection(
        client,
        body.view.id,
        body.view,
        updatedQuestions,
        privateMetadata
      );
  
      console.log('Question removed successfully');
    } catch (error) {
      console.error('Error in handleRemoveQuestion:', error);
      throw error;
    }
  };

// Handler for question format selection
// export const handleQuestionFormatChange = async ({
//     ack,
//     body,
//     client,
//     // view
//   }: SlackActionMiddlewareArgs<BlockAction> & AllMiddlewareArgs) => {
//     await ack();
    
//     if (!body.view){
//         console.log("No Body.view provided")
//         return; 
//     } 
  
//     const selectedFormat = (body as any).actions[0].selected_option.value;
//     const blocks = body.view?.blocks;
    
//     // Find the options block index
//     const optionsBlockIndex = blocks.findIndex(
//       block => block.block_id === 'question_options_block'
//     );
    
//     // Update visibility and requirements of the options block
//     if (optionsBlockIndex !== -1) {
//       const optionsBlock = blocks[optionsBlockIndex] as any;
      
//       switch (selectedFormat) {
//         case 'multiple_choice':
//         case 'rating':
//           optionsBlock.optional = false;
//           optionsBlock.label.text = selectedFormat === 'multiple_choice' 
//             ? 'Enter choices (comma separated):'
//             : 'Enter rating scale (e.g., 1,2,3,4,5):';
//           break;
//         default:
//           optionsBlock.optional = true;
//           delete optionsBlock.element.initial_value;
//           break;
//       }
//     }
  
//     // Update the view
//     await client.views.update({
//       view_id: body.view.id,
//       view: body.view as any
//     });
//   };

  // Handler for question format selection
export const handleQuestionFormatChange = async ({
    ack,
    body,
    client,
  }: SlackActionMiddlewareArgs<BlockAction> & AllMiddlewareArgs) => {
    await ack();
    
    if (!body.view) {
        console.log("No Body.view provided")
        return; 
    }

    const selectedFormat = (body as any).actions[0].selected_option.value;
    const blocks = body.view?.blocks;
    
    // Find the options block index
    const optionsBlockIndex = blocks.findIndex(
      block => block.block_id === 'question_options_block'
    );
    
    // Update visibility and requirements of the options block
    if (optionsBlockIndex !== -1) {
      const optionsBlock = blocks[optionsBlockIndex] as any;
      
      switch (selectedFormat) {
        case 'multiple_choice':
        case 'rating':
          optionsBlock.optional = false;
          optionsBlock.label.text = selectedFormat === 'multiple_choice' 
            ? 'Enter choices (comma separated):'
            : 'Enter rating scale (e.g., 1,2,3,4,5):';
          break;
        default:
          optionsBlock.optional = true;
          delete optionsBlock.element.initial_value;
          break;
      }
    }
  
    // Update the view
    await client.views.update({
      view_id: body.view.id,
      view: body.view as any
    });
  };

  export const handleBackToAddTeam = async ({
    ack,
    body,
    client,
  }: SlackActionMiddlewareArgs<BlockAction> & AllMiddlewareArgs) => {
    await ack();
  
    // Parse private metadata to get the previous modal content
    const { previousView } = JSON.parse(body.view?.private_metadata || '{}');
  
    if (!previousView) {
      console.error('No previous view data found');
      return;
    }
  
    // Restore the original modal using `views.update`
    await client.views.update({
      view_id: body.view?.id || "",
      hash: body.view?.hash,
      view: previousView,
    });
  };
  



export const handleAddQuestion = async ({
    ack,
    body,
    client,
  }: SlackActionMiddlewareArgs<BlockAction> & AllMiddlewareArgs) => {
    await ack();
  
    if (!body.view) {
      console.log("No Body.view provided");
      return;
    }
  
    const allowedTypes = [
      "free_text",
      "multiple_choice",
      "rating",
      "boolean",
      "numbered_list",
    ] as const;
  
    const values = body.view.state.values;
    const selectedType = values.question_format_block.question_format.selected_option
      ?.value as Question["type"];
    const questionText = values.question_text_block.question_text.value || "";
  
    // Create a new question with dynamic options based on type
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: allowedTypes.includes(selectedType) ? selectedType : "free_text",
      text: questionText,
      required:
        values.question_required_block.question_required.selected_option?.value ===
        "required",
      options:
        selectedType === "free_text"
          ? [] // Empty array for free_text
          : selectedType === "boolean"
          ? ["yes", "no"] // Yes/No options for boolean
          : values.question_options_block.question_options.value
          ? values.question_options_block.question_options.value
              .split(",")
              .map((o) => o.trim())
          : [],
    };
  
    // Validate question
    const validationError = validateQuestion(newQuestion);
    if (validationError) {
      await client.views.update({
        view_id: body.view?.id,
        view: {
          ...(body.view as View),
          blocks: [
            ...body.view.blocks,
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `:warning: ${validationError}`,
              },
            } as SectionBlock,
          ],
        },
      });
      return;
    }
  
    // Retrieve and update the questions array
    const questions = getQuestionsFromView(body.view);
    questions.push(newQuestion);
  
    // Update private metadata with the new questions
    const privateMetadata = JSON.parse(body.view.private_metadata || "{}");
    privateMetadata.questions = questions;
    console.log("Private Metadata Questions", privateMetadata.questions);
  
    // Update the view to show added questions
    await updateAddedQuestionsSection(
      client,
      body.view.id,
      body.view,
      questions,
      privateMetadata
    );
  };
  

// export const handleAddQuestion = async ({
//     ack,
//     body,
//     client,
//   }: SlackActionMiddlewareArgs<BlockAction> & AllMiddlewareArgs) => {
//     await ack();
    
//     if (!body.view) {
//         console.log("No Body.view provided")
//         return; 
//     } 

//     const allowedTypes = ['free_text', 'multiple_choice', 'rating', 'boolean', 'numbered_list'] as const;
  
//     const values = body.view.state.values;
//     const newQuestion: Question = {
//       id: Date.now().toString(),
//       type: allowedTypes.includes(values.question_format_block.question_format.selected_option?.value as any)
//         ? (values.question_format_block.question_format.selected_option?.value as Question['type'])
//         : 'free_text',
//       text: values.question_text_block.question_text.value || "",
//       required: values.question_required_block.question_required.selected_option?.value === 'required',
//       ...(values.question_options_block.question_options.value && {
//         options: values.question_options_block.question_options.value.split(',').map(o => o.trim())
//       })
//     };
    
//     // Validate question
//     const validationError = validateQuestion(newQuestion);
//     if (validationError) {
//       await client.views.update({
//         view_id: body.view?.id,
//         view : {
//           ...(body.view as View),
//           blocks: [
//             ...body.view.blocks,
//             {
//               type: 'section',
//               text: {
//                 type: 'mrkdwn',
//                 text: `:warning: ${validationError}` // Display error message
//               }
//             } as SectionBlock,
//           ]
//         }
//       });
//       return;
//     }

//     // Add to questions array
//     const questions = getQuestionsFromView(body.view);
//     questions.push(newQuestion);

//     console.log("Before updateAddedQuestionsSection")
  
//     // Update the view to show added questions
//     await updateAddedQuestionsSection(client, body.view.id, body.view, questions);
// };



// Helper to get questions from view state
// const getQuestionsFromView = (view: ViewOutput): Question[] => {
//     const questionsBlock = view.blocks.find(
//       (block: any): block is SectionBlock =>
//         block.block_id === 'added_questions_list'
//     );
  
//     if (!questionsBlock?.text?.text) {
//       console.log('No questions block found or empty text');
//       return [];
//     }
  
//     try {
//       // Extract the JSON string from the markdown text
//       const jsonStr = questionsBlock.text.text.split('```json\n')[1]?.split('\n```')[0];
//       if (!jsonStr) {
//         console.log('No JSON string found in questions block');
//         return [];
//       }
//       const questions = JSON.parse(jsonStr);
//       console.log('Parsed questions:', questions);
//       return questions;
//     } catch (e) {
//       console.error('Error parsing questions:', e);
//       return [];
//     }
//   };


  // Helper to get questions from view state
const getQuestionsFromView = ( view: ViewOutput): Question[] => {
    const questionsBlock = view.blocks.find(
      (block: any): block is SectionBlock =>
        block.block_id === 'added_questions_list'
    );
  
    if (!questionsBlock?.text?.text) {
      console.log('No questions block found or empty text');
      return [];
    }
  
    try {
      // Extract the JSON string from the markdown text
      const jsonStr = questionsBlock.text.text.split('```json\n')[1]?.split('\n```')[0];
      if (!jsonStr) {
        console.log('No JSON string found in questions block');
        return [];
      }
      const questions = JSON.parse(jsonStr);
      console.log('Parsed questions:', questions);
      return questions;
    } catch (e) {
      console.error('Error parsing questions:', e);
      return [];
    }
};
  

  const updateAddedQuestionsSection = async (
    client: any, 
    viewId: string, 
    currentView: ViewOutput,
    questions: Question[],
    privateMetadata: any
  ) => {
    console.log('Updating questions section with:', questions);
  
    // Store the full questions data in a hidden format
    const questionsDataBlock: SectionBlock = {
      type: 'section',
      block_id: 'added_questions_list',
      text: {
        type: 'mrkdwn',
        text: `\`\`\`json\n${JSON.stringify(questions)}\n\`\`\`` // Store as JSON in markdown
      }
    };
  
    // Create visible blocks to display questions
    const questionDisplayBlocks = questions.map((question): SectionBlock => ({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*${question.text}*\nType: ${question.type}${question.options ? `\nOptions: ${question.options.join(', ')}` : ''}\n${question.required ? '(Required)' : '(Optional)'}`
      },
      accessory: {
        type: 'button',
        text: {
          type: 'plain_text',
          text: 'Remove'
        },
        action_id: `remove_question_${question.id}`,
        value: question.id
      }
    }));
  
    try {
      // Get all blocks up to the add_question_actions block
      const precedingBlocks = currentView.blocks.slice(0, 
        currentView.blocks.findIndex(block => block.block_id === 'add_question_actions') + 1
      );

      const existingQuestionsSectionIndex = currentView.blocks.findIndex(
        (block) => block.block_id === 'added_questions_section'
      );

      const newBlocks = [...precedingBlocks];

      if (existingQuestionsSectionIndex !== -1) {
        // Replace the existing section
        newBlocks.splice(existingQuestionsSectionIndex, 1, {
            type: 'section',
            block_id: 'added_questions_section',
            text: {
            type: 'mrkdwn',
            text: '*Added Questions:*'
            }
        });
      } else {
        // Add a new section
        newBlocks.push({
            type: 'section',
            block_id: 'added_questions_section',
            text: {
            type: 'mrkdwn',
            text: '*Added Questions:*'
            }
        });
      }

      // Add questions data block and display blocks
      newBlocks.push(questionsDataBlock, ...questionDisplayBlocks);

      // Update the view with added questions
      await client.views.update({
        view_id: viewId,
        hash: currentView.hash, // Important: Include the hash for view updates
        view: {
          type: 'modal',
          callback_id: 'add_team_modal',
          private_metadata: JSON.stringify(privateMetadata), // Update private_metadata
          title: {
            type: 'plain_text',
            text: 'Add New Team'
          },
          submit: {
            type: 'plain_text',
            text: 'Create Team'
          },
          close: {
            type: 'plain_text',
            text: 'Cancel'
          },
          blocks: [
            ...newBlocks, // All blocks with added questions
          ]
        }
      });
      console.log('View updated successfully');
    } catch (error) {
      console.error('Error updating view:', error);
      throw error;
    }
  };
  

  // Define the action handler for modal submission
  export const handleAddTeamModalSubmit = async ({ body,client, ack, respond }: any) => {

    const privateMetadata = JSON.parse(body.view.private_metadata || '{}');
    const questions = privateMetadata.questions || [];
      
    const values = body.view.state.values;
    const errors: { [key: string]: string } = {};
      
    // Extract data from the modal submission
    const teamName = values.team_name_block.team_name.value.trim();
    const teamMembers = values.team_members_block.team_members.selected_users;
    const timeZone = values.time_zone_block.time_zone.selected_option?.value;
    const standupDays = values.standup_day_block.standup_days.selected_options?.map((option: any) => option.value) || [];
    const standupTimes = values.standup_time_block.standup_times.selected_options?.map((option: any) => option.value) || [];
    const reminderTimes = values.reminder_time_block.reminder_times.selected_options?.map((option: any) => option.value) || [];
    // const questionFormat = values.question_format_block.question_format.selected_option?.value;
    // const questionText = values.question_text_block.question_text.value.trim();
    // const questionOptions = values.question_options_block.question_options?.value.trim();
  
    // Validation
    if (!teamMembers || teamMembers.length === 0) {
        errors["team_members_block"] =   "Please select at least one team member.";
        throw new Error("No valid admins selected");
    }
    
    if (!teamName) {
      errors["team_name_block"] = "Please enter a team name.";
      throw new Error("Team name is empty");
    }
    
    if (!timeZone) {
        errors["time_zone_block"] = "Please select a time zone.";
        throw new Error("Please Select A Time Zone");
    }
  

    
    // Optional validation for selected days, times, and reminders
    if (!standupDays.length || !standupTimes.length || !reminderTimes.length) {
      return respond({
        response_type: 'ephemeral',
        text: 'Please make sure you have selected days, times, and reminders for the standup.',
    });
    }
    
    
    // If there are errors, send them back to the modal
      if (Object.keys(errors).length > 0) {
        await ack({
          response_action: "errors",
          errors,
        });
        return;
    }
    
    // Acknowledge the submission if no errors
    await ack();
    
    const admins: string[] = [body.user.id]; // Add the creator's ID as the first admin
    // Create the team and store in your backend or database
    const newTeam = {
      name: teamName,
      admins: admins,
      members: teamMembers,
      timeZone: timeZone || 'UTC',
      standup: {
            standupDays: standupDays,
            standupTimes: standupTimes,
            reminderTimes: reminderTimes,
            questions: questions,
            // [
            //     // {
            //     // format: questionFormat,
            //     // text: questionText,
            //     // options: questionOptions ? questionOptions.split(',').map((option: string) => option.trim()) : [],
            //     // required: values.question_required_block.question_required.selected_option.value === 'required',
            //     // },
            // ],
      }
    };

    console.log("New Team", newTeam);
    console.log("New Team Questions", newTeam.standup.questions);
  
     try {
        // Create the admins array including the user who is creating the team

        const result = await addTeams(
          newTeam, client
        );

        // Notify the user that the team and channel have been created
        await client.chat.postMessage({
          channel: body.user.id,
          text: result.success
            ? `🎉 Team "${teamName}" and its channel have been created successfully!`
            : "❌ Failed to create the team or channel. Please try again.",
        });
      } catch (error) {
        console.error("Error creating team:", error);
        await client.chat.postMessage({
          channel: body.user.id,
          text: "❌ An error occurred while creating the team. Please try again.",
        });
      }
}
