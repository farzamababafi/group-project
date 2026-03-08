from openai import OpenAI
import os
from dotenv import load_dotenv
load_dotenv()
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
def get_recommendation(user_profile: str = "", top_k: int = 1):
   # prompt = f"""
   # Stock metrics:
   # Volatility: {volatility}
    #Momentum: {momentum}
    #Trend strength: {trend_strength}
    #Average return: {avg_return}
    #Sharpe ratio: {sharpe_ratio}

   # Provide a short insight about this stock based on these metrics.
   #Explain what the numbers suggest about stability, risk, and possible behavior.
   # """
    try:
        response = client.chat.completions.create(
            model=os.getenv("MODEL_NAME"),
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": "hi"}
            ],
            temperature=0
        )

        return response.choices[0].message.content
    except Exception as e:
        print(f"Error getting recommendation: {e}")
        return "Sorry, I couldn't get a recommendation at this time."