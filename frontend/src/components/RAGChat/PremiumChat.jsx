import React, { useState, useEffect, useRef } from "react";
import { Send, Mic, MicOff } from "lucide-react";
import DocumentUploader from "./DocumentUploader";
import ContextWindow from "./ContextWindow";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import GlowingButton from "../PremiumUI/GlowingButton";
import { useToastStore } from "../../store/useToastStore";

export default function PremiumChat() {
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hello! I am your enterprise-grade RAG assistant. Ingest TXT or PDF documents, and ask me questions to query their context.", contextUsed: [] }
  ]);
  const [inputText, setInputText] = useState("");
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  
  const addToast = useToastStore((state) => state.addToast);
  const chatEndRef = useRef(null);
  
  const suggestedQueries = [
    "Summarize key aspects of the document.",
    "What are the core insights in this context?",
    "Explain this document to me simply."
  ];

  const fetchDocuments = async () => {
    try {
      const response = await fetch("/api/rag/documents");
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    setMessages(prev => [...prev, { sender: "user", text: query }]);
    if (!textToSend) setInputText("");
    
    setLoading(true);
    try {
      const response = await fetch("/api/rag/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, { sender: "ai", text: data.reply, contextUsed: data.context_used }]);
      } else {
        addToast("Chatbot failed to query Hugging Face models.", "error");
      }
    } catch (err) {
      addToast("Server connection failure.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      addToast("Speech recognition is not supported in this browser.", "warning");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    
    recognition.onstart = () => {
      setListening(true);
      addToast("Speech recognition active...", "info");
    };

    recognition.onresult = (e) => {
      const speechToText = e.results[0][0].transcript;
      setInputText(speechToText);
    };

    recognition.onerror = () => {
      setListening(false);
      addToast("Failed to capture audio streams.", "error");
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto py-2 w-full">
      <div className="text-center md:text-left select-none">
        <h2 className="text-2xl font-bold text-white font-heading tracking-wide">Context Chat (RAG)</h2>
        <p className="text-xs text-slate-400 mt-1">Query semantic databases and upload context nodes dynamically</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Document uploads */}
        <div className="flex flex-col gap-6">
          <DocumentUploader onUploadSuccess={fetchDocuments} />
          <ContextWindow documents={documents} onRefresh={fetchDocuments} />
        </div>

        {/* Messaging Box */}
        <div className="lg:col-span-2 flex flex-col h-[525px] p-6 premium-glass border border-white/5 rounded-2xl justify-between">
          
          {/* Scrollable list */}
          <div className="flex-grow overflow-y-auto flex flex-col gap-5 pr-1 mb-4">
            {messages.map((m, idx) => (
              <MessageBubble key={idx} message={m} />
            ))}
            {loading && <TypingIndicator />}
            <div ref={chatEndRef} />
          </div>

          {/* Quick chips suggestion */}
          {documents.length > 0 && messages.length === 1 && (
            <div className="flex flex-wrap gap-2 mb-4 select-none">
              {suggestedQueries.map((q, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-slate-350 hover:text-white rounded-full text-[10px] font-semibold transition-all border border-white/5"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Prompt panel */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="flex items-center gap-3 border-t border-white/5 pt-4"
          >
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`p-3 border rounded-xl transition-all ${
                listening 
                  ? "bg-rose-500/15 border-rose-500/30 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.2)] animate-pulse" 
                  : "bg-slate-900/35 border-white/5 text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            <input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={documents.length > 0 ? "Ask questions about your data..." : "Type a message..."}
              className="flex-grow px-4 py-3 bg-slate-900/35 border border-white/5 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25 transition-all duration-300"
            />
            <GlowingButton type="submit" variant="primary" size="md" className="h-10" icon={<Send className="w-4 h-4" />}>
              Send
            </GlowingButton>
          </form>

        </div>
      </div>
    </div>
  );
}
