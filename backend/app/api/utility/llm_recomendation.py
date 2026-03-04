from openai import OpenAI


client = OpenAI()
SYSTEM_PROMPT = """
You are a recommendation engine.
Return a paragraph so i can use it in my website 
"""
def get_recommendation(user_profile: str = "", top_k: int = 1):
#    prompt = f"""User profile:{user_profile}Return top {top_k} recommendations.
#"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": "hi"}
        ],
        temperature=0
    )

    return response.choices[0].message.content