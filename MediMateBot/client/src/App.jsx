import { useState, useRef, useEffect } from "react";
import "./App.css";
import { bot_icon } from "./assets/assets";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const currentInput = input;
    setInput("");

    setMessages((m) => [...m, { role: "user", text: currentInput }]);

    try {
      const res = await fetch("http://localhost:8080/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: currentInput }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages((m) => [...m, { role: "bot", text: data.reply }]);
      } else {
        setMessages((m) => [...m, { role: "bot", text: "No reply from server." }]);
      }
    } catch (err) {
      setMessages((m) => [...m, { role: "bot", text: "Error connecting to server." }]);
    }
  };

  // Format bot reply
  function formatBotReply(text) {
    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
    const sections = {};
    let currentKey = null;

    const matchers = {
      Severity: /severity\s*:/i,
      "Immediate Need for Attention": /immediate\s+need\s+for\s+attention\s*:/i,
      "See a Doctor If": /(see|seek).*(doctor|medical)/i,
      "Next Steps": /next\s+steps\s*:/i,
      "Possible Conditions": /possible\s+conditions\s*:/i,
      Disclaimer: /disclaimer\s*:/i,
    };

    lines.forEach((line) => {
      for (let key in matchers) {
        if (matchers[key].test(line)) {
          currentKey = key;
          if (["See a Doctor If", "Next Steps", "Possible Conditions"].includes(key)) {
            sections[key] = [];
          } else {
            sections[key] = line.replace(matchers[key], "").trim();
          }
          return;
        }
      }

      if (line.startsWith("-") && currentKey && Array.isArray(sections[currentKey])) {
        sections[currentKey].push(line.replace(/^-/, "").trim());
      } else if (/^[-•*0-9]+\./.test(line) && currentKey && Array.isArray(sections[currentKey])) {
        sections[currentKey].push(line.replace(/^[-•*0-9.]+\s*/, "").trim());
      }
    });

    return (
      <div className="bot-reply">
        {sections["Severity"] && <p><strong>Severity:</strong> {sections["Severity"]}</p>}
        {sections["Immediate Need for Attention"] && (
          <p><strong>Immediate Need for Attention:</strong> {sections["Immediate Need for Attention"]}</p>
        )}
        {sections["See a Doctor If"]?.length > 0 && (
          <div>
            <strong>See a Doctor If:</strong>
            <ul>
              {sections["See a Doctor If"].map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
        )}
        {sections["Next Steps"]?.length > 0 && (
          <div>
            <strong>Next Steps:</strong>
            <ul>
              {sections["Next Steps"].map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
        )}
        {sections["Possible Conditions"]?.length > 0 && (
          <div>
            <strong>Possible Conditions:</strong>
            <ul>
              {sections["Possible Conditions"].map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
        )}
        {sections["Disclaimer"] && <p><em>{sections["Disclaimer"]}</em></p>}
      </div>
    );
  }

  return (
    <div className="app">
      {/* Header */}
      <div className="header">MediMate Bot</div>

      {/* Chat window */}
      <div className="chat-box">
        {messages.map((msg, i) => (
  <div
    key={i}
    className={`message-row ${msg.role}`}
    style={{
      display: "flex",
      alignItems: "flex-start",
      margin: "10px 0",
      gap: "12px",
      justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
      opacity: 0,
      animation: "fadeIn 0.3s forwards",
      animationDelay: `${i * 0.1}s`
    }}
  >
    {/* Bot avatar for bot messages only */}
    {msg.role === "bot" && (
      <img
        src={bot_icon}
        alt="bot"
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          flexShrink: 0,
        }}
      />
    )}

    {/* Message bubble */}
    <div
      style={{
        backgroundColor: msg.role === "bot" ? "#c9d5da" : "#02415a",
        color: msg.role === "bot" ? "#000" : "#ffffff",
        padding: "12px 16px",
        borderRadius: "20px",
        maxWidth: "70%",
        wordWrap: "break-word",
      }}
    >
      {msg.role === "bot" ? formatBotReply(msg.text) : msg.text}
    </div>
  </div>
))}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="input-bar">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Describe your symptoms..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
