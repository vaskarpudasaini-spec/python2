import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from groq import Groq

from syllabus import build_syllabus_context, get_wrong_level_chapters

app = FastAPI(title="StudyAI Nepal")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Groq client — set your key as an environment variable before running:
#   Windows (PowerShell):  $env:GROQ_API_KEY="your_key_here"
#   Mac/Linux:              export GROQ_API_KEY="your_key_here"
MODEL = "openai/gpt-oss-120b"


def get_client() -> Groq:
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="GROQ_API_KEY is not set. Set it as an environment variable before running the server.",
        )
    return Groq(api_key=api_key)

SYSTEM_PROMPT = """You are StudyAI Nepal, an AI study coach built specifically for Nepali +2 (NEB) students.

You will receive a student's class/stream, subjects, exam date, daily study hours, confidence
per subject, completed chapters, weak topics, biggest study problem, target grade, and language
preference.

HARD RULES — the most common failure mode is ignoring the student's actual input and generating
a generic curriculum walkthrough instead. Do not do that.

1. ONLY use topics the student actually named in "subjects", "weak topics", or "completed
   chapters". Never introduce a chapter or topic the student did not mention. If they wrote
   "Mechanics, Organic Chemistry" as weak topics, the plan must be about Mechanics and Organic
   Chemistry — not Electric Charges, not Current Electricity, not any other chapter you picked
   because it's commonly taught after Mechanics.
1b. If an "Official NEB syllabus chapters" reference block is provided below, treat it as the
   ONLY valid source of real chapter names for that subject. When the student's weak topic is
   vague ("Mechanics"), you may name the specific real sub-chapters from that block that fall
   under it — but never name a chapter that isn't in the block. If no reference block is given
   for a subject the student mentioned, do NOT invent specific chapter names for it — use
   general skill-based language instead (e.g. "review your weakest Biology topic") rather than
   guessing a syllabus you were not given.
2. Cover EVERY subject the student listed in "subjects" that also has a weak topic listed. This
   is a hard requirement, not a suggestion: if the student names 2 subjects with weak topics,
   the 7 days MUST include both — never spend all 7 days on a single subject. As a default,
   split roughly evenly (e.g. 2 subjects → ~3-4 days each) unless the stated confidence gap
   between subjects is large, in which case shift 1-2 extra days toward the weaker one. Before
   finalizing, count how many days you gave each subject — if one subject got 0 days despite
   having a stated weak topic, that is a failure and you must redo the plan.
2b. NEVER mention NCERT, CBSE, or any Indian textbook/board. This is for Nepali students under
   NEB (National Examination Board, Nepal) — refer to "your textbook" or the chapter name
   itself, never a specific board or publisher you were not told about.
3. Order topics by the student's stated confidence — lowest confidence first, regardless of
   what a "logical" chapter sequence would be.
4. Directly address their stated "biggest study problem" in your approach. If they said "I
   forget what I study," build in active recall / spaced repetition style tasks. If "I don't
   practice enough," weight days toward problem-solving over reading. If "I don't know what to
   study first," make day 1 explicitly a triage/prioritization task.
5. Each day must be realistic for the number of study hours the student actually has.
6. Use simple, direct language a +2 student in Nepal will immediately understand.
7. If the student's preferred language is "Nepali", write mostly in Nepali (Devanagari or
   Romanized Nepali is fine). If "Mixed", blend English technical terms with Nepali explanation
   naturally, the way Nepali students actually study. If "English", use English only.
8. Do not invent chapter numbers, page numbers, or textbook-specific facts you were not given —
   stay specific to what the student told you, not to an assumed textbook structure.
9. Keep it motivating but honest — no empty hype, no filler days.

Before writing the plan, silently check: does every day reference something the student actually
typed (a subject they listed, a weak topic they named, or their stated problem)? If a day doesn't
trace back to their input, rewrite it.

Return ONLY valid JSON, no markdown fences, no preamble, in exactly this shape:
{
  "summary": "1-2 sentence diagnosis of where this student stands",
  "critical_focus": "the single topic/area to attack first, in plain words",
  "days": [
    {"day": 1, "focus": "short label", "task": "what to actually do", "minutes": 90}
  ],
  "todays_mission": "one concrete, specific action to start right now, doable in under an hour"
}
"days" must have exactly 7 entries.
"""


