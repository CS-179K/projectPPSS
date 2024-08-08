import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
// import Anthropic from "@anthropic-ai/sdk";
import { Button, Input, Card } from "antd";

const { TextArea } = Input;

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
// const anthropic = new Anthropic({
//     apiKey: process.env.ANTHROPIC_API_KEY,
//   });


const PromptPanel = ({ filters, onSubmit }) => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async () => {
    try {
      const result = await model.generateContent(
        `Filters: ${JSON.stringify(filters)}. Prompt: ${prompt}`
      );
      const generatedText = result.response.text();
    //   const generatedText = await anthropic.messages.create({
    //     model: "claude-3-5-sonnet-20240620",
    //     max_tokens: 1000,
    //     temperature: 0,
    //     system: JSON.stringify(filters),
    //     messages: [
    //       {
    //         role: "user",
    //         content: [
    //           {
    //             type: "text",
    //             text: prompt,
    //           },
    //         ],
    //       },
    //     ],
    //   });
      setResponse(generatedText);
      onSubmit({ filters, prompt, response: generatedText });
    } catch (error) {
      console.error("Error generating content:", error);
      setResponse("An error occurred while generating content.");
    }
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
