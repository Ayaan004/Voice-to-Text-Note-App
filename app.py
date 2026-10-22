from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Data file to store notes
DATA_FILE = 'notes_data.json'

def load_notes():
    """Load notes from JSON file"""
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []

def save_notes(notes):
    """Save notes to JSON file"""
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(notes, f, indent=2, ensure_ascii=False)

@app.route('/')
def index():
    """Render the main page"""
    return render_template('index.html')

@app.route('/api/notes', methods=['GET'])
def get_notes():
    """Get all notes"""
    try:
        notes = load_notes()
        return jsonify({'success': True, 'notes': notes})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/notes', methods=['POST'])
def create_note():
    """Create a new note"""
    try:
        data = request.get_json()
        notes = load_notes()
        
        new_note = {
            'id': len(notes) + 1,
            'title': data.get('title', 'Untitled Note'),
            'content': data.get('content', ''),
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat(),
            'tags': data.get('tags', [])
        }
        
        notes.append(new_note)
        save_notes(notes)
        
        return jsonify({'success': True, 'note': new_note})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/notes/<int:note_id>', methods=['PUT'])
def update_note(note_id):
    """Update an existing note"""
    try:
        data = request.get_json()
        notes = load_notes()
        
        for note in notes:
            if note['id'] == note_id:
                note['title'] = data.get('title', note['title'])
                note['content'] = data.get('content', note['content'])
                note['tags'] = data.get('tags', note['tags'])
                note['updated_at'] = datetime.now().isoformat()
                
                save_notes(notes)
                return jsonify({'success': True, 'note': note})
        
        return jsonify({'success': False, 'error': 'Note not found'}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/notes/<int:note_id>', methods=['DELETE'])
def delete_note(note_id):
    """Delete a note"""
    try:
        notes = load_notes()
        notes = [note for note in notes if note['id'] != note_id]
        save_notes(notes)
        
        return jsonify({'success': True, 'message': 'Note deleted successfully'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/search', methods=['GET'])
def search_notes():
    """Search notes by query"""
    try:
        query = request.args.get('q', '').lower()
        notes = load_notes()
        
        if not query:
            return jsonify({'success': True, 'notes': notes})
        
        filtered_notes = [
            note for note in notes
            if query in note['title'].lower() or query in note['content'].lower()
        ]
        
        return jsonify({'success': True, 'notes': filtered_notes})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
