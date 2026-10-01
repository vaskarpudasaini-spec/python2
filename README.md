# AI Expense Parser — Step 3

This is the API layer for the expense tracker.

## 1. Install Python
Use Python 3.11+.

## 2. Create a virtual environment
Windows:
`python -m venv .venv`
`.venv\Scripts\activate`

## 3. Install packages
`pip install -r requirements.txt`

## 4. Configure the API key
Copy `.env.example` to `.env` and put your OpenAI API key in it.

Never put the API key in Excel, JavaScript sent to a browser, GitHub, or a screenshot.

## 5. Start the API
`uvicorn app:app --reload --port 8000`

## 6. Test
Open:
`http://127.0.0.1:8000/docs`

Use POST `/parse`.

Example:
`{"text":"I spent Rs 450 on dinner today, paid by cash."}`

Expected structure:
- date
- time
- description
- category
- amount
- payment_method
- notes

## Next step
Step 4 will connect this endpoint to the spreadsheet/Google Sheets write operation.
