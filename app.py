"""
Romantic Proposal Website - Flask Backend
==========================================
A fun, romantic "Will You Love Me?" proposal website.
Run with: python app.py
Visit: http://localhost:5000
"""

from flask import Flask, render_template_string, jsonify, send_from_directory


app = Flask(__name__)


@app.route("/")
def index():
    """Serve the main proposal page."""
    # index.html sits next to app.py, not in Flask's default /templates folder.
    with open("index.html", "r", encoding="utf-8") as f:
        return render_template_string(f.read())


@app.route("/api/yes", methods=["POST"])
def yes_clicked():
    """Handle the Yes button click - return a celebration message."""
    return jsonify({
        "status": "success",
        "message": "Yayyyy! You made me the happiest person alive 💕",
        "celebration": True
    })


@app.route("/style.css")
def style_css():
    return send_from_directory(".", "style.css")


@app.route("/script.js")
def script_js():
    return send_from_directory(".", "script.js")


@app.route("/music/<path:filename>")
def music_file(filename):
    # serves static/music/music.mp3 if present
    return send_from_directory("music", filename)


@app.route("/api/messages", methods=["GET"])
def get_messages():

    """Return all the romantic persuasion messages."""
    messages = [
        {"text": "I will buy you a BMW 🚗", "emoji": "🚗"},
        {"text": "I will take you on long rides 🌃", "emoji": "🌃"},
        {"text": "I will take you to movies 🎬", "emoji": "🎬"},
        {"text": "I will buy you your favorite food 🍕", "emoji": "🍕"},
        {"text": "I will take you shopping 🛍️", "emoji": "🛍️"},
        {"text": "I will give you all my attention ❤️", "emoji": "❤️"},
        {"text": "Please say yes, you are my happiness 🥺", "emoji": "🥺"},
        {"text": "I will travel the whole world with you ✈️", "emoji": "✈️"},
        {"text": "I will make you laugh every single day 😄", "emoji": "😄"},
        {"text": "I will cook your favorite meal every week 🍳", "emoji": "🍳"},
        {"text": "I will be your best friend forever 🤝", "emoji": "🤝"},
        {"text": "I will hold your hand in every storm 🌧️", "emoji": "🌧️"},
        {"text": "I will write you love letters every morning 💌", "emoji": "💌"},
        {"text": "I will be your safe place always 🏠", "emoji": "🏠"},
        {"text": "My heart beats only for you 💓", "emoji": "💓"},
        {"text": "You are the only one I want 🌹", "emoji": "🌹"},
        {"text": "PLEASE... I'm literally begging 🙏", "emoji": "🙏"},
        {"text": "The button won't stop until you say YES! 😭", "emoji": "😭"},
    ]
    return jsonify({"messages": messages})


if __name__ == "__main__":
    print("💕 Starting Romantic Proposal Website...")
    print("💕 Visit: http://localhost:5000")
    app.run(debug=True, port=5000)