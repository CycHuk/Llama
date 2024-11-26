import chat from "../database/models/chat.js";

export default async function (token, number_of_messages) {
  try {
    const messages = await chat.findAll({
      where: { token },
      limit: number_of_messages,
      order: [["id", "DESC"]],
      attributes: {
        exclude: ["id", "token"],
      },
    });
    return messages.reverse();
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw new Error("Could not fetch messages.");
  }
}
