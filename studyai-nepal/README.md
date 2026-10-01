# StudyAI Nepal — AI Study Planner (V1)

This is a real, working version — the form actually calls Groq AI and generates
a genuine 7-day plan based on what the student types in. Same stack as your
expense tracker (FastAPI + Groq).

## Run it (5 minutes)

1. **Unzip this folder** anywhere, e.g. `C:\Users\vaska\Downloads\studyai-nepal`

2. **Open a terminal in that folder** (in VS Code: right-click the folder → "Open in Integrated Terminal")

3. **Install the requirements:**
   ```
   pip install -r requirements.txt
   ```

4. **Set your Groq API key** (the same one from your expense tracker project):

   Windows (PowerShell):
   ```
   $env:GROQ_API_KEY="your_key_here"
   ```
   Mac/Linux:
   ```
   export GROQ_API_KEY="your_key_here"
   ```

5. **Run the server:**
   ```
   python -m uvicorn app:app --reload
   ```

6. **Open your browser to:** http://localhost:8000

Fill the form, hit "Generate my study plan" — it calls Groq for real and shows
an AI-generated 7-day plan built from exactly what you typed.

## What's actually happening

- `static/index.html` — the page (form + results), plain HTML/CSS/JS, no build step
- `app.py` — FastAPI backend. `POST /plan` sends the student's answers to Groq
  with a master prompt that forces a structured 7-day plan back as JSON
- No database yet — nothing is saved between visits. That's fine for testing
  with your first 10 students.

## Next steps (per the build workflow doc)

1. Test this on 5-6 real chapters/subjects yourself first
2. Give the link to 5-10 real +2 students (Phase 4) — you'll need to deploy it
   somewhere they can reach (Render free tier works, say the word and I'll set
   that up next)
3. Track what confuses them / what they love
4. Only then think about adding a second tool (Chapter Explainer)
