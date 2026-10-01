import os
import json
from datetime import datetime
from typing import Literal, Optional
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field, ValidationError
from openai import OpenAI

app = FastAPI(title="AI Expense Parser API", version="1.0.0")

class Expense(BaseModel):
    date: str = Field(description="Expense date in YYYY-MM-DD format.")
    time: str = Field(description="Expense time in HH:MM 24-hour format.")
    description: str
    category: Literal[
        "Food", "Transport", "Shopping", "Bills", "Entertainment",
        "Health", "Travel", "Office", "Education", "Groceries", "Other"
    ]
    amount: float = Field(gt=0)
    payment_method: Literal["Cash", "Card", "Bank Transfer", "Mobile Wallet", "Other"]
    notes: str = ""

class ParseRequest(BaseModel):
    text: str = Field(min_length=1)
    now: Optional[str] = None

SYSTEM_PROMPT = """You are an expense-entry parser.
Convert the user's natural-language expense into JSON matching this exact schema:

{
  "date": "YYYY-MM-DD",
  "time": "HH:MM (24-hour)",
  "description": "short string",
  "category": "one of: Food, Transport, Shopping, Bills, Entertainment, Health, Travel, Office, Education, Groceries, Other",
  "amount": number,
  "payment_method": "one of: Cash, Card, Bank Transfer, Mobile Wallet, Other",
  "notes": "string, can be empty"
}

Rules:
- Never invent an amount. If no amount is present, put 0.
- If date is absent, use the supplied current date.
- If time is absent, use the supplied current time.
- Understand English, Nepali, and mixed Nepali-English.
- eSewa, Khalti, mobile wallet, QR wallet -> Mobile Wallet.
- Cash -> Cash; card/credit/debit -> Card; bank transfer -> Bank Transfer.
- Choose the closest category from the allowed list.
- Keep description short and useful.
- Put location or extra context in notes.
- Respond with ONLY the JSON object. No markdown, no explanation, no code fences.
"""

@app.get("/health")
def health():
    return {"ok": True}

@app.post("/parse", response_model=Expense)
def parse_expense(req: ParseRequest):
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY is not configured.")

    now = req.now or datetime.now().isoformat(timespec="minutes")
    client = OpenAI(api_key=api_key, base_url="https://api.groq.com/openai/v1")

    try:
        response = client.chat.completions.create(
            model=os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile"),
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"Current date/time: {now}\nExpense: {req.text}"}
            ],
            response_format={"type": "json_object"},
            temperature=0,
        )
        raw = response.choices[0].message.content
        data = json.loads(raw)
        return Expense(**data)
    except HTTPException:
        raise
    except (json.JSONDecodeError, ValidationError) as exc:
        raise HTTPException(status_code=422, detail=f"AI could not parse the expense: {exc}")
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"AI parsing failed: {exc}")