class PlanRequest(BaseModel):
    classLevel: str
    stream: str
    subjects: str
    examDate: str
    hours: str
    confidence: str
    completed: str = ""
    weakTopics: str = ""
    problem: str
    target: str
    language: str = "Mixed"


def _call_ai(client: Groq, messages: list) -> dict:
    """Call Groq and parse the response into a plan dict."""
    completion = client.chat.completions.create(
        model=MODEL,
        messages=messages,
        temperature=0.6,
        max_tokens=1500,
    )
    raw = completion.choices[0].message.content.strip()

    if raw.startswith("```"):
        raw = raw.strip("`")
        if raw.lower().startswith("json"):
            raw = raw[4:]
        raw = raw.strip()

    return json.loads(raw)


def _validate_plan(plan: dict, weak_topics: str, wrong_level_chapters: set[str]) -> list[str]:
    """Return a list of problems found in the plan, or [] if it looks good."""
    problems = []
    plan_text = json.dumps(plan).lower()

    for topic in [t.strip() for t in weak_topics.split(",") if t.strip()]:
        key = topic.lower()
        first_word = key.split()[0] if key.split() else key
        if key not in plan_text and first_word not in plan_text:
            problems.append(f'the plan never mentions the weak topic "{topic}"')

    for banned in ("ncert", "cbse"):
        if banned in plan_text:
            problems.append(f'the plan mentions "{banned}" which is not a NEB textbook/board')

    for wrong_chapter in wrong_level_chapters:
        if wrong_chapter and wrong_chapter in plan_text:
            problems.append(
                f'the plan uses "{wrong_chapter}", which is a DIFFERENT class level\'s chapter, not this student\'s'
            )

    return problems


@app.post("/plan")
def generate_plan(req: PlanRequest):
    client = get_client()

    syllabus_context = build_syllabus_context(req.classLevel, req.subjects)
    wrong_level_chapters = get_wrong_level_chapters(req.classLevel, req.subjects)

    user_content = f"""
Class/Stream: {req.classLevel}, {req.stream}
Subjects: {req.subjects}
Exam date: {req.examDate}
Study hours per day: {req.hours}
Confidence per subject: {req.confidence}
Completed chapters: {req.completed or "not specified"}
Weak topics: {req.weakTopics or "not specified"}
Biggest study problem: {req.problem}
Target grade: {req.target}
Preferred language: {req.language}

{syllabus_context if syllabus_context else "(No official syllabus reference available for these subjects yet — use general skill-based language, do not invent specific chapter names.)"}
"""

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": user_content},
    ]

    try:
        plan = _call_ai(client, messages)

        # Check the plan against hard requirements. If it fails, give the AI one
        # more attempt with the exact problems spelled out — this is what actually
        # fixes issues the prompt alone doesn't reliably prevent.
        problems = _validate_plan(plan, req.weakTopics, wrong_level_chapters)
        if problems:
            correction = (
                "Your previous plan had real problems — fix ALL of them in this rewrite:\n"
                + "\n".join(f"- {p}" for p in problems)
                + "\n\nRewrite the full 7-day plan from scratch, following the same JSON format, "
                "with every problem above corrected."
            )
            messages.append({"role": "assistant", "content": json.dumps(plan)})
            messages.append({"role": "user", "content": correction})
            plan = _call_ai(client, messages)

        return plan

    except json.JSONDecodeError:
        raise HTTPException(status_code=502, detail="AI returned an unexpected format. Try again.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI request failed: {str(e)}")


# Serve the frontend
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
def serve_index():
    return FileResponse("static/index.html")