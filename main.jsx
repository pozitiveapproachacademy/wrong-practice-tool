import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowLeft,
  ArrowRight,
  Copy,
  Download,
  Pause,
  Printer,
  RotateCcw,
  Shield,
  Sparkles,
  X,
} from "lucide-react";
import "./styles.css";

const STORAGE_KEY = "wrong-return-practice-state-v1";
const SUMMARY_HEADER_TEXT = `WRONG.℠
What happened to you was just wrong. Speak your truth without losing yourself.
Truth without revenge. Compassion without self-abandonment. Gratitude without denial.`;
const SUMMARY_SUBTITLE =
  "What happened to you was just wrong. Speak your truth without losing yourself.";
const HEAVY_STEPS = new Set(["violated", "body", "truth", "burden", "repair"]);

const wrongTypes = [
  "Someone crossed a boundary",
  "Someone betrayed trust",
  "Someone ignored my dignity",
  "Someone used power unfairly",
  "Someone abandoned me",
  "Someone shamed me",
  "Someone blamed me for what was not mine",
  "Someone violated my consent",
  "Someone made me carry too much",
  "Someone denied what happened",
  "I hurt someone else",
  "I betrayed myself",
  "I stayed silent when something in me knew",
  "I am not sure yet",
  "Something else",
];

const violatedParts = [
  "My dignity",
  "My trust",
  "My safety",
  "My consent",
  "My body",
  "My voice",
  "My values",
  "My loyalty",
  "My innocence",
  "My belonging",
  "My faith",
  "My identity",
  "My work",
  "My love",
  "My grief",
  "My right to say no",
  "My right to be believed",
  "My right to exist without being managed, minimized, or used",
];

const lifeAreas = [
  "Family",
  "Friendship",
  "Romance or partnership",
  "Work",
  "School",
  "Community",
  "Faith or spirituality",
  "Health or care",
  "Money or housing",
  "Identity or belonging",
  "A system or institution",
  "My relationship with myself",
  "I am not sure yet",
];

const feelings = [
  "Grief",
  "Anger",
  "Shame",
  "Guilt",
  "Fear",
  "Confusion",
  "Disgust",
  "Love",
  "Relief",
  "Tenderness",
  "Hope",
  "Numbness",
  "Something mixed",
  "I do not know yet",
];

const bodySignals = [
  "Chest",
  "Throat",
  "Jaw",
  "Stomach",
  "Shoulders",
  "Back",
  "Hands",
  "Face",
  "Pelvis",
  "Whole body",
  "Numbness",
  "I do not know",
];

const honestTruths = [
  "That hurt me.",
  "I deserved more care.",
  "I was not protected.",
  "I did the best I could with what I knew then.",
  "I am allowed to be angry.",
  "I am allowed to grieve.",
  "I can love someone and still name the harm.",
  "I can be grateful for what survived without denying what happened.",
  "What happened was wrong.",
  "I am not responsible for carrying all of this.",
];

const survivedValues = [
  "Love",
  "Honesty",
  "Courage",
  "Compassion",
  "Justice",
  "Loyalty",
  "Protection",
  "Faith",
  "Creativity",
  "Humor",
  "Tenderness",
  "Discernment",
  "Self-respect",
  "Hope",
  "Boundaries",
  "Truth",
  "Mercy",
  "Freedom",
  "Dignity",
];

const mineToCarry = [
  "My healing",
  "My boundaries",
  "My next choice",
  "My honesty",
  "My grief",
  "My repair, if I caused harm",
  "My safety",
  "My nervous system",
  "My support",
  "My return to self",
];

const notMineToCarry = [
  "Their denial",
  "Their shame",
  "Their accountability",
  "Their reaction",
  "Their story about me",
  "Their refusal to repair",
  "Their need to be seen as innocent",
  "The whole family/system/community silence",
  "The job of making harm look beautiful",
];

const closingOptions = [
  "Rest",
  "Drink water",
  "Move my body",
  "Talk to a safe person",
  "Stop explaining",
  "Go outside",
  "Make music or art",
  "Do one ordinary task",
  "Do nothing more today",
];

const repairTruths = [
  "Repair may be possible with this person",
  "Repair may be possible, but not yet",
  "Repair is not safe",
  "Repair is not appropriate",
  "Repair may need to happen inside me first",
  "Repair may mean a boundary",
  "Repair may mean no contact",
  "Repair may mean changed behavior on my part",
  "Repair may mean an apology or amends from me",
  "Repair may mean advocacy",
  "Repair may mean ritual, grief, or release",
  "I do not know yet",
];

