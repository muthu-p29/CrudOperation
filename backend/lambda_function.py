import json
import os
from pymongo import MongoClient

def convert_id(data):
    """Convert MongoDB ObjectId to string."""
    data["_id"] = str(data["_id"])
    return data

# Setup MongoDB
mongo_uri = os.environ.get("MONGO_URI")
if not mongo_uri:
    raise Exception("MONGO_URI environment variable is not set")

client = MongoClient(mongo_uri)
db = client["User"]
collection = db["Data"]

def lambda_handler(event, context):
    path = event.get('path', '')
    method = event.get('httpMethod', '')

    if method == "OPTIONS":
        return response(200, "")

    try:
        # GET all users
        if method == "GET" and (path.endswith("/list") or path.endswith("/MongocrudAPI")):
            query_params = event.get("queryStringParameters") or {}
            page = int(query_params.get("page", 1))
            limit = int(query_params.get("limit", 5))
            skip = (page - 1) * limit
            users = list(collection.find().skip(skip).limit(limit))
            return response(200, [convert_id(user) for user in users])

        # GET single user
        elif method == "GET" and path.startswith("/MongocrudAPI/"):
            user_id = path.split("/")[-1].strip().replace('%0A', '')
            user = collection.find_one({"user_id": int(user_id)})
            if not user:
                return response(404, {"error": "User not found"})
            return response(200, convert_id(user))

        # POST add user
        elif method == "POST" and (path.endswith("/add") or path.endswith("/MongocrudAPI")):
            body = json.loads(event.get('body', '{}'))
            required = ["name", "email", "user_id", "age", "phone", "address"]
            missing = [field for field in required if field not in body]
            if missing:
                return response(400, {"error": f"Missing fields: {', '.join(missing)}"})
            try:
                body["user_id"] = int(body["user_id"])
                body["age"] = int(body["age"])
            except ValueError:
                return response(400, {"error": "user_id and age must be integers"})
            result = collection.insert_one(body)
            return response(201, {"message": "User added", "id": str(result.inserted_id)})

        # DELETE user
        elif method == "DELETE" and path.startswith("/MongocrudAPI/"):
            user_id = path.split("/")[-1].strip().replace('%0A', '')
            result = collection.delete_one({"user_id": int(user_id)})
            if result.deleted_count == 0:
                return response(404, {"error": "User not found"})
            return response(200, {"message": "User deleted"})

        # UPDATE user
        elif method == "PUT" and path.startswith("/MongocrudAPI/"):
            user_id = path.split("/")[-1].strip().replace('%0A', '')
            body = json.loads(event.get('body', '{}'))
            if not body:
                return response(400, {"error": "No data provided for update"})
            result = collection.update_one({"user_id": int(user_id)}, {"$set": body})
            if result.matched_count == 0:
                return response(404, {"error": "User not found"})
            return response(200, {"message": "User updated"})

        return response(404, {"error": "Not Found"})

    except Exception as e:
        print(f"Error: {e}")
        return response(500, {"error": "Internal Server Error"})

def response(status, body):
    return {
        "statusCode": status,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        },
        "body": json.dumps(body)
    }
