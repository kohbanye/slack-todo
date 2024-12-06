import { Manifest } from "deno-slack-sdk/mod.ts";
import { AddTodo } from "./workflows/add_todo.ts";
import { MakeTodoDone } from "./workflows/make_todo_done.ts";
import { NotificateTodo } from "./workflows/notificate_todo.ts";

import "std/dotenv/load.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/automation/manifest
 */
export default Manifest({
  name: "Todo Manager",
  description: "A todo manager to help you keep track of your tasks",
  icon: "assets/assignment.png",
  workflows: [AddTodo, NotificateTodo, MakeTodoDone],
  outgoingDomains: ["jldvhhfcieepsexewykr.supabase.co"],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "channels:history",
    "channels:read",
    "reactions:read",
  ],
});