const repairPaths = [
  {
    value: "Inner Repair",
    label: "Inner Repair",
    description: "Return to yourself before making any outward move.",
    prompts: [
      {
        key: "innerWords",
        label: "What do I need to say to myself that I should have heard then?",
      },
    ],
  },
  {
    value: "Boundary Repair",
    label: "Boundary Repair",
    description: "Name the limit that protects safety, access, time, or dignity.",
    prompts: [
      {
        key: "boundaryWords",
        label: "The boundary that protects my dignity is:",
      },
    ],
  },
  {
    value: "Relational Repair",
    label: "Relational Repair",
    description: "Prepare words only if contact feels safe and appropriate.",
    prompts: [
      {
        key: "relationalWords",
        label:
          "What I want to say without pleading, attacking, collapsing, or abandoning myself is:",
      },
    ],
  },
  {
    value: "Amends Repair",
    label: "Amends Repair",
    description: "Take responsibility for your part without carrying theirs.",
    prompts: [
      {
        key: "amendsHarm",
        label: "The harm I am willing to take responsibility for is:",
      },
      {
        key: "amendsNotCarry",
        label: "The part I will not carry is:",
      },
      {
        key: "amendsBehavior",
        label: "The changed behavior I can practice is:",
      },
    ],
  },
  {
    value: "Advocacy Repair",
    label: "Advocacy Repair",
    description: "Let dignity guide one action without consuming your whole life.",
    prompts: [
      {
        key: "advocacyAction",
        label: "One action that honors my dignity without consuming my whole life is:",
      },
    ],
  },
  {
    value: "Ritual Repair",
    label: "Ritual Repair",
    description: "Mark grief, truth, or release without needing another person.",
    prompts: [
      {
        key: "ritualAction",
        label: "A small ritual that could help my body mark this truth is:",
      },
    ],
  },
  {
    value: "No-Contact Healing",
    label: "No-Contact Healing",
    description: "Choose distance when contact is unsafe, harmful, or not yours to manage.",
    prompts: [
      {
        key: "noContactMeaning",
        label: "Choosing no contact does not mean I failed. It may mean:",
      },
    ],
  },
];

const languageStems = [
  "I need to name that what happened was not okay.",
  "I am not asking you to agree with my whole experience, but I am not going to deny it anymore.",
  "I care about repair, but I also care about my safety.",
  "I am willing to talk if the conversation can stay respectful.",
  "I am not available for denial, blame, or minimization.",
  "I am taking responsibility for my part without taking responsibility for yours.",
  "I am choosing distance because contact is not healthy for me right now.",
  "I can love you and still protect myself.",
  "I can be grateful for what was good without pretending the harm was not real.",
  "I am not doing this to punish you. I am doing this to return to myself.",
];

const steps = [
  "start",
  "ground",
  "consent",
  "wrong",
  "life",
  "violated",
  "feeling",
  "body",
  "truth",
  "value",
  "burden",
  "repair",
  "path",
  "words",
  "return",
  "summary",
  "exit",
];

const lightSteps = ["start", "ground", "wrong", "violated", "truth", "return", "summary"];

const initialAnswers = {
  groundingSeen: "",
  groundingSupport: "",
  groundingNow: "",
  wrongKinds: [],
  wrongWords: "",
  lifeAreas: [],
  lifeAreaWords: "",
  violatedParts: [],
  tenderPart: "",
  feelings: [],
  feelingWords: "",
  bodySignals: [],
  bodyMessage: "",
  honestTruthChoice: "",
  honestTruth: "",
  survivedValues: [],
  survivedValueWords: "",
  mineCarry: [],
  notMineCarry: [],
  carryDignity: "",
  putDown: "",
  repairTruths: [],
  repairSafety: {},
  chosenPath: "",
  pathPrompts: {},
  keptWords: [],
  customWords: "",
  closingOptions: [],
  finalCare: "",
  lightMode: false,
};

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved) return null;
    return {
      stepIndex: Number.isInteger(saved.stepIndex) ? saved.stepIndex : 0,
      answers: { ...initialAnswers, ...saved.answers },
      paused: Boolean(saved.paused),
      mode: saved.mode === "light" ? "light" : "full",
    };
  } catch {
    return null;
  }
}

