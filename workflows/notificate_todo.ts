import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { GetTodosFunction } from "../functions/get_todos.ts";

export const NotificateTodo = DefineWorkflow({
  callback_id: "notificate_todo",
  title: "Notificate Todo",
  description: "Daily notification of pending tasks",
});

const functionStep = NotificateTodo.addStep(GetTodosFunction, {});

NotificateTodo.addStep(Schema.slack.functions.SendMessage, {
  channel_id: Deno.env.get("IS_LOCAL") ? "C082LHKLXFB" : "C07UNKRRJ3X",
  message: functionStep.outputs.message,
});

export default NotificateTodo;
