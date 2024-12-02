import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { Database } from "../database.types.ts";

export const GetTodosFunction = DefineFunction({
  callback_id: "get_todos_function",
  title: "Get Todos",
  description: "Get all pending tasks",
  source_file: "functions/get_todos.ts",
  output_parameters: {
    properties: {
      message: {
        type: Schema.types.string,
        description: "Message to be posted",
      },
    },
    required: ["message"],
  },
});

export default SlackFunction(
  GetTodosFunction,
  async ({ env }) => {
    const supabase = createClient<Database>(
      env["SUPABASE_URL"],
      env["SUPABASE_KEY"],
    );

    const { data, error } = await supabase
      .from("task")
      .select("name, user")
      .eq("is_done", false);

    if (error) {
      throw new Error(error.message);
    }

    const tasksByUser = data.reduce((acc: Map<string, string[]>, task) => {
      if (!acc.has(task.user)) {
        acc.set(task.user, []);
      }
      acc.get(task.user)?.push(task.name);
      return acc;
    }, new Map<string, string[]>());

    const message = Array.from(
      tasksByUser,
      ([user, tasks]) => `<@${user}>\n- ${tasks.join("\n- ")}\n`,
    ).join("");

    return { outputs: { message } };
  },
);
