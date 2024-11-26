import сhat from "../database/models/chat.js";

export default async function (token, question, answer) {
  try {
    const chat = await сhat.create({ token, question, answer });
    console.log("Chat created:", chat.toJSON());
  } catch (err) {
    console.error("Error creating chat:", err);
  }
}
