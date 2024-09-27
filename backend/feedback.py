import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")
response = model.generate_content("The learner completed a quiz on the topic of Napolean and scored 5 out of 15. Based on this score, provide a brief feedback summary and a personalized learning path with 2-3 key resources (links to articles, videos, or exercises) to improve their knowledge. The response should only include the following: A concise feedback message, and a learning path with a list of URLs.")
print(response.text)