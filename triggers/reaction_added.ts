import { Trigger } from "deno-slack-api/types.ts";
import { CHANNEL_ID, TEST_CHANNEL_ID } from "../const.ts";
import { MakeTodoDone } from "../workflows/make_todo_done.ts";

const reactionAddedTrigger: Trigger<typeof MakeTodoDone.definition> = {
  type: "event",
  name: "Reaction Added",
  workflow: `#/workflows/${MakeTodoDone.definition.callback_id}`,
  event: {
    event_type: "slack#/events/reaction_added",
    channel_ids: [CHANNEL_ID, TEST_CHANNEL_ID],
    filter: {
      version: 1,
      root: { statement: "{{data.reaction}} == white_check_mark" },
    },
  },
  inputs: {
    channel: { value: "{{data.channel_id}}" },
    user: { value: "{{data.user_id}}" },
    message_ts: { value: "{{data.message_ts}}" },
    reaction: { value: "{{data.reaction}}" },
  },
};

export default reactionAddedTrigger;