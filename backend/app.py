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
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=2)  
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
            "time_limit": f"{time_limit} min",
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

        print(quiz_data)


        # Insert quiz data into MongoDB
        # print(f"Inserted quizdata: {quiz_data}")
        # print(f"Inserted quiz questions: {quiz_questions}")
        # Return the quiz ID to the frontend
        return jsonify({"battle_id": quiz_id}), 201

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500




# @app.route('/api/create_battle', methods=['POST'])
# def create_battle():
#     # Get the data from the request
#     print("Battle function called!")
#     battle_data = request.json

#     # Extract individual fields from the request data
#     battle_name = battle_data.get('battleName')
#     battle_description = battle_data.get('battleDescription')
#     num_questions = battle_data.get('numQuestions')
#     time_limit = battle_data.get('timeLimit')
#     difficulty = battle_data.get('difficulty')
#     creator_username = battle_data.get('creatorUsername')  # Get the creator's username
#     # Validate the received data
#     if not battle_name or not battle_description or not num_questions or not time_limit:
#         return jsonify({"message": "Missing required fields"}), 400
    
#     battle_id = str(uuid.uuid4())  # Create a unique random ID
#     # Create a battle object to be stored in the MongoDB
#     battle = {
#         'battleid': battle_id,
#         'battleName': battle_name,
#         'battleDescription': battle_description,
#         'numQuestions': num_questions,
#         'timeLimit': time_limit,
#         'difficulty': difficulty,
#         'created_at': datetime.datetime.utcnow(),
#         'creator_username' : creator_username,
#         'status': 'waiting_for_opponent',  # Initial status of the battle
#         'opponent_id': None  # No opponent yet
#     }
#     # Insert the battle object into the 'battles' collection
#     try:
#         # if mongo.db.battles.find_one({'battleid': battle_id}):
#             # return jsonify({"message": "Battle ID already exists"}), 400
        
#         mongo.db.battles.insert_one(battle)
#         print(f"Inserted Battle: {battle}")  # Log the inserted battle
         
#         # 30 for 30 seconds, 300 for 5 minutes
#         #  
#         Timer(300, discard_battle, [battle_id]).start()  # Discard the battle after 5 minutes
#     except Exception as e:
#         print("Insert failed:", e)
#         return jsonify({"message": "Failed to create battle"}), 500
#     # Return the battle ID in the response
#     return jsonify({
#         "message": "Battle created successfully",
#         "battle_id": battle_id
#     }), 201

# def discard_battle(battle_id):
#     result = mongo.db.battles.delete_one({'battleid': battle_id})
#     if result.deleted_count > 0:
#         print(f"Battle {battle_id} discarded due to timeout.")
#     else:
#         print(f"Battle {battle_id} not found or already discarded.")

# @app.route('/api/check_battle_status/<battle_id>', methods=['GET'])
# def check_battle_status(battle_id):
#     battle = mongo.db.battles.find_one({'battleid': battle_id})
    
#     if not battle:
#         return jsonify({"message": "Battle not found", "status": "discarded"}), 404
    
#     return jsonify({
#         "message": "Battle found",
#         "status": battle['status']
#     }), 200



# @app.route('/api/finish_battle/<battle_id>', methods=['POST'])
# def finish_battle(battle_id):
#     # Find the battle
#     battle = mongo.db.battles.find_one({'_id': ObjectId(battle_id)})
    
#     if not battle:
#         return jsonify({"message": "Battle not found"}), 404

#     # Update the status to 'completed'
#     mongo.db.battles.update_one(
#         {'_id': ObjectId(battle_id)},
#         {'$set': {
#             'status': 'completed'
#         }}
#     )

#     return jsonify({"message": "Battle completed successfully"}), 200

if __name__ == '__main__':
    app.run(debug=True)
