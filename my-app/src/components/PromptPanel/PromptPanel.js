import { useState } from "react";
import { Button, Input, Card } from "antd";

const { TextArea } = Input;

const PromptPanel = ({ filters, onSubmit }) => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async () => {
    console.log(filters, prompt);
  };

  return (
    <Card title="Prompt">
      <TextArea
        rows={4}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt"
      />
      <Button
        type="primary"
        onClick={handleSubmit}
        style={{ marginTop: "16px" }}
      >
        Submit
      </Button>
      {response && (
        <div style={{ marginTop: "16px" }}>
          <h3>Response:</h3>
          <p style={{ whiteSpace: "pre-wrap" }}>{response}</p>
        </div>
      )}
    </Card>
  );
};

export default PromptPanel;
