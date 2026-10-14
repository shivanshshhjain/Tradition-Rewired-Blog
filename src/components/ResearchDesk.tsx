import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, ExternalLink, RefreshCw, AlertCircle, Search, BookOpen } from 'lucide-react';
import { ArticleData } from '../types/seo';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: { title: string; uri: string }[];
  searchQueries?: string[];
  timestamp: string;
}

interface ResearchDeskProps {
  isOpen: boolean;
  onClose: () => void;
  activeArticle?: ArticleData;
  initialQuery?: string;
}

export function ResearchDesk({ isOpen, onClose, activeArticle, initialQuery }: ResearchDeskProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Welcome to the Tradition, Rewired Research Desk. I am your Senior Editorial Fellow. Ask any question regarding legacy modernization, AI sensor retrofits, family business succession, or circular business models—grounded in real-time search data.',
      timestamp: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
      if (initialQuery && initialQuery !== input) {
        setInput(initialQuery);
      }
    }
  }, [isOpen, initialQuery]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSend = async (queryToSend?: string) => {
    const text = (queryToSend || input).trim();
    if (!text || isLoading) return;

    setError(null);
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const formattedHistory = newMessages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({
          role: m.role === 'user' ? 'user' : 'model',
          content: m.content
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: formattedHistory,
          articleContext: activeArticle ? { title: activeArticle.title, slug: activeArticle.slug } : undefined
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${res.status}`);
      }

      const data = await res.json();

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.text,
        sources: data.sources || [],
        searchQueries: data.searchQueries || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setError(err.message || 'Could not communicate with the editorial research engine.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const starterPrompts = [
    'How can small factories implement AI without millions in CapEx?',
    'What steps prevent generational friction in family business succession?',
    'How does digital provenance protect traditional artisans from counterfeits?'
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-2xs transition-opacity animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white text-[#111827] h-full shadow-xl flex flex-col border-l border-[#E5E7EB] animate-in slide-in-from-right duration-200">
        {/* Desk Header */}
        <div className="bg-[#111827] text-white p-4 sm:p-5 flex items-center justify-between border-b border-black shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#1F2937] flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold tracking-tight text-white flex items-center gap-2">
                <span>Editorial Research Desk</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-black/40 text-gray-300 px-2 py-0.5 rounded">
                  Search Grounded
                </span>
              </h2>
              <p className="text-xs text-gray-400">
                Live research grounded in verified industrial sources
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white hover:bg-[#1F2937] rounded transition-colors cursor-pointer"
            aria-label="Close research desk"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Article Badge */}
        {activeArticle && (
          <div className="bg-[#F9FAFB] px-4 py-2 border-b border-[#E5E7EB] text-xs text-[#4B5563] flex items-center gap-2 shrink-0">
            <BookOpen className="w-3.5 h-3.5 text-[#111827] shrink-0" />
            <span className="truncate">Context: <strong>{activeArticle.title}</strong></span>
          </div>
        )}

        {/* Scrollable Messages Thread */}
        <div className="flex-grow overflow-y-auto p-4 sm:p-5 space-y-3.5 bg-[#FAFAFA]">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[90%] rounded p-3.5 text-xs sm:text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-[#111827] text-white shadow-2xs'
                    : 'bg-white text-[#1F2937] border border-[#E5E7EB] shadow-2xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>

                {/* Grounding Search Queries */}
                {m.searchQueries && m.searchQueries.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-[#F3F4F6] text-xs text-[#6B7280]">
                    <span className="font-semibold block mb-1 flex items-center gap-1 text-[#374151]">
                      <Search className="w-3 h-3 text-[#111827]" />
                      <span>Verified Search Inquiries:</span>
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {m.searchQueries.map((q, idx) => (
                        <span key={idx} className="bg-[#F3F4F6] px-1.5 py-0.5 rounded text-[11px] text-[#374151]">
                          "{q}"
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Grounding Citations */}
                {m.sources && m.sources.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-[#F3F4F6] text-xs text-[#6B7280]">
                    <span className="font-semibold block mb-1 text-[#374151]">Sources:</span>
                    <ul className="space-y-0.5">
                      {m.sources.map((s, idx) => (
                        <li key={idx}>
                          <a
                            href={s.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#111827] hover:underline flex items-center gap-1 font-medium truncate"
                          >
                            <ExternalLink className="w-3 h-3 shrink-0 text-[#9CA3AF]" />
                            <span className="truncate">{s.title}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-[#9CA3AF] mt-1 px-1 font-mono">
                {m.timestamp}
              </span>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-center gap-2 p-2.5 bg-white border border-[#E5E7EB] rounded text-xs text-[#6B7280] max-w-xs animate-pulse">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#111827]" />
              <span>Consulting research index &amp; live web data...</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-800">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Notice</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Starter Prompts */}
        {messages.length === 1 && (
          <div className="px-4 py-2.5 border-t border-[#E5E7EB] bg-white shrink-0">
            <span className="text-[11px] font-semibold text-[#6B7280] block mb-1 uppercase tracking-wider">
              Suggested Inquiries:
            </span>
            <div className="flex flex-col gap-1">
              {starterPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(p)}
                  className="text-left text-xs text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F6] p-1.5 rounded transition-colors cursor-pointer truncate"
                >
                  → {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3.5 bg-white border-t border-[#E5E7EB] shrink-0">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about traditional business technology..."
              className="flex-grow bg-[#FAFAFA] border border-[#E5E7EB] focus:border-[#111827] focus:outline-none rounded px-3 py-2 text-xs sm:text-sm text-[#111827] placeholder:text-[#9CA3AF]"
              disabled={isLoading}
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="bg-[#111827] hover:bg-black disabled:opacity-40 text-white p-2 rounded transition-colors cursor-pointer shrink-0"
              aria-label="Send inquiry"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-1.5 text-[11px] text-[#9CA3AF] flex items-center justify-between">
            <span>Press Enter to submit</span>
            <span>Search Grounding Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
