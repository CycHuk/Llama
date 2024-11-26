import React, { useState } from "react";

function App() {
  const [token, setToken] = useState(""); // Состояние для токена
  const [question, setQuestion] = useState(""); // Состояние для вопроса
  const [response, setResponse] = useState(""); // Состояние для ответа от сервера

  // Функция для обработки отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token || !question) {
      alert("Token and question are required");
      return;
    }

    try {
      const res = await fetch("/chat/new_question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, question }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Unknown error");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let result = "";

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        result += decoder.decode(value, { stream: true });
        setResponse(result);
      }
    } catch (error) {
      console.error("Error:", error);
      setResponse("Failed to process the question");
    }
  };

  return (
    <div className="App">
      <h1>Submit Your Question</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="token">Token:</label>
          <input type="text" id="token" value={token} onChange={(e) => setToken(e.target.value)} required />
        </div>

        <div>
          <label htmlFor="question">Question:</label>
          <textarea id="question" value={question} onChange={(e) => setQuestion(e.target.value)} maxLength="500" required />
        </div>

        <button type="submit">Submit</button>
      </form>

      <div>
        <h2>Response:</h2>
        <pre>{response}</pre>
      </div>
    </div>
  );
}

export default App;
