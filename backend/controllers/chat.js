import generate_token from "../models/chat/generate_token.js";
import newQuestionHandler from "../models/chat/new_question.js";
import chat_query from "../models/ollama/query.js";
import get_history from "../models/chat/load_history.js";

export const new_token = async (req, res) => {
  try {
    const token = generate_token();

    return res.status(200).json({ token: token });
  } catch (error) {
    console.error("Error generating token:", error);
    return res.status(500).json({ error: "Failed to generate token" });
  }
};

export const new_question = async (req, res) => {
  try {
    const { token, question } = req.body;

    if (!token || !question) {
      return res.status(400).json({ error: "Token and question are required" });
    }

    if (question.lenght > 500) {
      return res.status(501).json({ error: "The maximum question size is 500 characters" });
    }

    res.setHeader("Content-Type", "text/plain");
    res.flushHeaders();

    let fullResponse = "";

    const response = await chat_query(token, question, (part) => {
      fullResponse += part;
      res.write(part);
    });

    console.log(fullResponse);

    let answer = { text: fullResponse };

    await newQuestionHandler(token, question, answer);

    return res.end();
  } catch (error) {
    console.error("Error processing question:", error);
    return res.status(500).json({ error: "Failed to process question" });
  }
};

export const load_history = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Token is required to process the request." });
    }

    const history = await get_history(token, 100);

    return res.status(200).json({ history: history });
  } catch (error) {
    console.error("Error while processing the request:", error);
    return res.status(500).json({ error: "An internal server error occurred. Please try again later." });
  }
};
