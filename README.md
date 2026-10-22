# Voice to Text Note App

A professional voice-to-text note-taking application with a modern UI, built with HTML/CSS frontend and Python Flask backend.

## Features

### 🎙️ Voice Recognition
- Real-time voice-to-text conversion using Web Speech API
- Support for 10+ languages
- Continuous recording with interim results
- Visual recording status indicators

### 📝 Note Management
- Create, read, update, and delete notes
- Auto-save functionality
- Rich text editor
- Tag support for organization
- Search functionality across all notes

### 🎨 Modern UI/UX
- Clean, professional interface
- Dark/Light theme toggle
- Responsive design for all devices
- Real-time word and character count
- Smooth animations and transitions

### 💾 Backend Features
- RESTful API with Flask
- JSON-based data storage
- Search with query filtering
- Timestamp tracking (created/updated)

## Installation

### Prerequisites
- Python 3.8 or higher
- Modern web browser (Chrome, Edge, Safari recommended for voice features)

### Setup Steps

1. **Install Python dependencies:**
   ```powershell
   pip install -r requirements.txt
   ```

2. **Run the application:**
   ```powershell
   python app.py
   ```

3. **Open your browser:**
   Navigate to `http://localhost:5000`

## Usage

### Creating a New Note
1. Click the "New Note" button in the sidebar
2. Enter a title for your note
3. Start typing or use voice input

### Voice Input
1. Click the "Click to Speak" button in the toolbar
2. Allow microphone permissions when prompted
3. Start speaking - your words will appear in real-time
4. Click "Stop Recording" when finished

### Saving Notes
- Notes auto-save 2 seconds after you stop typing
- Click the save icon to manually save

### Searching Notes
- Use the search box in the sidebar
- Search works across titles and content

### Changing Language
- Select your preferred language from the dropdown
- Default is English (US)
- Supports: English, Spanish, French, German, Italian, Portuguese, Hindi, Chinese, Japanese

### Theme Toggle
- Click the moon/sun icon in the header
- Theme preference is saved locally

## File Structure

```
Voice to Text Note App/
├── app.py                 # Flask backend server
├── requirements.txt       # Python dependencies
├── notes_data.json       # Notes storage (created automatically)
├── templates/
│   └── index.html        # Main HTML template
└── static/
    ├── css/
    │   └── styles.css    # All styling
    └── js/
        └── app.js        # JavaScript functionality
```

## API Endpoints

### GET /api/notes
Get all notes

### POST /api/notes
Create a new note
- Body: `{ title, content, tags }`

### PUT /api/notes/<id>
Update an existing note
- Body: `{ title, content, tags }`

### DELETE /api/notes/<id>
Delete a note

### GET /api/search?q=query
Search notes by query

## Browser Compatibility

### Voice Recognition Support
- ✅ Chrome/Edge (Chromium-based) - Full support
- ✅ Safari - Full support
- ⚠️ Firefox - Limited support (may require flags)

### General Features
- All modern browsers support the core note-taking features
- Voice recognition is an enhancement, not a requirement

## Troubleshooting

### Voice recognition not working
1. Ensure you're using a supported browser (Chrome/Edge recommended)
2. Check microphone permissions in browser settings
3. Verify microphone is working in other applications

### Notes not saving
1. Check console for error messages
2. Ensure the Flask server is running
3. Verify write permissions in the application directory

### Styling issues
1. Clear browser cache
2. Hard refresh (Ctrl + Shift + R)
3. Check browser console for errors

## Security Notes

- This application stores data in a local JSON file
- No authentication is implemented (suitable for local/personal use)
- For production use, consider adding:
  - User authentication
  - Database backend (PostgreSQL, MongoDB)
  - HTTPS encryption
  - Input sanitization

## Future Enhancements

- Export notes to PDF/Markdown
- Note categories/folders
- Rich text formatting toolbar
- Cloud sync capabilities
- Multiple user support
- Mobile app version
- Audio file upload for transcription

## License

This project is open source and available for personal and educational use.

## Credits

- Font Awesome for icons
- Web Speech API for voice recognition
- Flask framework for backend
