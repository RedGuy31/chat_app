import OpenAi from "openai";
import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAi({ apiKey });

export const chat = action({
  args: {
    messageBody: v.string(),
    conversation: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const res = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a terse bot in a group chat responding to questions with 5-sentence answers",
        },
        {
          role: "user",
          content: args.messageBody,
        },
      ],
    });

    const messageContent = res.choices[0].message.content;

    await ctx.runMutation(api.messages.sendChatGPTMessage, {
      content: messageContent ?? "I'm sorry, I don't have a response for that",
      conversation: args.conversation,
      messageType: "text",
    });
  },
});
