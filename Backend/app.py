# backend/app.py
import os
import requests
from flask import Flask, redirect, url_for, request, jsonify, session, make_response
from flask_cors import CORS
from authlib.integrations.flask_client import OAuth
from dotenv import load_dotenv
import jwt
from datetime import datetime, timedelta

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY", "dev_secret") 


FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
CORS(app, supports_credentials=True, origins=[FRONTEND_URL])

oauth = OAuth(app)

google = oauth.register(
    name="google",
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
)

USERINFO_URL = "https://openidconnect.googleapis.com/v1/userinfo"


@app.route("/login")
def login():
   
    redirect_uri = url_for("auth_callback", _external=True)
    return google.authorize_redirect(redirect_uri)


@app.route("/auth/callback")
def auth_callback():
   
    err = request.args.get("error")
    if err:
        return redirect(f"{FRONTEND_URL}/auth/success?status=cancelled&reason={err}")

    token = google.authorize_access_token()
    if not token:
        return redirect(f"{FRONTEND_URL}/auth/success?status=error")

    userinfo = None
    try:

        nonce = session.get(f"oauth_{google.name}_nonce")
        if nonce and token.get("id_token"):
            userinfo = google.parse_id_token(token, nonce=nonce)
        else:
            raise Exception("skip id_token")
    except Exception:
       
        access_token = token.get("access_token")
        if not access_token:
            return redirect(f"{FRONTEND_URL}/auth/success?status=error")
        headers = {"Authorization": f"Bearer {access_token}"}
        resp = requests.get(USERINFO_URL, headers=headers, timeout=10)
        if resp.status_code != 200:
            return redirect(f"{FRONTEND_URL}/auth/success?status=error")
        userinfo = resp.json()


    payload = {
        "sub": userinfo.get("sub") or userinfo.get("id"),
        "email": userinfo.get("email"),
        "name": userinfo.get("name"),
        "picture": userinfo.get("picture"), 
        "exp": datetime.utcnow() + timedelta(hours=4),
    }
    jwt_token = jwt.encode(payload, os.getenv("SECRET_KEY"), algorithm="HS256")


    resp = make_response(redirect(f"{FRONTEND_URL}/auth/success?status=ok"))
    resp.set_cookie(
        "access_token",
        jwt_token,
        httponly=True,
        secure=False,   
        samesite="Lax", 
        max_age=4 * 3600,
    )
    return resp


@app.route("/api/me")
def me():
    token = request.cookies.get("access_token")
    if not token:
        return jsonify({"error": "unauthenticated"}), 401
    try:
        data = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=["HS256"])
        return jsonify({"user": data})
    except Exception as e:
        return jsonify({"error": "invalid token", "detail": str(e)}), 401


@app.route("/logout", methods=["POST"])
def logout():
    resp = make_response(jsonify({"ok": True, "msg": "logged out"}), 200)
    resp.set_cookie("access_token", "", expires=0, httponly=True, samesite="Lax")
    session.clear()
    return resp

if __name__ == "__main__":
    app.run(port=5000, debug=True)
