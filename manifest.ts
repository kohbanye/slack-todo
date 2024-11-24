import { Manifest } from "deno-slack-sdk/mod.ts";
import { AddTodo } from "./workflows/add_todo.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/automation/manifest
 */
export default Manifest({
  name: "Todo Manager",
  description: "A todo manager to help you keep track of your tasks",
  icon: "assets/default_new_app_icon.png",
  workflows: [AddTodo],
  outgoingDomains: ["jldvhhfcieepsexewykr.supabase.co"],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "channels:history",
    "channels:read",
  ],
});
