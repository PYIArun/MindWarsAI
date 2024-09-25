from langchain_community.vectorstores import Chroma
from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from langchain_google_genai import ChatGoogleGenerativeAI
from educhain import Educhain, LLMConfig
from dotenv import load_dotenv
import os
import uuid
from datetime import datetime, timedelta

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# MongoDB configuration (replace with your MongoDB Atlas URI)
app.config["MONGO_URI"] = os.getenv("MONGO_URI")
mongo = PyMongo(app)

# Set up Educhain and the Gemini model
gemini_flash = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash-exp-0827",
    google_api_key=os.getenv("GOOGLE_API_KEY")
)
flash_config = LLMConfig(custom_model=gemini_flash)
educhain_client = Educhain(flash_config)

@app.route('/api/create_battle', methods=['POST'])
def create_battle():
    try:
        data = request.get_json()
        
        # Extract battle data from frontend
        battle_name = data['battleName']
        battle_description = data['battleDescription']
        num_questions = data['numQuestions']
        time_limit = data['timeLimit']
        difficulty = data['difficulty']
        creator_username = data['creatorUsername']
        deadline_hours = data['deadline']

        # Generate AI-powered questions using Educhain
        quiz_questions = educhain_client.qna_engine.generate_questions(
            topic=battle_name,
            num=num_questions
        ).get('questions')  # Assuming 'questions' is a key in the response

        # Create a unique ID and store quiz details
        quiz_id = str(uuid.uuid4())
        created_at = datetime.utcnow()
        deadline = created_at + timedelta(hours=int(deadline_hours))
        
        quiz_data = {
            "quiz_id": quiz_id,
            "quiz_name": battle_name,
            "quiz_description": battle_description,
            "num_of_questions": num_questions,
            "time_limit": f"{time_limit} min",
            "difficulty": difficulty,
            "created_at": created_at,
            "creator_username": creator_username,
            "deadline": deadline,
            "questions": quiz_questions,  # Storing the AI-generated questions
            "users_attempted": []
        }

        # Insert quiz data into MongoDB
        mongo.db.quiz_collection.insert_one(quiz_data)

        # Return the quiz ID to the frontend
        return jsonify({"battle_id": quiz_id}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Endpoint to fetch quiz for a contest
@app.route('/fetch_quiz/<quiz_id>', methods=['GET'])
def fetch_quiz(quiz_id):
    quiz = quiz_collection.find_one({"QuizId": quiz_id})
    if quiz:
        return jsonify(quiz), 200
    else:
        return jsonify({"error": "Quiz not found"}), 404

# Endpoint to submit quiz attempt
@app.route('/submit_quiz', methods=['POST'])
def submit_quiz():
    data = request.get_json()
    quiz_id = data.get('quiz_id')
    username = data.get('username')
    score = data.get('score')
    time_completion = data.get('time_completion')

    quiz = quiz_collection.find_one({"QuizId": quiz_id})

    if quiz:
        user_attempt = {
            "Username": username,
            "Score": score,
            "TimeCompletion": time_completion,
            "HasPlayed": True
        }
        quiz_collection.update_one(
            {"QuizId": quiz_id},
            {"$push": {"UsersAttempted": user_attempt}}
        )
        return jsonify({"message": "Quiz attempt submitted successfully"}), 200
    else:
        return jsonify({"error": "Quiz not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)
