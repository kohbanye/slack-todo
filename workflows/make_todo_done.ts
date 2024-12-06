import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { MakeTodoDoneFunction } from "../functions/make_todo_done.ts";

export const MakeTodoDone = DefineWorkflow({
  callback_id: "make_todo_done",
  title: "Make Todo Done",
  description: "Mark a todo as done",
  input_parameters: {
    properties: {
      channel: {
        type: Schema.slack.types.channel_id,
      },
      user: {
        type: Schema.slack.types.user_id,
      },
      message_ts: {
        type: Schema.types.string,
      },
      reaction: {
        type: Schema.types.string,
      },
    },
    required: ["channel", "user", "message_ts", "reaction"],
  },
});

const functionStep = MakeTodoDone.addStep(MakeTodoDoneFunction, {
  user: MakeTodoDone.inputs.user,
  channel_id: MakeTodoDone.inputs.channel,
  message_ts: MakeTodoDone.inputs.message_ts,
});

MakeTodoDone.addStep(Schema.slack.functions.SendMessage, {
  channel_id: MakeTodoDone.inputs.channel,
  message: functionStep.outputs.result,
});
