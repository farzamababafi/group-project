from openai import OpenAI
from pathlib import Path
import os
from dotenv import load_dotenv
load_dotenv(dotenv_path=Path(__file__).resolve().parents[2] / ".env")
client = OpenAI(    
    api_key= os.getenv("LLM_API_KEY"),
    base_url=os.getenv("URL")
    )
SYSTEM_PROMPT = """
You are a financial analysis assistant used in a stock analytics platform.

Your task is to interpret quantitative metrics about a stock and generate a short, clear insight for users.

Rules:
- Use ONLY the metrics provided.
- Do NOT invent data or numbers.
- Explain what the metrics imply about the stock.
- Write in a professional but simple tone.
- Focus on risk, trend, and potential interpretation.
- Return a single concise paragraph suitable for display on a website.
"""
def get_recommendation(stock_name, start_date, end_date, metrics):
    prompt = f"""
    stock name: {stock_name}
    date range: {start_date} to {end_date}
    Stock metrics:
    Volatility: {metrics['volatility']}
    avg_log_return: {metrics['avg_log_return']}
    roi_ratio: {metrics['roi_ratio']}
    recovery_duration: {metrics['recovery_duration']}

    Provide a short insight about this stock based on these metrics.
    Explain what the numbers suggest about stability, risk, and possible behavior.
    """
    try:
        response = client.chat.completions.create(
            model=os.getenv("MODEL_NAME"),
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            temperature=0
        )

        return response.choices[0].message.content
    except Exception as e:
        print(f"Error getting recommendation: {e}")
        return "Sorry, I couldn't get a recommendation at this time."