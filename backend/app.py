from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
import bcrypt
import jwt
import datetime
from bson import ObjectId
import uuid
from threading import Timer
from dotenv import load_dotenv
import os
from datetime import datetime, timedelta
load_dotenv()

# generating ai libraries
from langchain_community.vectorstores import Chroma
from langchain_google_genai import ChatGoogleGenerativeAI
from educhain import Educhain, LLMConfig


app = Flask(__name__)
CORS(app)

# Your MongoDB URI
app.config["MONGO_URI"] = os.getenv("MONGO_URI")
mongo = PyMongo(app)

# Secret key for JWT encoding/decoding
SECRET_KEY = 'THEREISAKINGINSIDE'  # Replace with a strong secret key

# Set up Educhain and the Gemini model
gemini_flash = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash-exp-0827",
    google_api_key=os.getenv("GOOGLE_API_KEY")
)
flash_config = LLMConfig(custom_model=gemini_flash)
educhain_client = Educhain(flash_config)


@app.route('/signup', methods=['POST'])
def signup():
    username = request.json['username']
    email = request.json['email']
    password = request.json['password']
    
    # Hash the password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    
    # Insert the new user into the database
    mongo.db.users.insert_one({
        'username': username,
        'email': email,
        'password': hashed_password.decode('utf-8')
    })
    return jsonify({"message": "User registered successfully"}), 201


@app.route('/login', methods=['POST'])
def login():
    identifier = request.json['identifier']  # Can be username or email
    password = request.json['password']
    
    # Find user by username or email
    user = mongo.db.users.find_one({'$or': [{'username': identifier}, {'email': identifier}]})
    
    if user and bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
        # Create a JWT token
        token = jwt.encode({
            'user_id': str(user['_id']),
            'username': user['username'],
        }, SECRET_KEY, algorithm='HS256')

        return jsonify({"message": "Login successful", "token": token, "username": user['username']}), 200
    
    return jsonify({"message": "Invalid credentials"}), 401

# Optional: Middleware to protect certain routes
@app.route('/protected', methods=['GET'])
def protected():
    token = request.headers.get('Authorization')  # Expecting token in Authorization header
    if not token:
        return jsonify({"message": "Token is missing!"}), 401

    try:
        data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return jsonify({"message": "Protected content", "user_id": data['user_id'], "username": data['username']})
    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token has expired!"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Invalid token!"}), 401

@app.route('/api/battles', methods=['GET'])
def get_battles():
    try:
        battles = mongo.db.quizzes.find()  # or your correct collection name
        battle_list = []
        for battle in battles:
            battle_list.append({
                "id" : battle.get("quiz_id"),
                "title": battle.get("quiz_name"),
                "description": battle.get("quiz_description"),
                "num_questions": battle.get("num_of_questions"),
                "time": battle.get("time_limit"),
                "username": battle.get("creator_username"),
                "deadline": battle.get("deadline"),
            })
        return jsonify(battle_list)
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500  # Return a more descriptive error message

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

       
        print("Hello hello x1")
        # Generate AI-powered questions using Educhain
        quiz_questions = educhain_client.qna_engine.generate_questions(
            topic=battle_name,
            num=num_questions,

        )
        # print(quiz_questions)
        print("Hello hello x2")
        print(vars(quiz_questions)) 
        print(type(quiz_questions))
        print("Hello hello x2")
        # Create a unique ID and store quiz details
        quiz_id = str(uuid.uuid4())
        created_at = datetime.utcnow()
        deadline = created_at + timedelta(hours=int(deadline_hours))
        

        quiz_data = {
            "quiz_id": quiz_id,
            "quiz_name": battle_name,
            "quiz_description": battle_description,
            "num_of_questions": num_questions,
            "time_limit": time_limit,
            "difficulty": difficulty,
            "created_at": created_at,
            "creator_username": creator_username,
            "deadline": deadline,
            "questions": [],  # Initialize as a list for structured data
            "users_attempted": []
        }

        try:
            for question in quiz_questions.questions:   # Accessing the questions
                quiz_data["questions"].append({
                    "question": question.question,
                    "answer": question.answer,
                    "explanation": question.explanation,
                    "options": question.options
            })

    # Now quiz_data is structured properly
            print(quiz_data)  # For debugging, to check the structure
        except Exception as e:
            print(f"Error while extracting questions: {e}")

        # Now quiz_data is ready to be inserted into MongoDB
        # Example of inserting into MongoDB (assuming you have a collection defined)
        mongo.db.quizzes.insert_one(quiz_data)
        # my_collection.insert_one(quiz_data)

        # Insert quiz data into MongoDB
        # print(f"Inserted quizdata: {quiz_data}")
        # print(f"Inserted quiz questions: {quiz_questions}")
        # Return the quiz ID to the frontend
        return jsonify({"battle_id": quiz_id}), 201

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500


from bson import ObjectId

@app.route('/api/quiz/<quiz_id>', methods=['GET'])
def get_quiz(quiz_id):
    quiz = mongo.db.quizzes.find_one({"quiz_id": quiz_id})
    if quiz:
        # Function to convert ObjectId fields to strings
        def convert_objectid(obj):
            if isinstance(obj, ObjectId):
                return str(obj)
            return obj

        # Create a new dictionary to store converted values
        quiz = {k: convert_objectid(v) for k, v in quiz.items()}

        return jsonify(quiz), 200
    return jsonify({"error": "Quiz not found"}), 404


@app.route('/api/quiz/<quiz_id>/attempted/<username>', methods=['GET'])
def check_quiz_attempted(quiz_id, username):
    quiz = mongo.db.quizzes.find_one({"quiz_id": quiz_id})
    if quiz:
        # Check if the username is in the users_attempted array
        attempted = any(user['username'] == username for user in quiz.get('users_attempted', []))
        return jsonify({"attempted": attempted}), 200
    return jsonify({"attempted": False}), 404


@app.route('/api/quiz/<quiz_id>/submit', methods=['POST'])
def submit_quiz(quiz_id):
    data = request.get_json()
    username = data.get("username")
    score = data.get("score")
    time_taken = data.get("time_taken")

    # Find the quiz and update the user's score
    quiz = mongo.db.quizzes.find_one({"quiz_id": quiz_id})
    if quiz:
        # Update or insert user details into users_attempted array
        mongo.db.quizzes.update_one(
            {"quiz_id": quiz_id, "users_attempted.username": {"$ne": username}},
            {"$addToSet": {"users_attempted": {"username": username, "score": score, "time_completition": time_taken}}},
            upsert=True
        )
        return jsonify({"message": "Quiz submitted successfully"}), 200
    return jsonify({"error": "Quiz not found"}), 404


if __name__ == '__main__':
    app.run(debug=True)
