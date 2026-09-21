// shared types for the /chat beta console — mirrors the python harness sse events

export type Source = { title: string; url: string };

export type RunStats = {
  queries: number;
  pages: number;
  browser_pages: number;
  ms: number;
  model?: string;
};

export type ToolRow = {
  kind: "search" | "crawl";
  label: string; // query text or target url
  title?: string; // page title (crawls)
  results?: Source[]; // hits (searches)
  error?: string;
  mandatory?: boolean; // user-supplied must-read url
  extractedVia?: string; // scrapling extraction path
};

export type AgentStatus = { phase: string; detail?: string };

export type AgentQuestion = {
  id: string;
  text: string;
  options?: string[];
  kind?: string; // clarify | plan_addons
};

export type PlanProposal = {
  queries: string[];
  notes?: string;
  question?: string;
};

export type UiMsg =
  | { id: string; role: "user"; text: string; questionId?: string }
  | {
      id: string;
      role: "assistant";
      text: string;
      error?: boolean;
      question?: AgentQuestion;
      questionDone?: boolean;
      plan?: PlanProposal;
      planDone?: boolean;
      sources?: Source[];
      stats?: RunStats;
    };

export type ChatMode = "chat" | "research" | "deep";

/** wire shape expected by the python harness (agent-service/app/models.py) */
export type WireMsg = {
  role: "user" | "assistant" | "system";
  content: string;
  question_id?: string;
  intent?: "chat" | "plan_approval";
};

/** map the visible thread into harness history for the next turn */
export function toWireHistory(msgs: UiMsg[]): WireMsg[] {
  const out: WireMsg[] = [];
  for (const m of msgs) {
    if (m.role === "user") {
      out.push({
        role: "user",
        content: m.text,
        ...(m.questionId ? { question_id: m.questionId } : {}),
      });
    } else if (m.text) {
      out.push({ role: "assistant", content: m.text.slice(0, 4000) });
    }
  }
  return out.slice(-24);
}
