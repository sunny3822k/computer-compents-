import { useEffect, useState } from "react";
import {
  Activity, ArrowDown, ArrowRight, Check, ChevronDown, ChevronUp, CircuitBoard,
  Cpu, Fan, Gamepad2, Gauge, HardDrive, Layers3, Lightbulb, MemoryStick,
  Microchip, Monitor, MousePointerClick, Network, PackageCheck, Power,
  Refrigerator, RotateCcw, Server, ShieldCheck, Sparkles, Thermometer, Trophy, Zap,
} from "lucide-react";

const hardware = [
  { id: "cpu", name: "CPU", full: "Central Processing Unit", analogy: "Head chef", icon: Cpu, image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=900&q=80", summary: "Executes instructions and coordinates work across the system.", beginner: "The head chef reads the recipe, makes decisions, and directs the kitchen. A capable CPU can work through more instructions, and finish them faster.", tech: "Compare architecture, core and thread counts, single-core boost, cache, socket, and power limits. Parallel workloads scale across cores; many games still rely heavily on fast individual cores.", specs: [["Cores", "Physical processing units"], ["Threads", "Concurrent instruction lanes"], ["Clock", "Operating frequency in GHz"], ["Cache", "Fast on-chip memory"], ["Socket", "Must match the motherboard"]] },
  { id: "gpu", name: "GPU", full: "Graphics Processing Unit", analogy: "Visual design team", icon: Monitor, image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=900&q=80", summary: "Renders games, video, 3D scenes, and visual effects.", beginner: "While the CPU plans the meal, the GPU's design team creates thousands of visual details at once: textures, lighting, shadows, and pixels.", tech: "Performance depends on architecture, compute units, clock, VRAM capacity and bandwidth, ray-tracing hardware, and software features. Resolution and workload strongly affect results.", specs: [["VRAM", "Dedicated graphics memory"], ["Bandwidth", "Rate of memory transfer"], ["Ray tracing", "Hardware lighting simulation"], ["Upscaling", "Reconstructs a higher-res image"], ["Power", "Check connectors and PSU needs"]] },
  { id: "ram", name: "RAM", full: "Random Access Memory", analogy: "Kitchen counter", icon: MemoryStick, image: "https://images.unsplash.com/photo-1562976540-1502f75a6117?auto=format&fit=crop&w=900&q=80", summary: "Keeps active apps and data ready for immediate use.", beginner: "RAM is the counter where the chef keeps today's ingredients. A bigger counter holds more active work nearby; it clears when the kitchen shuts down.", tech: "Check capacity, DDR generation, data rate, timings, and channel configuration. DDR4 and DDR5 are incompatible standards; use the board manual's preferred slots for dual-channel kits.", specs: [["Capacity", "16 GB or more for many builds"], ["Generation", "DDR4 or DDR5"], ["Data rate", "Listed in MT/s"], ["Timings", "Latency values such as CL36"], ["Channels", "Install matched modules correctly"]] },
  { id: "board", name: "Motherboard", full: "Main Circuit Board", analogy: "Floor & wiring", icon: CircuitBoard, image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80", summary: "Connects components and determines platform compatibility.", beginner: "The floor, wiring, and plumbing of the kitchen: every station connects through it, and its layout determines what equipment can be installed.", tech: "Match CPU socket and memory generation. Then compare chipset, VRM design, PCIe and M.2 slots, rear I/O, networking, firmware features, and form factor.", specs: [["Socket", "Matches the processor"], ["Chipset", "Platform connectivity and features"], ["VRM", "Regulates CPU power"], ["PCIe", "Expansion device connection"], ["Form factor", "ATX, Micro-ATX, Mini-ITX"]] },
  { id: "storage", name: "Storage", full: "NVMe, SATA & HDD", analogy: "Fridge & pantry", icon: HardDrive, image: "", summary: "Stores your operating system, apps, games, and files long-term.", beginner: "The pantry keeps ingredients for later, even after closing time. The chef has to fetch them before cooking, so faster storage shortens loading and transfer waits.", tech: "NVMe drives use PCIe, usually in an M.2 slot. SATA SSDs use a cable interface. HDDs use spinning platters and are slower, but inexpensive for bulk storage.", specs: [["NVMe", "PCIe solid-state drive"], ["SATA SSD", "Flash drive using SATA"], ["HDD", "Magnetic spinning disk"], ["Performance", "Random and sequential speed"], ["Endurance", "Often specified as TBW"]] },
  { id: "psu", name: "PSU", full: "Power Supply Unit", analogy: "Power grid", icon: Power, image: "", summary: "Delivers stable, correctly rated power to every component.", beginner: "The kitchen's power grid feeds every appliance. Reliable power keeps the whole operation stable; the wattage label alone doesn't tell you build quality.", tech: "Size for sustained load and transient spikes. Verify GPU connectors, platform quality, protections, warranty, and efficiency. 80 PLUS describes efficiency, not overall quality.", specs: [["Wattage", "Rated maximum output"], ["Efficiency", "80 PLUS certification tier"], ["Connectors", "Match the GPU and board"], ["Modularity", "Detachable cable design"], ["Protections", "OCP, OVP, SCP, OTP, OPP"]] },
  { id: "cooling", name: "Cooling", full: "Airflow & Liquid Cooling", analogy: "Ventilation", icon: Fan, image: "", summary: "Moves heat out so components sustain their performance.", beginner: "Ventilation keeps the kitchen comfortable under pressure. If heat builds up, processors slow down to stay within safe limits.", tech: "Air coolers transfer heat through a heatsink and fan; AIOs add a pump, liquid loop, and radiator. Case airflow, fan curves, mounting, noise, and thermal limits all matter.", specs: [["Air cooler", "Heatsink and fan"], ["AIO", "Pump, loop, radiator"], ["Thermal paste", "Fills microscopic contact gaps"], ["Airflow", "Balanced intake and exhaust"], ["Noise", "Tune fans to your workload"]] },
];

const buildSteps = [
  ["01", "Set up", PackageCheck, "Clear a non-carpeted surface. Gather a screwdriver, the case screws, and the motherboard manual."],
  ["02", "Prepare the board", CircuitBoard, "Outside the case, install the CPU, RAM, M.2 drive, and cooler mounting hardware."],
  ["03", "Mount the board", Server, "Check standoffs, fit the I/O shield if separate, then secure the board without overtightening."],
  ["04", "Fit PSU & GPU", Zap, "Install the power supply and route CPU and 24-pin power. Seat the GPU in the primary PCIe slot."],
  ["05", "Connect & inspect", Network, "Attach front-panel, fan, storage, and power leads. Check every connection before first power-on."],
  ["06", "Boot & configure", Gauge, "Check firmware temperatures and detected parts, enable XMP or EXPO, then install the OS and drivers."],
];
const questions = [
  { q: "Which component is most like the kitchen counter?", options: ["RAM", "PSU", "GPU", "Storage"], answer: 0, why: "RAM is temporary working space for active applications and data." },
  { q: "What does an 80 PLUS Gold rating primarily describe?", options: ["Gaming performance", "Power supply efficiency", "CPU core count", "USB port count"], answer: 1, why: "It certifies power conversion efficiency, not every aspect of PSU quality." },
  { q: "What is a performance bottleneck?", options: ["A component limiting the workload", "A broken power cable", "A storage format", "A CPU socket type"], answer: 0, why: "A bottleneck is the part that cannot keep up with a specific task or the rest of the system." },
];
const nav = [["start", "Start here", Microchip], ["intuition", "01 / Core intuition", Lightbulb], ["components", "02 / Components", Layers3], ["build", "03 / Real-world use", Gamepad2], ["mastery", "04 / Mastery", Trophy]];
const reference = [["ATX", "Full-size desktop board with room for multiple expansion cards and memory modules."], ["Micro-ATX", "Shorter board that keeps useful expansion options for more compact cases."], ["Mini-ITX", "Compact format for small systems, with fewer slots and tighter build space."], ["PCIe", "High-speed expansion connection for graphics, capture, network, and storage cards."], ["M.2", "A compact drive format. M.2 devices can use either NVMe/PCIe or SATA."], ["DIMM", "Desktop memory slot. The motherboard manual shows the best paired slots."]];

function SectionTitle({ tag, title, text }) {
  return <div className="section-title"><div className="eyebrow"><Sparkles size={15} />{tag}</div><h2>{title}</h2><p>{text}</p></div>;
}

function HardwareImage({ part, index }) {
  const [failed, setFailed] = useState(false);
  const Icon = part.icon;
  return <div className="hardware-image">{part.image && !failed ? <img src={part.image} alt={`${part.name} component`} loading="lazy" onError={() => setFailed(true)} /> : <div className="image-fallback"><Icon size={35}/></div>}<span className="image-number mono">PART / 0{index + 1}</span></div>;
}

function App() {
  const [mode, setMode] = useState("beginner");
  const [active, setActive] = useState("cpu");
  const [progress, setProgress] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [cheatsheet, setCheatsheet] = useState(false);
  const selected = hardware.find((part) => part.id === active) ?? hardware[0];
  const SelectedIcon = selected.icon;

  useEffect(() => {
    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0);
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  function jumpTo(id) { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); }
  function answerQuiz(index) {
    if (quizAnswer !== null) return;
    setQuizAnswer(index);
    if (index === questions[quizIndex].answer) setScore((value) => value + 1);
  }
  function nextQuestion() {
    if (quizIndex === questions.length - 1) setFinished(true);
    else { setQuizIndex((value) => value + 1); setQuizAnswer(null); }
  }
  function resetQuiz() { setQuizIndex(0); setQuizAnswer(null); setScore(0); setFinished(false); }

  return <div className="app-shell page-grid">
    <div className="progress-track" aria-label={`Page progress ${Math.round(progress)} percent`}><span style={{ width: `${progress}%` }} /></div>
    <header className="topbar"><button className="brand" onClick={() => jumpTo("start")} aria-label="Hardware Forge home"><span className="brand-mark"><Microchip size={22} /></span><span><b>HARDWARE FORGE</b><small>PC BUILDING ACADEMY</small></span></button><div className="top-progress mono"><Activity size={15} />{Math.round(progress)}% EXPLORED</div><button className="mobile-nav-button" onClick={() => jumpTo("components")} aria-label="Jump to components"><Layers3 size={19} /></button></header>
    <div className="layout">
      <aside className="sidebar"><div className="side-label">LEARNING PATH</div><nav>{nav.map(([id, label, Icon], index) => <button key={id} onClick={() => jumpTo(id)} className="nav-item"><span className="nav-index">0{index + 1}</span><Icon size={16} />{label.replace(/^\d\d \/ /, "")}</button>)}</nav><div className="side-label component-label">COMPONENTS</div><nav>{hardware.map(({ id, name, icon: Icon }) => <button key={id} onClick={() => { setActive(id); jumpTo("components"); }} className={`nav-item component-nav ${active === id ? "is-active" : ""}`}><Icon size={16} />{name}</button>)}</nav><div className="side-note"><span className="status-dot"/>SYSTEM GUIDE / V1.0</div></aside>
      <main>
        <section id="start" className="hero hero-image"><div className="hero-copy reveal"><div className="hero-kicker mono"><span className="status-dot"/>INTERACTIVE HARDWARE CURRICULUM</div><h1>Build your PC.<br/><em>Know every part.</em></h1><p>Understand what is inside your computer, how the pieces work together, and how to build a system you can trust.</p><div className="hero-actions"><button className="button button-lime" onClick={() => jumpTo("intuition")}>Start learning <ArrowRight size={16}/></button><button className="button button-quiet" onClick={() => jumpTo("components")}>Explore hardware <ArrowDown size={16}/></button></div><div className="hero-stats"><div><strong>04</strong><span>LEARNING LEVELS</span></div><div><strong>07</strong><span>CORE COMPONENTS</span></div><div><strong>03</strong><span>KNOWLEDGE CHECKS</span></div></div></div><div className="hero-coordinate mono">HF / 001<br/>45° 31' 12.0" N</div></section>

        <section id="intuition" className="section"><SectionTitle tag="LEVEL 01 / THE CORE INTUITION" title="Think of it as a kitchen." text="A useful mental model comes before the spec sheet. Each component has a distinct role, and the kitchen analogy makes those roles stick."/><div className="analogy-grid">{[[Cpu,"CPU","Head chef","Makes decisions and executes instructions."],[MemoryStick,"RAM","Kitchen counter","Keeps active work close at hand."],[Refrigerator,"Storage","Fridge & pantry","Keeps files when power is off."],[CircuitBoard,"Motherboard","Floor & wiring","Connects every station together."],[Power,"PSU","Power grid","Delivers stable electricity."]].map(([Icon,name,analogy,copy],i)=><article className="analogy-item" key={name}><div className="analogy-top mono">0{i+1} <Icon size={19}/></div><span>{name}</span><h3>{analogy}</h3><p>{copy}</p></article>)}</div></section>

        <section id="components" className="section components-section"><SectionTitle tag="LEVEL 02 / MECHANICS & BUILDING BLOCKS" title="Meet the components." text="Choose a part to see how it works. Switch between a plain-language explanation and the underlying specs whenever you are ready."/><div className="mode-bar"><div><b>EXPLANATION MODE</b><small>{mode === "beginner" ? "Analogies and plain-language explanations" : "Specifications, standards, and engineering detail"}</small></div><div className="segmented" role="group" aria-label="Explanation mode"><button aria-pressed={mode === "beginner"} className={mode === "beginner" ? "selected" : ""} onClick={() => setMode("beginner")}>Kitchen</button><button aria-pressed={mode === "tech"} className={mode === "tech" ? "selected" : ""} onClick={() => setMode("tech")}>Technical</button></div></div>
          <div className="hardware-grid">{hardware.map((part, i) => { const Icon = part.icon; return <button key={part.id} onClick={() => setActive(part.id)} className={`hardware-card ${active === part.id ? "card-active" : ""}`}><HardwareImage part={part} index={i} /><div className="hardware-card-copy"><span className="part-analogy">{part.analogy}</span><div className="part-title"><h3>{part.name}</h3><Icon size={19}/></div><p>{part.summary}</p></div></button>; })}</div>
          <div className="focus-panel"><div className="focus-main"><div className="focus-tag mono"><SelectedIcon size={18}/> SELECTED COMPONENT</div><h3>{selected.name}</h3><div className="focus-full">{selected.full}</div><p>{mode === "beginner" ? selected.beginner : selected.tech}</p></div><div className="focus-detail"><div className="focus-detail-title">{mode === "beginner" ? <><Lightbulb size={17}/>KEEP IN MIND</> : <><Gauge size={17}/>SPECIFICATION MAP</>}</div>{mode === "beginner" ? <div className="remember-box">The {selected.name} is the kitchen's <b>{selected.analogy.toLowerCase()}</b>. Connect its name to its role, then explore the technical details when you're ready.</div> : <div className="spec-list">{selected.specs.map(([term, description])=><div key={term}><b>{term}</b><span>{description}</span></div>)}</div>}</div></div>
        </section>

        <section id="build" className="section"><SectionTitle tag="LEVEL 03 / REAL-WORLD APPLICATION" title="Performance is a team sport." text="There is no single speed number for a PC. A system's experience depends on how its parts share work, move data, and keep pace with a particular task."/><div className="application-grid"><article className="bottleneck-panel"><div className="panel-heading"><Gauge size={21}/><h3>When parts fall out of sync</h3></div><p>A bottleneck is the component that limits the work the rest of the system could finish. It changes with the task: a game can be GPU-limited at 4K, CPU-limited at high frame rates, or memory-limited with many apps open.</p><div className="example-box"><span className="mono">CASE STUDY / 01</span><b>RTX 4090 + older Core i3</b><p>The GPU may wait for the CPU to prepare game logic and draw calls. The graphics card is fine, but the system cannot consistently feed it work.</p></div><div className="chip-row">{["Resolution", "Frame-rate target", "Game engine", "Workload"].map((item)=><span key={item}>{item}</span>)}</div></article><article className="journey-panel"><div className="panel-heading"><MousePointerClick size={21}/><h3>Follow the data</h3></div>{[["Storage", "Loads your app or game."],["RAM", "Keeps active data nearby."],["CPU", "Processes instructions and logic."],["GPU", "Renders the visual output."],["Display", "Presents the finished frame."]].map(([title,text],i)=><div className="journey-step" key={title}><span className="step-num mono">0{i+1}</span><div><b>{title}</b><small>{text}</small></div>{i<4&&<ArrowDown size={14}/>}</div>)}</article></div><div className="build-title"><div className="eyebrow"><PackageCheck size={15}/>BUILD WORKFLOW</div><h3>From loose parts to first boot.</h3></div><div className="build-grid">{buildSteps.map(([number,title,Icon,text])=><article className="build-step" key={number}><div className="build-step-top"><span className="mono">{number}</span><Icon size={19}/></div><h4>{title}</h4><p>{text}</p></article>)}</div></section>

        <section id="mastery" className="section mastery-section"><SectionTitle tag="LEVEL 04 / MASTERY & THE PRO ROADMAP" title="Build it right. Then make it yours." text="Good habits turn a PC that merely boots into one that is stable, cool, quiet, and easy to maintain."/><div className="mastery-grid">{[[Thermometer,"Thermal paste","Use a small amount unless the cooler maker specifies otherwise. Mounting pressure spreads it across microscopic surface gaps."],[Gauge,"XMP & EXPO","Compatible memory profiles enable advertised speeds instead of conservative defaults. Check the board and processor support."],[Zap,"Overclocking","Change one setting at a time, monitor temperatures, and test stability before relying on the system."],[ShieldCheck,"Avoid common mistakes","Check RAM slots in the manual, remove cooler protective film, verify CPU power, and handle socket pins carefully."]].map(([Icon,title,text])=><article className="mastery-item" key={title}><div className="mastery-icon"><Icon size={19}/></div><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
          <div className="quiz"><div className="quiz-header"><div><div className="eyebrow"><Sparkles size={15}/>KNOWLEDGE CHECK</div><h3>Ready to run the kitchen?</h3></div><div className="quiz-count mono">{finished ? `${score} / ${questions.length} CORRECT` : `QUESTION 0${quizIndex+1} / 0${questions.length}`}</div></div>{finished ? <div className="quiz-result"><Trophy size={33}/><div><h4>{score === questions.length ? "All systems go." : "A solid start."}</h4><p>You scored {score} out of {questions.length}. Review a component card and take another run whenever you like.</p></div><button className="icon-button" onClick={resetQuiz} aria-label="Retake quiz" title="Retake quiz"><RotateCcw size={18}/></button></div> : <><h4 className="question">{questions[quizIndex].q}</h4><div className="answer-grid">{questions[quizIndex].options.map((option,i)=>{const correct=questions[quizIndex].answer===i;const chosen=quizAnswer===i;return <button key={option} disabled={quizAnswer!==null} onClick={()=>answerQuiz(i)} className={`answer ${quizAnswer!==null&&correct?"answer-correct":""} ${chosen&&!correct?"answer-wrong":""}`}>{option}{quizAnswer!==null&&correct&&<Check size={17}/>}</button>;})}</div>{quizAnswer!==null&&<div className="quiz-feedback"><p>{questions[quizIndex].why}</p><button className="button button-lime" onClick={nextQuestion}>{quizIndex===questions.length-1?"See result":"Next question"}<ArrowRight size={15}/></button></div>}</>}</div>
        </section>

        <section className="reference-section"><button className="reference-toggle" onClick={()=>setCheatsheet((open)=>!open)} aria-expanded={cheatsheet}><span><span className="eyebrow">QUICK REFERENCE</span><b>Form factors & slot types</b></span>{cheatsheet?<ChevronUp size={20}/>:<ChevronDown size={20}/>}</button>{cheatsheet&&<div className="reference-grid">{reference.map(([term,description])=><article key={term}><h3>{term}</h3><p>{description}</p></article>)}</div>}</section>
        <footer className="footer"><span>HARDWARE FORGE</span><span>LEARN THE PARTS / UNDERSTAND THE SYSTEM / BUILD WITH CONFIDENCE</span><button onClick={()=>jumpTo("start")} aria-label="Back to top" title="Back to top"><ArrowDown size={16}/></button></footer>
      </main>
    </div>
  </div>;
}

export default App;
