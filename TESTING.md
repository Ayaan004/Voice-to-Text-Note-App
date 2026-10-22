# Testing Guide

Complete testing checklist for the Voice to Text Note App.

## Pre-Testing Setup

### 1. Install and Start
```powershell
# Install dependencies
pip install -r requirements.txt

# Start the server
python app.py
```

### 2. Open Browser
Navigate to: http://localhost:5000

---

## ✅ Testing Checklist

### Initial Load Tests

- [ ] Page loads without errors (check browser console F12)
- [ ] Header displays with "VoiceNote" logo
- [ ] Sidebar shows "New Note" button
- [ ] Main area shows "No Note Selected" empty state
- [ ] Theme toggle button visible (moon icon)
- [ ] "0 notes" shown in sidebar footer

### Theme Tests

- [ ] Click theme toggle - switches to dark mode
- [ ] Icon changes from moon to sun
- [ ] All text remains readable
- [ ] Click again - switches back to light mode
- [ ] Refresh page - theme preference persists

### Create Note Tests

- [ ] Click "New Note" button
- [ ] Empty state disappears
- [ ] Note editor appears
- [ ] Title field is focused
- [ ] Content area is empty
- [ ] Word count shows "0 words"
- [ ] Character count shows "0 characters"
- [ ] "Not saved" displays in footer

### Text Input Tests

- [ ] Type in title field - text appears
- [ ] Type in content area - text appears
- [ ] Word count updates in real-time
- [ ] Character count updates in real-time
- [ ] Wait 2 seconds - "Saved at [time]" appears
- [ ] Check sidebar - new note appears in list
- [ ] Note shows correct title and preview

### Voice Recognition Tests

#### Setup
- [ ] Verify using Chrome, Edge, or Safari
- [ ] Check microphone is connected and working

#### Recording
- [ ] Click "Click to Speak" button
- [ ] Browser prompts for microphone permission
- [ ] Grant permission
- [ ] Button changes to "Stop Recording" with red gradient
- [ ] Button animates (pulsing effect)
- [ ] Status shows "Listening..."
- [ ] Speak clearly: "This is a test of voice recognition"
- [ ] Text appears in content area
- [ ] Click "Stop Recording"
- [ ] Button returns to normal state
- [ ] Status shows "Ready"
- [ ] Text remains in content area

#### Language Selection
- [ ] Change language to "Spanish"
- [ ] Start recording
- [ ] Speak in Spanish
- [ ] Verify text appears correctly
- [ ] Stop recording
- [ ] Try 2-3 other languages

### Save Tests

- [ ] Create a new note with content
- [ ] Click save icon (💾)
- [ ] Toast notification appears: "Note saved successfully"
- [ ] Toast disappears after 3 seconds
- [ ] "Saved at [time]" updates
- [ ] Sidebar updates with note

### Multiple Notes Tests

- [ ] Create note 1: "Meeting Notes"
- [ ] Add content to note 1
- [ ] Create note 2: "Shopping List"
- [ ] Add content to note 2
- [ ] Create note 3: "Ideas"
- [ ] Add content to note 3
- [ ] Verify all 3 notes in sidebar
- [ ] Notes count shows "3 notes"
- [ ] Notes ordered by most recent

### Note Selection Tests

- [ ] Click note 1 in sidebar
- [ ] Note 1 content loads in editor
- [ ] Note 1 highlighted in sidebar
- [ ] Click note 2 in sidebar
- [ ] Note 2 content loads in editor
- [ ] Note 2 highlighted in sidebar
- [ ] Previous note (1) no longer highlighted

### Search Tests

- [ ] Type "meeting" in search box
- [ ] Only matching notes appear
- [ ] Clear search box
- [ ] All notes reappear
- [ ] Search partial word: "shop"
- [ ] Matching note appears
- [ ] Search non-existent term
- [ ] No notes appear (empty list)

### Tags Tests

- [ ] Open a note
- [ ] Add tags: "work, important, urgent"
- [ ] Wait for auto-save
- [ ] Reload page
- [ ] Open same note
- [ ] Verify tags persist

### Delete Tests

