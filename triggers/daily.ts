import { TriggerTypes } from "deno-slack-api/mod.ts";
import { Trigger } from "deno-slack-sdk/types.ts";
import NotificateTodo from "../workflows/notificate_todo.ts";

const dailyTrigger: Trigger<typeof NotificateTodo.definition> = {
  type: TriggerTypes.Scheduled,
  name: "Daily Trigger",
  description: "Trigger a scheduled notification",
  workflow: `#/workflows/${NotificateTodo.definition.callback_id}`,
  inputs: {},
  schedule: {
    start_time: new Date(new Date().setHours(9, 0, 0, 0)).toISOString(),
    frequency: { type: "daily", repeats_every: 1 },
  },
};

export default dailyTrigger;
