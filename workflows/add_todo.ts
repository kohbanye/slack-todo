import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { AddTodoFunction } from "../functions/add_todo.ts";

export const AddTodo = DefineWorkflow({
  callback_id: "add_todo",
  title: "Add Todo",
  description: "Add a todo to the list",
  input_parameters: {
    properties: {
      channel: {
        type: Schema.slack.types.channel_id,
      },
      user: {
        type: Schema.slack.types.user_id,
      },
      message: {
        type: Schema.types.string,
      },
    },
    required: ["user", "message"],
  },
});

const sampleFunctionStep = AddTodo.addStep(AddTodoFunction, {
  user: AddTodo.inputs.user,
  message: AddTodo.inputs.message,
});

AddTodo.addStep(Schema.slack.functions.SendMessage, {
  channel_id: AddTodo.inputs.channel,
  message: sampleFunctionStep.outputs.result,
});