- [ ] Open a note
- [ ] Click delete icon (🗑️)
- [ ] Confirmation dialog appears
- [ ] Click "Cancel" - note remains
- [ ] Click delete again
- [ ] Click "OK" - note deleted
- [ ] Toast shows "Note deleted successfully"
- [ ] Note removed from sidebar
- [ ] Notes count decreases
- [ ] Empty state shown (if no notes left)

### Auto-Save Tests

- [ ] Open a note
- [ ] Type some text
- [ ] Stop typing
- [ ] Wait exactly 2 seconds
- [ ] "Saved at [time]" updates automatically
- [ ] Type more text immediately
- [ ] Save timer resets
- [ ] Wait 2 seconds again
- [ ] Auto-save triggers again

### Word Counter Tests

- [ ] Type: "one" - shows "1 words"
- [ ] Type: "one two" - shows "2 words"
- [ ] Type: "one two three" - shows "3 words"
- [ ] Verify character count updates correctly
- [ ] Add line breaks - word count accurate
- [ ] Add extra spaces - counts correctly

### Persistence Tests

- [ ] Create 2-3 notes
- [ ] Close browser tab
- [ ] Reopen http://localhost:5000
- [ ] All notes still visible
- [ ] Check notes_data.json file exists
- [ ] Open notes_data.json - verify JSON structure
- [ ] All notes have id, title, content, created_at, updated_at

### Responsive Design Tests

#### Desktop (1920x1080)
- [ ] Layout looks good
- [ ] All elements visible
- [ ] No scrolling issues

#### Tablet (768x1024)
- [ ] Sidebar width adjusts
- [ ] Editor remains usable
- [ ] All buttons accessible

#### Mobile (375x667)
- [ ] Layout stacks vertically
- [ ] Sidebar on top
- [ ] Editor below
- [ ] All features accessible
- [ ] Touch targets large enough

### Error Handling Tests

- [ ] Stop Flask server
- [ ] Try to save a note
- [ ] Error toast appears
- [ ] Start server again
- [ ] Try to save - works correctly
- [ ] Deny microphone permission
- [ ] Try voice recording
- [ ] Appropriate error message shown

### Browser Compatibility Tests

#### Chrome
- [ ] All features work
- [ ] Voice recognition works
- [ ] UI renders correctly

#### Edge
- [ ] All features work
- [ ] Voice recognition works
- [ ] UI renders correctly

#### Firefox
- [ ] Note features work
- [ ] Voice may have limitations (expected)
- [ ] UI renders correctly

#### Safari (if available)
- [ ] All features work
- [ ] Voice recognition works
- [ ] UI renders correctly

### Performance Tests

- [ ] Create 20+ notes
- [ ] Sidebar scrolls smoothly
- [ ] Search remains fast
- [ ] No lag when typing
- [ ] Voice recognition smooth
- [ ] Page loads quickly

### Edge Cases

- [ ] Create note with very long title (100+ chars)
- [ ] Create note with 5000+ words
- [ ] Add 20+ tags to a note
- [ ] Special characters in title: `!@#$%^&*()`
- [ ] Emojis in content: "😀 🎉 🎤"
- [ ] Multiple rapid saves (click save 10x)
- [ ] Empty note title - saves as "Untitled Note"
- [ ] Empty note content - saves successfully

---

## 🐛 Bug Report Template

If you find issues, document them:

```
**Bug Title**: Brief description

**Steps to Reproduce**:
1. Step one
2. Step two
3. Step three

**Expected Behavior**: What should happen

**Actual Behavior**: What actually happens

**Browser**: Chrome/Edge/Firefox/Safari version X

**Console Errors**: (Check F12, copy any errors)

**Screenshots**: (If applicable)
```

---

## ✅ Final Verification

After completing all tests:

- [ ] All core features working
- [ ] Voice recognition functional
- [ ] Data persists correctly
- [ ] No console errors
- [ ] Responsive on all sizes
- [ ] Performance acceptable
- [ ] Ready for use!

---

## 🎯 Next Steps

Once testing is complete:

1. **Use it daily** for real notes
2. **Document any issues** you encounter
3. **Consider enhancements** you'd like
4. **Share with others** for feedback
5. **Backup notes_data.json** regularly

---

**Happy Testing! 🧪**
