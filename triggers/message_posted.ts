import {
  TriggerContextData,
  TriggerEventTypes,
  TriggerTypes,
} from "deno-slack-api/mod.ts";
import { Trigger } from "deno-slack-sdk/types.ts";
import { AddTodo } from "../workflows/add_todo.ts";

export const messageTrigger: Trigger<typeof AddTodo.definition> = {
  type: TriggerTypes.Event,
  name: "Message Posted",
  description: "Triggers when a message is posted",
  workflow: `#/workflows/${AddTodo.definition.callback_id}`,
  event: {
    event_type: TriggerEventTypes.MessagePosted,
    channel_ids: ["C07UNKRRJ3X", "C082LHKLXFB"],
    filter: {
      version: 1,
      root: {
        operator: "NOT",
        inputs: [{
          statement: "{{data.user_id}} == null",
        }],
      },
    },
  },
  inputs: {
    channel: {
      value: TriggerContextData.Event.MessagePosted.channel_id,
    },
    user: {
      value: TriggerContextData.Shortcut.user_id,
    },
    message: {
      value: TriggerContextData.Event.MessagePosted.text,
    },
    message_ts: {
      value: TriggerContextData.Event.MessagePosted.message_ts,
    }
  },
};

export default messageTrigger;
