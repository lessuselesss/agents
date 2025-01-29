import { useEffect, useState } from "react";
import "./app.css";

type WorkflowState = {
  isRunning: boolean;
  output: string;
};

type WorkflowType =
  | "sequential"
  | "routing"
  | "parallel"
  | "orchestrator"
  | "evaluator";

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [workflows, setWorkflows] = useState<
    Record<WorkflowType, WorkflowState>
  >({
    sequential: { isRunning: false, output: "" },
    routing: { isRunning: false, output: "" },
    parallel: { isRunning: false, output: "" },
    orchestrator: { isRunning: false, output: "" },
    evaluator: { isRunning: false, output: "" },
  });

  useEffect(() => {
    // Check for user's preferred color scheme
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setTheme(prefersDark ? "dark" : "light");

    // Add theme to document
    document.documentElement.setAttribute(
      "data-theme",
      prefersDark ? "dark" : "light"
    );
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const runWorkflow = async (type: WorkflowType) => {
    setWorkflows((prev) => ({
      ...prev,
      [type]: { ...prev[type], isRunning: true },
    }));

    // Simulate workflow execution
    const examples = {
      sequential:
        "1. Processing input text...\n2. Generating response...\n3. Final output: Completed sequential processing",
      routing:
        "Analyzing input...\nRouting to technical support queue\nGenerating specialized response...",
      parallel:
        "Starting parallel tasks...\nTask A: Complete\nTask B: Complete\nTask C: Complete\nMerging results...",
      orchestrator:
        "Orchestrator: Planning task breakdown\n- Subtask 1 assigned to Worker A\n- Subtask 2 assigned to Worker B\nSynthesizing results...",
      evaluator:
        "Initial generation: Draft response\nEvaluation: Needs improvement in clarity\nOptimizing: Generating improved version\nFinal output: Enhanced response",
    };

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setWorkflows((prev) => ({
      ...prev,
      [type]: { isRunning: false, output: examples[type] },
    }));
  };

  const patterns = {
    sequential: {
      title: "Prompt Chaining",
      description:
        "Decomposes tasks into a sequence of steps, where each LLM call processes the output of the previous one.",
      image: "/flows/01 sequential.png",
    },
    routing: {
      title: "Routing",
      description:
        "Classifies input and directs it to specialized followup tasks, allowing for separation of concerns.",
      image: "/flows/02 routing.png",
    },
    parallel: {
      title: "Parallelization",
      description:
        "Enables simultaneous task processing through sectioning or voting mechanisms.",
      image: "/flows/03 parallel.png",
    },
    orchestrator: {
      title: "Orchestrator-Workers",
      description:
        "A central LLM dynamically breaks down tasks, delegates to worker LLMs, and synthesizes results.",
      image: "/flows/04 orchestrator.png",
    },
    evaluator: {
      title: "Evaluator-Optimizer",
      description:
        "One LLM generates responses while another provides evaluation and feedback in a loop.",
      image: "/flows/05 evaluator.png",
    },
  };

  const WorkflowRunner = ({
    type,
    title,
  }: {
    type: WorkflowType;
    title: string;
  }) => (
    <div className="workflow-runner">
      <div className="workflow-toolbar">
        <button
          className="run-button"
          onClick={() => runWorkflow(type)}
          disabled={workflows[type].isRunning}
        >
          {workflows[type].isRunning ? (
            <>
              <div className="spinner" />
              Running...
            </>
          ) : workflows[type].output ? (
            "Run Again"
          ) : (
            "Run"
          )}
        </button>
      </div>
      <div className="workflow-output">
        {workflows[type].output ||
          `Click 'Run Workflow' to see ${title} in action`}
      </div>
    </div>
  );

  return (
    <div className="container">
      <header>
        <div className="theme-toggle" onClick={toggleTheme}>
          <span className="theme-toggle-icon">
            {theme === "light" ? "🌞" : "🌙"}
          </span>
          <div className="theme-toggle-switch" />
        </div>
        <h1>Building Effective Agents</h1>
        <p>Common patterns for implementing AI agents</p>
        <div className="header-links">
          <p>
            Based on{" "}
            <a
              href="https://www.anthropic.com/research/building-effective-agents"
              target="_blank"
              rel="noopener noreferrer"
            >
              Anthropic's research
            </a>{" "}
            on agent patterns.
          </p>
          <p>
            Code samples from{" "}
            <a
              href="https://sdk.vercel.ai/docs/foundations/agents"
              target="_blank"
              rel="noopener noreferrer"
            >
              Vercel's AI SDK
            </a>
            , running in Cloudflare's Durable Objects.
          </p>
        </div>
      </header>

      <main>
        {(
          Object.entries(patterns) as [
            WorkflowType,
            (typeof patterns)[keyof typeof patterns]
          ][]
        ).map(([type, pattern], index) => (
          <section key={type} className="pattern-section">
            <h2>
              {index + 1}. {pattern.title}
            </h2>
            <div className="pattern-content">
              <div className="pattern-image">
                <img
                  src={pattern.image}
                  alt={`${pattern.title} workflow diagram`}
                />
              </div>
              <p className="pattern-description">{pattern.description}</p>
              <WorkflowRunner type={type} title={pattern.title} />
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