function App() {
  const saved = useMemo(loadState, []);
  const [mode, setMode] = useState(saved?.mode ?? "full");
  const [stepIndex, setStepIndex] = useState(saved?.stepIndex ?? 0);
  const [answers, setAnswers] = useState(saved?.answers ?? initialAnswers);
  const [paused, setPaused] = useState(saved?.paused ?? false);
  const [summaryStatus, setSummaryStatus] = useState("");
  const [breathOpen, setBreathOpen] = useState(false);
  const [breathCycle, setBreathCycle] = useState(0);

  const activeSteps = mode === "light" ? lightSteps : steps;
  const step = activeSteps[stepIndex] ?? "start";
  const progress = Math.round((stepIndex / (activeSteps.length - 1)) * 100);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ stepIndex, answers, paused, mode })
    );
  }, [answers, mode, paused, stepIndex]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setBreathOpen(false);
  }, [mode, stepIndex]);

  function updateField(key, value) {
    setAnswers((current) => ({ ...current, [key]: value }));
  }

  function updatePathField(key, value) {
    setAnswers((current) => ({
      ...current,
      pathPrompts: { ...current.pathPrompts, [key]: value },
    }));
  }

  function toggleList(key, value) {
    setAnswers((current) => {
      const existing = current[key] ?? [];
      const next = existing.includes(value)
        ? existing.filter((item) => item !== value)
        : [...existing, value];
      return { ...current, [key]: next };
    });
  }

  function toggleRepairSafety(key) {
    setAnswers((current) => ({
      ...current,
      repairSafety: {
        ...current.repairSafety,
        [key]: !current.repairSafety[key],
      },
    }));
  }

  function goNext() {
    setPaused(false);
    setBreathOpen(false);
    setStepIndex((current) => Math.min(current + 1, activeSteps.length - 1));
  }

  function goBack() {
    setPaused(false);
    setBreathOpen(false);
    setStepIndex((current) => Math.max(current - 1, 0));
  }

  function exitPractice() {
    setPaused(false);
    setBreathOpen(false);
    setMode("full");
    setStepIndex(steps.indexOf("exit"));
  }

  function startOver() {
    localStorage.removeItem(STORAGE_KEY);
    setAnswers(initialAnswers);
    setMode("full");
    setPaused(false);
    setBreathOpen(false);
    setSummaryStatus("");
    setStepIndex(0);
  }

  function returnWelcome() {
    setPaused(false);
    setBreathOpen(false);
    setStepIndex(0);
  }

  function beginFull() {
    setMode("full");
    setBreathOpen(false);
    setStepIndex(1);
  }

  function beginLight() {
    setMode("light");
    setBreathOpen(false);
    setAnswers((current) => ({ ...current, lightMode: true }));
    setStepIndex(1);
  }

  function continueToFull() {
    setMode("full");
    setBreathOpen(false);
    setStepIndex(steps.indexOf("consent"));
  }

  const summary = mode === "light" ? buildLightSummary(answers) : buildSummary(answers);
  const summaryText = buildDownloadText(summary);

  async function copySummary() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(summaryText);
      } else {
        if (!fallbackCopyText(summaryText)) {
          throw new Error("Fallback copy failed");
        }
      }
      setSummaryStatus("Summary copied.");
    } catch {
      const copied = fallbackCopyText(summaryText);
      setSummaryStatus(copied ? "Summary copied." : "Copy failed. Please select the summary text and copy it manually.");
    }
  }

  function downloadSummary() {
    const blob = new Blob([summaryText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "WRONG-reflection-summary.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setSummaryStatus("Download started.");
  }

  function printSummary() {
    setSummaryStatus("Print dialog opened.");
    window.setTimeout(() => {
      window.print();
    }, 100);
  }

  return (
    <main className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <section className="practice-frame">
        <header className="topbar">
          <button className="brand-mark" onClick={() => setStepIndex(0)} type="button">
            WRONG.<span>℠</span>
          </button>
          <div className="top-actions">
            <button className="icon-button" onClick={() => setPaused(true)} title="Pause" type="button">
              <Pause size={18} />
            </button>
            <button className="icon-button" onClick={exitPractice} title="Exit" type="button">
              <X size={18} />
            </button>
          </div>
        </header>

        <div className="progress-track" aria-label={`Progress ${progress}%`}>
          <div style={{ width: `${progress}%` }} />
        </div>

        {paused && (
          <div className="pause-banner">
            <Shield size={18} />
            <p>
              You are paused. Take a breath, look around, and come back only if
              your body has enough support.
            </p>
            <button className="small-button" onClick={() => setPaused(false)} type="button">
              Continue
            </button>
          </div>
        )}

        {step === "start" && (
          <StartScreen
            hasSaved={Boolean(saved)}
            onBegin={beginFull}
            onResume={() => setStepIndex(saved?.stepIndex ?? 1)}
            onLight={beginLight}
            onExit={exitPractice}
          />
        )}

        {step === "exit" && (
          <ExitScreen onStartOver={startOver} onWelcome={returnWelcome} />
        )}

        {step === "ground" && (
          <GroundingScreen
            mode={mode}
            onContinue={goNext}
            onExit={exitPractice}
            onLight={beginLight}
          />
        )}

        {step === "consent" && <ConsentScreen />}

        {step === "wrong" && (
          <ChoiceStep
            eyebrow="Name the wrong"
            title="What kind of wrong does this feel like?"
            note="No graphic details are needed. You can name the shape without proving the whole story."
            options={wrongTypes}
            selected={answers.wrongKinds}
            onToggle={(value) => toggleList("wrongKinds", value)}
            textLabel="In my own words, the wrong was:"
            textValue={answers.wrongWords}
            onText={(value) => updateField("wrongWords", value)}
          />
        )}

        {step === "life" && (
          <ChoiceStep
            eyebrow="Life area"
            title="Where did this wrong touch your life?"
            note="You can keep this broad. The point is orientation, not proof."
            options={lifeAreas}
            selected={answers.lifeAreas}
            onToggle={(value) => toggleList("lifeAreas", value)}
            textLabel="The area of life this touched was:"
            textValue={answers.lifeAreaWords}
            onText={(value) => updateField("lifeAreaWords", value)}
          />
        )}

        {step === "violated" && (
          <ChoiceStep
            eyebrow="What felt violated"
            title="What part of you feels like it was violated?"
            options={violatedParts}
            selected={answers.violatedParts}
            onToggle={(value) => toggleList("violatedParts", value)}
            textLabel="The part that still feels tender is:"
            textValue={answers.tenderPart}
            onText={(value) => updateField("tenderPart", value)}
          />
        )}

        {step === "feeling" && (
          <ChoiceStep
            eyebrow="Feeling"
            title="What feeling is closest to the surface right now?"
            note="Many colors can exist at once. None of them make you wrong."
            options={feelings}
            selected={answers.feelings}
            onToggle={(value) => toggleList("feelings", value)}
            textLabel="The feeling I can name right now is:"
            textValue={answers.feelingWords}
            onText={(value) => updateField("feelingWords", value)}
          />
        )}

        {step === "body" && (
          <ChoiceStep
            eyebrow="Body signal"
            title="Where does your body still carry the signal?"
            note="You do not need to relive anything. Just notice what is present now."
            options={bodySignals}
            selected={answers.bodySignals}
            onToggle={(value) => toggleList("bodySignals", value)}
            textLabel="If this body signal could speak without explaining everything, it might say:"
            textValue={answers.bodyMessage}
            onText={(value) => updateField("bodyMessage", value)}
          />
        )}

        {step === "truth" && (
          <SingleChoiceStep
            eyebrow="Truth without revenge"
            title="What is one honest truth you can name without proving the whole story?"
            options={honestTruths}
            selected={answers.honestTruthChoice}
            onSelect={(value) => updateField("honestTruthChoice", value)}
            textLabel="One honest truth is:"
            textValue={answers.honestTruth}
            onText={(value) => updateField("honestTruth", value)}
          />
        )}

        {step === "value" && (
          <ChoiceStep
            eyebrow="What survived"
            title="What value in you survived the wrong?"
            options={survivedValues}
            selected={answers.survivedValues}
            onToggle={(value) => toggleList("survivedValues", value)}
            textLabel="Even after this, something in me still values:"
            textValue={answers.survivedValueWords}
            onText={(value) => updateField("survivedValueWords", value)}
          />
        )}

        {step === "burden" && (
          <BurdenStep
            answers={answers}
            toggleList={toggleList}
            updateField={updateField}
          />
        )}

        {step === "repair" && (
          <RepairStep
            answers={answers}
            toggleList={toggleList}
            toggleSafety={toggleRepairSafety}
          />
        )}

        {step === "path" && (
          <PathStep
            answers={answers}
            updateField={updateField}
            updatePathField={updatePathField}
          />
        )}

        {step === "words" && (
          <WordsStep
            answers={answers}
            toggleList={toggleList}
            updateField={updateField}
          />
        )}

        {step === "return" && (
          <ReturnStep answers={answers} updateField={updateField} />
        )}

        {step === "summary" && (
          <SummaryStep
            summary={summary}
            summaryText={summaryText}
            status={summaryStatus}
            onCopy={copySummary}
            onDownload={downloadSummary}
            onPrint={printSummary}
            onStartOver={startOver}
            onWelcome={returnWelcome}
            mode={mode}
          />
        )}

        {HEAVY_STEPS.has(step) && (
          <PauseReturnCard
            breathOpen={breathOpen}
            cycleKey={breathCycle}
            onBreathe={() => {
              setBreathOpen(true);
              setBreathCycle((current) => current + 1);
            }}
            onContinue={goNext}
            onExit={exitPractice}
          />
        )}

        {!["start", "exit", "ground", "summary"].includes(step) && (
          <footer className="nav-row">
            <button className="secondary-button" onClick={goBack} type="button">
              <ArrowLeft size={18} />
              Back
            </button>
            <button className="ghost-button" onClick={goNext} type="button">
              Skip
            </button>
            <button className="primary-button" onClick={goNext} type="button">
              {step === "return" ? "Create Summary" : "Next"}
              <ArrowRight size={18} />
            </button>
          </footer>
        )}
      </section>
    </main>
  );
}

function StartScreen({ hasSaved, onBegin, onResume, onLight, onExit }) {
  return (
    <section className="screen start-screen">
      <BrandHeader />
      <div className="product-kicker">A R.E.T.U.R.N.℠ Practice Tool from The Sovereign Source™</div>

      <div className="safety-panel">
        <Shield size={22} />
        <div>
          <h2>Start with agency.</h2>
          <p>
            This tool is for grounded reflection and repair discernment. It is
            not therapy, diagnosis, legal advice, emergency care, or a substitute
            for professional support.
          </p>
          <p>
            If you are in immediate danger or may harm yourself or someone else,
            call emergency services now. In the U.S. you can call or text 988 for
            crisis support.
          </p>
        </div>
      </div>

      <div className="action-grid">
        <button className="primary-button big" onClick={onBegin} type="button">
          Enter the grounding gate
          <ArrowRight size={18} />
        </button>
        <button className="secondary-button big" onClick={onLight} type="button">
          I need a lighter version
          <Sparkles size={18} />
        </button>
        {hasSaved && (
          <button className="ghost-button big" onClick={onResume} type="button">
            Resume saved reflection
          </button>
        )}
        <button className="ghost-button big" onClick={onExit} type="button">
          Exit and come back later
        </button>
      </div>
      <SafetyFooter />
    </section>
  );
}

function BrandHeader({ summary = false }) {
  const TitleTag = summary ? "h2" : "h1";

  return (
    <div className={summary ? "brand-header summary-brand-header" : "brand-header"}>
      <TitleTag className={summary ? "brand-title summary-title" : "brand-title"}>
        WRONG.<span className="service-mark">℠</span>
      </TitleTag>
      <p className="subtitle print-subtitle">{SUMMARY_SUBTITLE}</p>
      <p className="core">
        Truth without revenge. Compassion without self-abandonment. Gratitude
        without denial.
      </p>
    </div>
  );
}

function GroundingScreen({ mode, onContinue, onExit, onLight }) {
  return (
    <section className="screen">
      <div className="eyebrow">Ground before opening</div>
      <h2>Before we open the story, find the room.</h2>
      <p className="lead">
        Feel your feet.
        <br />
        Look around.
        <br />
        Name one thing you can see.
        <br />
        Take one slower breath.
      </p>
      <p className="lead">
        You do not have to tell the whole story. You do not have to prove
        anything here. You can pause, skip, or stop at any time.
      </p>
      <div className="action-grid grounding-actions">
        <button className="primary-button big" onClick={onContinue} type="button">
          I’m grounded enough to continue
          <ArrowRight size={18} />
        </button>
        {mode !== "light" && (
          <button className="secondary-button big" onClick={onLight} type="button">
            I need the lighter version
            <Sparkles size={18} />
          </button>
        )}
        <button className="ghost-button big" onClick={onExit} type="button">
          Not today. Take me back.
        </button>
      </div>
      <SafetyFooter />
    </section>
  );
}

function ExitScreen({ onStartOver, onWelcome }) {
  return (
    <section className="screen exit-screen">
      <div className="eyebrow">Exit / come back later</div>
      <h2>You do not have to finish this today.</h2>
      <p className="lead">
        Stopping is allowed. Pausing is allowed. Returning to yourself counts.
      </p>
      <div className="action-grid">
        <button className="secondary-button big" onClick={onStartOver} type="button">
          <RotateCcw size={18} />
          Start over
        </button>
        <button className="primary-button big" onClick={onWelcome} type="button">
          Return to welcome screen
          <ArrowRight size={18} />
        </button>
      </div>
      <SafetyFooter />
    </section>
  );
}

function SafetyFooter() {
  return (
    <footer className="safety-footer">
      <p>
        WRONG.℠ is a non-clinical reflection tool from The Sovereign Source™. It
        is not therapy, diagnosis, legal advice, or emergency care.
      </p>
      <p>
        This tool supports reflection. It is not emergency care. If you may hurt
        yourself or someone else, call emergency services or 988 in the U.S.
      </p>
    </footer>
  );
}

function ConsentScreen() {
  return (
    <section className="screen">
      <div className="eyebrow">Consent before reflection</div>
      <h2>Only open what you have enough support to touch.</h2>
      <p className="lead">
        You are in charge of the pace. No graphic details are needed. You can
        name one small piece, skip any prompt, pause, exit, or come back later.
      </p>
      <div className="safety-panel consent-panel">
        <Shield size={22} />
        <div>
          <h2>No activation without agency.</h2>
          <p>No truth without grounding. No opening without a return.</p>
          <p>
            Continue only if it feels okay to take the next small step. Stopping
            is a valid repair choice too.
          </p>
        </div>
      </div>
    </section>
  );
}

function ChoiceStep({
  eyebrow,
  title,
  note,
  options,
  selected,
  onToggle,
  textLabel,
  textValue,
  onText,
}) {
  return (
    <section className="screen">
      <div className="eyebrow">{eyebrow}</div>
      <h2>{title}</h2>
      {note && <p className="lead">{note}</p>}
      <ChipGrid options={options} selected={selected} onToggle={onToggle} />
      <Field label={textLabel} value={textValue} onChange={onText} />
    </section>
  );
}

function SingleChoiceStep({
  eyebrow,
  title,
  options,
  selected,
  onSelect,
  textLabel,
  textValue,
  onText,
}) {
  return (
    <section className="screen">
      <div className="eyebrow">{eyebrow}</div>
      <h2>{title}</h2>
      <div className="chip-grid">
        {options.map((option) => (
          <button
            className={`chip ${selected === option ? "selected" : ""}`}
            key={option}
            onClick={() => onSelect(option)}
            type="button"
          >
            {option}
          </button>
        ))}
      </div>
      <Field label={textLabel} value={textValue} onChange={onText} />
    </section>
  );
}

function BurdenStep({ answers, toggleList, updateField }) {
  return (
    <section className="screen">
      <div className="eyebrow">What is not mine to carry</div>
      <h2>Sort the burden without abandoning yourself.</h2>
      <div className="split-grid">
        <div>
          <h3>Mine to carry</h3>
          <ChipGrid
            options={mineToCarry}
            selected={answers.mineCarry}
            onToggle={(value) => toggleList("mineCarry", value)}
          />
        </div>
        <div>
          <h3>Not mine to carry</h3>
          <ChipGrid
            options={notMineToCarry}
            selected={answers.notMineCarry}
            onToggle={(value) => toggleList("notMineCarry", value)}
          />
        </div>
      </div>
      <Field
        label="What I can carry with dignity is:"
        value={answers.carryDignity}
        onChange={(value) => updateField("carryDignity", value)}
      />
      <Field
        label="What I am allowed to put down is:"
        value={answers.putDown}
        onChange={(value) => updateField("putDown", value)}
      />
    </section>
  );
}

function RepairStep({ answers, toggleList, toggleSafety }) {
  const checks = [
    "Am I safe enough to do this?",
    "Am I prepared for no response, denial, defensiveness, or blame?",
    "Am I trying to be heard, or trying to finally be rescued?",
    "Do I need support before I speak?",
    "Would silence, distance, documentation, or a boundary protect me better right now?",
  ];

  return (
    <section className="screen">
      <div className="eyebrow">Repair readiness</div>
      <h2>When you think about repair, what feels true right now?</h2>
      <p className="lead">This section does not push contact. Repair may begin and stay inside you.</p>
      <ChipGrid
        options={repairTruths}
        selected={answers.repairTruths}
        onToggle={(value) => toggleList("repairTruths", value)}
      />
      <div className="safety-check">
        <h3>Before contacting anyone, ask:</h3>
        {checks.map((check) => (
          <label className="check-row" key={check}>
            <input
              checked={Boolean(answers.repairSafety[check])}
              onChange={() => toggleSafety(check)}
              type="checkbox"
            />
            <span>{check}</span>
          </label>
        ))}
      </div>
    </section>
  );
}

function PathStep({ answers, updateField, updatePathField }) {
  const chosen = repairPaths.find((path) => path.value === answers.chosenPath);

  return (
    <section className="screen">
      <div className="eyebrow">Choose a repair path</div>
      <h2>What path protects dignity right now?</h2>
      <div className="path-grid">
        {repairPaths.map((path) => (
          <button
            className={`path-card ${answers.chosenPath === path.value ? "selected" : ""}`}
            key={path.value}
            onClick={() => updateField("chosenPath", path.value)}
            type="button"
          >
            <strong>{path.label}</strong>
            <span>{path.description}</span>
          </button>
        ))}
      </div>
      {chosen && (
        <div className="prompt-stack">
          {chosen.prompts.map((prompt) => (
            <Field
              key={prompt.key}
              label={prompt.label}
              value={answers.pathPrompts[prompt.key] ?? ""}
              onChange={(value) => updatePathField(prompt.key, value)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function WordsStep({ answers, toggleList, updateField }) {
  return (
    <section className="screen">
      <div className="eyebrow">Words without pleading</div>
      <h2>Choose any words you may want to keep.</h2>
      <p className="lead">
        These are optional. They are shaped to avoid pleading, attacking,
        overexplaining, diagnosing, collapsing, revenge, and forced forgiveness.
      </p>
      <ChipGrid
        options={languageStems}
        selected={answers.keptWords}
        onToggle={(value) => toggleList("keptWords", value)}
      />
      <Field
        label="My own words, if I want them:"
        value={answers.customWords}
        onChange={(value) => updateField("customWords", value)}
      />
    </section>
  );
}

function ReturnStep({ answers, updateField }) {
  return (
    <section className="screen">
      <div className="eyebrow">Return step</div>
      <h2>Return to yourself.</h2>
      <div className="return-copy">
        <p>You named something real.</p>
        <p>You do not have to solve the whole wound today.</p>
      </div>
      <h3>What would help you close this gently?</h3>
      <ChipGrid
        options={closingOptions}
        selected={answers.closingOptions ?? []}
        onToggle={(value) => {
          const existing = answers.closingOptions ?? [];
          const next = existing.includes(value)
            ? existing.filter((item) => item !== value)
            : [...existing, value];
          updateField("closingOptions", next);
        }}
      />
      <p className="lead">
        You do not have to carry what was never yours. You do not have to force
        repair before safety. Naming what was wrong is already a return to your
        moral center.
      </p>
      <Field
        label="One small way I can care for myself after naming this is:"
        value={answers.finalCare}
        onChange={(value) => updateField("finalCare", value)}
      />
    </section>
  );
}

function PauseReturnCard({ breathOpen, cycleKey, onBreathe, onContinue, onExit }) {
  return (
    <section className="pause-return-card">
      {!breathOpen ? (
        <>
          <div>
            <p className="pause-card-title">Pause here.</p>
            <p>
              Let your eyes look around the room. You are naming something. You
              are not back inside it.
            </p>
          </div>
          <div className="pause-card-actions">
            <button className="primary-button" onClick={onContinue} type="button">
              Continue
              <ArrowRight size={18} />
            </button>
            <button className="secondary-button" onClick={onBreathe} type="button">
              Take one breath with me
            </button>
            <button className="ghost-button" onClick={onExit} type="button">
              Pause / exit
            </button>
          </div>
        </>
      ) : (
        <div className="breath-experience">
          <SovereignSignalBreath key={cycleKey} />
          <div className="breath-copy">
            <div className="breath-phases" aria-label="Breath phases">
              <span>Inhale</span>
              <span>Hold softly</span>
              <span>Exhale</span>
              <span>Return</span>
            </div>
            <p>One breath is enough.</p>
            <p>You are here now.</p>
            <p>You are naming something. You are not back inside it.</p>
          </div>
          <div className="pause-card-actions">
            <button className="primary-button" onClick={onContinue} type="button">
              Continue
              <ArrowRight size={18} />
            </button>
            <button className="secondary-button" onClick={onBreathe} type="button">
              One more breath
            </button>
            <button className="ghost-button" onClick={onExit} type="button">
              Pause / exit
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function SovereignSignalBreath() {
  return (
    <div className="sovereign-signal-breath" aria-hidden="true">
      <div className="signal-ring ring-one" />
      <div className="signal-ring ring-two" />
      <div className="signal-ring ring-three" />
      <div className="signal-spectrum" />
      <div className="signal-core" />
    </div>
  );
}

function SummaryStep({
  summaryText,
  status,
  onCopy,
  onDownload,
  onPrint,
  onStartOver,
  onWelcome,
}) {
  return (
    <section className="screen summary-screen summary-print-area">
      <div className="print-header">
        <div className="eyebrow">Your reflection</div>
        <BrandHeader summary />
      </div>
      <pre className="summary-box">{summaryText}</pre>
      <div className="summary-actions no-print">
        <button className="primary-button" onClick={onCopy} type="button">
          <Copy size={18} />
          Copy Summary
        </button>
        <button className="secondary-button" onClick={onDownload} type="button">
          <Download size={18} />
          Download .txt
        </button>
        <button className="secondary-button" onClick={onPrint} type="button">
          <Printer size={18} />
          Print Summary
        </button>
        <button className="ghost-button" onClick={onStartOver} type="button">
          <RotateCcw size={18} />
          Start Over
        </button>
        <button className="ghost-button" onClick={onWelcome} type="button">
          Return to Welcome
        </button>
      </div>
      {status && <p className="summary-status no-print">{status}</p>}
      <SafetyFooter />
    </section>
  );
}

function ChipGrid({ options, selected, onToggle }) {
  return (
    <div className="chip-grid">
      {options.map((option) => (
        <button
          className={`chip ${selected.includes(option) ? "selected" : ""}`}
          key={option}
          onClick={() => onToggle(option)}
          type="button"
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <label className="field">
      <span>{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
      />
    </label>
  );
}

function joinList(items) {
  return items?.length ? items.join(", ") : "Not named yet";
}

function namedText(text) {
  return text?.trim() ? text.trim() : "Not named yet";
}

function fallbackCopyText(text) {
  let copiedWithEvent = false;
  const handleCopy = (event) => {
    event.clipboardData?.setData("text/plain", text);
    event.preventDefault();
    copiedWithEvent = true;
  };

  document.addEventListener("copy", handleCopy);
  const commandCopied = document.execCommand("copy");
  document.removeEventListener("copy", handleCopy);

  if (copiedWithEvent || commandCopied) {
    return true;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.left = "0";
  textarea.style.opacity = "0";
  textarea.style.pointerEvents = "none";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);
  const copied = document.execCommand("copy");
  document.body.removeChild(textarea);
  return copied;
}

function buildPathDetails(answers) {
  const chosen = repairPaths.find((path) => path.value === answers.chosenPath);
  if (!chosen) return "Not chosen yet";
  const details = chosen.prompts
    .map((prompt) => `${prompt.label} ${namedText(answers.pathPrompts[prompt.key])}`)
    .join("\n");
  return `${chosen.label}\n${details}`;
}

function buildDownloadText(summary) {
  const date = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `${SUMMARY_HEADER_TEXT}

Date: ${date}

${summary}

WRONG.℠ is a non-clinical reflection tool from The Sovereign Source™. It is not therapy, diagnosis, legal advice, or emergency care.

This tool supports reflection. It is not emergency care. If you may hurt yourself or someone else, call emergency services or 988 in the U.S.`;
}

function buildLightSummary(answers) {
  return `What kind of wrong was named:
${joinList(answers.wrongKinds)}
In my own words: ${namedText(answers.wrongWords)}

What felt violated:
${joinList(answers.violatedParts)}
The part that still feels tender: ${namedText(answers.tenderPart)}

One honest sentence:
${namedText(answers.honestTruth || answers.honestTruthChoice)}

Return to self:
What happened was wrong.
What survived in me still matters.
I can return to myself without denying the truth.

One small way I can care for myself after naming this:
${namedText(answers.finalCare)}

Truth without revenge.
Compassion without self-abandonment.
Gratitude without denial.`;
}

function buildSummary(answers) {
  const safetyChecks = Object.entries(answers.repairSafety)
    .filter(([, checked]) => checked)
    .map(([label]) => label);

  return `WRONG.℠ is a R.E.T.U.R.N.℠ practice tool from The Sovereign Source™.

What kind of wrong was named:
${joinList(answers.wrongKinds)}
In my own words: ${namedText(answers.wrongWords)}

Life area:
${joinList(answers.lifeAreas)}
The area of life this touched: ${namedText(answers.lifeAreaWords)}

What felt violated:
${joinList(answers.violatedParts)}
The part that still feels tender: ${namedText(answers.tenderPart)}

Feeling:
${joinList(answers.feelings)}
The feeling I can name right now: ${namedText(answers.feelingWords)}

Where my body carried the signal:
${joinList(answers.bodySignals)}
What the signal might say: ${namedText(answers.bodyMessage)}

One honest truth:
${namedText(answers.honestTruth || answers.honestTruthChoice)}

One value that survived:
${joinList(answers.survivedValues)}
Even after this, something in me still values: ${namedText(answers.survivedValueWords)}

What is mine to carry:
${joinList(answers.mineCarry)}
What I can carry with dignity: ${namedText(answers.carryDignity)}

What is not mine to carry:
${joinList(answers.notMineCarry)}
What I am allowed to put down: ${namedText(answers.putDown)}

What repair feels like right now:
${joinList(answers.repairTruths)}
Safety questions I noticed: ${joinList(safetyChecks)}

Chosen repair path:
${buildPathDetails(answers)}

Words I may want to keep:
${joinList(answers.keptWords)}
My own words: ${namedText(answers.customWords)}

One self-compassionate next step:
${namedText(answers.finalCare)}

Truth without revenge.
Compassion without self-abandonment.
Gratitude without denial.`;
}

createRoot(document.getElementById("root")).render(<App />);
