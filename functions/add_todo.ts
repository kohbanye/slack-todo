import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

export const AddTodoFunction = DefineFunction({
  callback_id: "add_todo_function",
  title: "Add Todo",
  description: "Add a todo to the datastore",
  source_file: "functions/add_todo.ts",
  input_parameters: {
    properties: {
      user: {
        type: Schema.slack.types.user_id,
        description: "The user invoking the workflow",
      },
      message: {
        type: Schema.types.string,
        description: "Message to be posted",
      },
      message_ts: {
        type: Schema.types.string,
        description: "Timestamp of the message",
      },
    },
    required: ["user", "message"],
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
  AddTodoFunction,
  async ({ inputs, env }) => {
    const supabase = createClient(
      env["SUPABASE_URL"],
      env["SUPABASE_KEY"],
    );

    const { error } = await supabase.from("task").insert([
      {
        name: inputs.message,
        user: inputs.user,
        message_ts: inputs.message_ts,
        is_done: false,
      },
    ]);

    if (error) {
      throw new Error(error.message);
    }

    const result =
      `:writing_hand: <@${inputs.user}> added a new task: ${inputs.message}`;

    return {
      outputs: {
        result,
      },
    };
  },
);
