# Quick Start Guide

## 🎯 Get Started in 3 Steps

### Step 1: Install Dependencies
Open PowerShell in this directory and run:
```powershell
pip install -r requirements.txt
```

### Step 2: Start the Server
```powershell
python app.py
```

You should see:
```
 * Running on http://127.0.0.1:5000
```

### Step 3: Open Your Browser
Navigate to: **http://localhost:5000**

---

## ✨ First Time Usage

### 1. Create Your First Note
- Click the **"+ New Note"** button in the sidebar
- You'll see the editor appear on the right

### 2. Try Voice Input
- Click the **gradient "Click to Speak"** button
- Allow microphone access when prompted
- Start speaking - watch your words appear!
- Click **"Stop Recording"** when done

### 3. Save Your Note
- Give your note a title (click "Note Title" at top)
- Notes auto-save after 2 seconds
- Or click the save icon (💾) to save immediately

---

## 🎤 Voice Recognition Tips

### Supported Languages
Choose from the dropdown menu:
- English (US/UK)
- Spanish, French, German, Italian
- Portuguese (Brazil)
- Hindi, Chinese, Japanese

### Best Practices
✅ Speak clearly and at normal pace
✅ Keep microphone 6-12 inches away
✅ Minimize background noise
✅ Select correct language before recording
✅ Use continuous recording for longer notes

### Troubleshooting Voice
- **Not working?** Check browser (Chrome/Edge recommended)
- **No permission?** Check browser microphone settings
- **Poor accuracy?** Switch to correct language
- **Stops suddenly?** Check internet connection (API-based)

---

## 📝 Note Features

### Auto-Save
- Saves automatically 2 seconds after you stop typing
- Look for "Saved at [time]" at bottom right
- Manual save available via save icon

### Search
- Type in sidebar search box
- Searches both titles and content
- Updates results in real-time

### Tags
- Add comma-separated tags at bottom
- Example: `work, important, project-alpha`
- Great for organizing notes

### Theme
- Toggle dark/light with moon/sun icon (top right)
- Preference saved automatically
- Easy on the eyes for night use

---

## 🖥️ Keyboard Shortcuts

- **Tab** - Navigate between title, content, tags
- **Ctrl + S** - Quick save (click save button)
- **Esc** - Stop voice recording (or click button)

---

## 📊 Understanding the Interface

### Header (Top)
- **VoiceNote logo** - App branding
- **Theme toggle** - Switch dark/light mode

### Sidebar (Left)
- **New Note button** - Create new note
- **Search box** - Find notes
- **Notes list** - All your notes with previews
- **Stats** - Total note count

### Main Editor (Right)
- **Title field** - Note title (large text)
- **Save/Delete icons** - Quick actions
- **Voice button** - Start/stop recording
- **Language selector** - Choose voice language
- **Content area** - Your note text (large textarea)
- **Tags input** - Add organizational tags
- **Stats bar** - Word count, character count, last saved time

---

## 🔧 Common Issues

### Port Already in Use
If you see "Address already in use", change the port:

Edit `app.py` (line at bottom):
```python
app.run(debug=True, host='0.0.0.0', port=5001)  # Changed from 5000
```

### Dependencies Not Installing
Try:
```powershell
python -m pip install --upgrade pip
pip install Flask==3.0.0 Flask-CORS==4.0.0
```

### Notes Not Saving
- Check console for errors (F12 in browser)
- Verify server is running
- Ensure write permissions in directory
- Check `notes_data.json` gets created

### Voice Not Working
1. Use Chrome or Edge browser
2. Check Settings > Privacy > Microphone
3. Ensure HTTPS or localhost (required for mic access)
4. Try a different browser
5. Restart browser after granting permissions

---

## 💾 Data Location

All notes are stored in:
```
notes_data.json
```

This file is created automatically when you save your first note.

**Backup your data**: Simply copy this file to backup your notes!

---

## 🎨 Customization Ideas

### Change Colors
Edit `static/css/styles.css`:
```css
:root {
    --primary-color: #6366f1;  /* Change this! */
    --secondary-color: #8b5cf6;
}
```

### Change Auto-Save Delay
Edit `static/js/app.js`:
```javascript
saveTimeout = setTimeout(() => {
    if (currentNote) {
        saveNote();
    }
}, 2000);  // Change from 2000ms (2 seconds)
```

### Add More Languages
Edit `templates/index.html`:
```html
<select id="languageSelect">
    <option value="ko-KR">Korean</option>  <!-- Add more! -->
</select>
```

---

## 🚀 Production Deployment

For deploying to a server:

1. **Disable Debug Mode**
   ```python
   app.run(debug=False, host='0.0.0.0', port=5000)
   ```

2. **Use Production Server**
   ```powershell
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:5000 app:app
   ```

3. **Add Security** (recommended):
   - Implement user authentication
   - Use HTTPS/SSL
   - Switch to database (PostgreSQL, MongoDB)
   - Add input sanitization
   - Set up rate limiting

---

## 📚 Learn More

- **Web Speech API**: [MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- **Flask**: [Official Documentation](https://flask.palletsprojects.com/)
- **Font Awesome Icons**: [Icon Library](https://fontawesome.com/icons)

---

## ❓ Need Help?

Check the full **README.md** for:
- Complete feature list
- API documentation
- Architecture details
- Future enhancement ideas

---

**Happy note-taking! 🎉**
