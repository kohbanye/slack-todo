import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { Database } from "../database.types.ts";

export const MakeTodoDoneFunction = DefineFunction({
  callback_id: "make_todo_done_function",
  title: "Make Todo Done",
  description: "Update a task as done in the datastore",
  source_file: "functions/make_todo_done.ts",
  input_parameters: {
    properties: {
      user: {
        type: Schema.slack.types.user_id,
        description: "The user invoking the workflow",
      },
      channel_id: {
        type: Schema.slack.types.channel_id,
        description: "The channel where the message was posted",
      },
      message_ts: {
        type: Schema.types.string,
        description: "Timestamp of the message",
      },
    },
    required: ["user", "channel_id", "message_ts"],
  },
  output_parameters: {
    properties: {
      result: {
        type: Schema.types.string,
        description: "Result to be returned",
      },
    },
    required: ["result"],
  },
});

export default SlackFunction(
  MakeTodoDoneFunction,
  async ({ inputs, env }) => {
    const supabase = createClient<Database>(
      env["SUPABASE_URL"],
      env["SUPABASE_KEY"],
    );

    const { data: taskData, error: getTaskError } = await supabase
      .from("task")
      .select("name")
      .eq("message_ts", inputs.message_ts)
      .eq("is_done", false)
      .limit(1)
      .single();

    if (getTaskError || !taskData) {
      return {
        error: `Error getting task: ${getTaskError.message}`,
      };
    }

    const { error: updateTaskError } = await supabase.from("task").update({
      is_done: true,
    }).eq("message_ts", inputs.message_ts);

    if (updateTaskError) {
      return {
        error: `Error updating task: ${updateTaskError.message}`,
      };
    }

    const result =
      `:tada: <@${inputs.user}> You've completed the task "${taskData.name}"!`;

    return {
      outputs: {
        result,
      },
    };
  },
);
