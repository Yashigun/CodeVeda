import { useState } from "react";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const currentInput = input;
    setInput("");

    // Show user message
    setMessages((m) => [...m, { role: "user", text: currentInput }]);

    try {
      const res = await fetch("http://localhost:8080/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: currentInput })
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

  // Bot Reply ka format
  function formatBotReply(text) {
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  const sections = {};
  let currentKey = null;

  // Match by keywords instead of exact text
  const matchers = {
    "Severity": /severity\s*:/i,
    "Immediate Need for Attention": /immediate\s+need\s+for\s+attention\s*:/i,
    "See a Doctor If": /(see|seek).*(doctor|medical)/i,
    "Next Steps": /next\s+steps\s*:/i,
    "Possible Conditions": /possible\s+conditions\s*:/i,
    "Disclaimer": /disclaimer\s*:/i
  };

  lines.forEach(line => {
    for (let key in matchers) {
      if (matchers[key].test(line)) {
        currentKey = key;
        if (["See a Doctor If", "Next Steps", "Possible Conditions"].includes(key)) {
          sections[key] = [];
        } else {
          sections[key] = line.replace(matchers[key], "").trim();
        }
        return; // Skip to next line
      }
    }

    // Add bullet points
    if (line.startsWith("-") && currentKey && Array.isArray(sections[currentKey])) {
      sections[currentKey].push(line.replace(/^-/, "").trim());
    }
    else if (/^[-•*0-9]+\./.test(line) && currentKey && Array.isArray(sections[currentKey])) {
      sections[currentKey].push(line.replace(/^[-•*0-9.]+\s*/, "").trim());
    }
  });

  return (
    <div style={{ lineHeight: "1.5" }}>
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
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h2>MediMate Bot</h2>
      <div style={{
        border: "1px solid #ccc",
        padding: 10,
        height: 400,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "10px"
      }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              background: msg.role === "user" ? "#2563eb" : "#f3f4f6",
              color: msg.role === "user" ? "#fff" : "#111",
              padding: "8px 12px",
              borderRadius: "12px",
              maxWidth: "70%",
              whiteSpace: "pre-wrap"
            }}
          >
            {msg.role === "bot" ? formatBotReply(msg.text) : msg.text}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 10, display: "flex" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Describe your symptoms..."
          style={{ flex: 1, padding: 8 }}
        />
        <button onClick={sendMessage} style={{ padding: "8px 12px" }}>Send</button>
      </div>
    </div>
  );
}

export default App;
