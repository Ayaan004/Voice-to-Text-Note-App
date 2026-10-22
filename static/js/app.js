// Global state
let currentNote = null;
let allNotes = [];
let recognition = null;
let isRecording = false;

// DOM Elements
const elements = {
    emptyState: document.getElementById('emptyState'),
    noteEditor: document.getElementById('noteEditor'),
    notesList: document.getElementById('notesList'),
    noteTitle: document.getElementById('noteTitle'),
    noteContent: document.getElementById('noteContent'),
    tagsInput: document.getElementById('tagsInput'),
    voiceBtn: document.getElementById('voiceBtn'),
    voiceStatus: document.getElementById('voiceStatus'),
    languageSelect: document.getElementById('languageSelect'),
    newNoteBtn: document.getElementById('newNoteBtn'),
    saveNoteBtn: document.getElementById('saveNoteBtn'),
    deleteNoteBtn: document.getElementById('deleteNoteBtn'),
    searchInput: document.getElementById('searchInput'),
    themeToggle: document.getElementById('themeToggle'),
    notesCount: document.getElementById('notesCount'),
    wordCount: document.getElementById('wordCount'),
    charCount: document.getElementById('charCount'),
    lastSaved: document.getElementById('lastSaved'),
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toastMessage'),
    loadingOverlay: document.getElementById('loadingOverlay')
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initSpeechRecognition();
    loadNotes();
    attachEventListeners();
    loadTheme();
    initializeHelpers();
});

// Initialize helper features
function initializeHelpers() {
    // Help Modal functionality
    const helpBtn = document.getElementById('helpBtn');
    const helpModal = document.getElementById('helpModal');
    const closeHelpModal = document.getElementById('closeHelpModal');

    if (helpBtn && helpModal) {
        helpBtn.addEventListener('click', () => {
            helpModal.classList.remove('hidden');
        });
    }

    if (closeHelpModal) {
        closeHelpModal.addEventListener('click', () => {
            helpModal.classList.add('hidden');
        });
    }

    if (helpModal) {
        // Close on overlay click
        const overlay = helpModal.querySelector('.modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', () => {
                helpModal.classList.add('hidden');
            });
        }
    }
    
    // Show welcome message on first load
    if (localStorage.getItem('firstVisit') === null) {
        setTimeout(() => {
            showToast('Welcome to VoiceNote! Press keyboard icon for shortcuts.', 'info');
            localStorage.setItem('firstVisit', 'done');
        }, 1000);
    }
}

// Speech Recognition Setup
function initSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = elements.languageSelect.value;
        
        recognition.onstart = () => {
            isRecording = true;
            elements.voiceBtn.classList.add('recording');
            elements.voiceBtn.innerHTML = '<i class="fas fa-stop"></i><span>Stop Recording</span>';
            updateVoiceStatus('Listening...', 'danger');
        };
        
        recognition.onend = () => {
            isRecording = false;
            elements.voiceBtn.classList.remove('recording');
            elements.voiceBtn.innerHTML = '<i class="fas fa-microphone"></i><span>Click to Speak</span>';
            updateVoiceStatus('Ready', 'success');
        };
        
        recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript + ' ';
                } else {
                    interimTranscript += transcript;
                }
            }
            
            if (finalTranscript) {
                insertTextAtCursor(finalTranscript);
                updateWordCount();
            }
        };
        
        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            updateVoiceStatus('Error: ' + event.error, 'danger');
            setTimeout(() => updateVoiceStatus('Ready', 'success'), 3000);
        };
    } else {
        elements.voiceBtn.disabled = true;
        elements.voiceBtn.title = 'Speech recognition not supported';
        showToast('Speech recognition is not supported in this browser', 'warning');
    }
}

// Voice Control
function toggleVoiceRecording() {
    if (!recognition) return;
    
    if (isRecording) {
        recognition.stop();
    } else {
        recognition.lang = elements.languageSelect.value;
        recognition.start();
    }
}

function updateVoiceStatus(text, type = 'success') {
    const statusText = elements.voiceStatus.querySelector('.status-text');
    statusText.textContent = text;
    
    // Remove all status classes
    elements.voiceStatus.classList.remove('listening', 'error', 'ready');
    
    // Add appropriate class
    if (type === 'danger' || type === 'error') {
        elements.voiceStatus.classList.add('error');
    } else if (isRecording) {
        elements.voiceStatus.classList.add('listening');
    } else {
        elements.voiceStatus.classList.add('ready');
    }
}

function insertTextAtCursor(text) {
    const textarea = elements.noteContent;
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const before = textarea.value.substring(0, startPos);
    const after = textarea.value.substring(endPos);
    
    textarea.value = before + text + after;
    textarea.selectionStart = textarea.selectionEnd = startPos + text.length;
    textarea.focus();
}

// API Functions
async function loadNotes() {
    showLoading(true);
    try {
        const response = await fetch('/api/notes');
        const data = await response.json();
        
        if (data.success) {
            allNotes = data.notes;
            renderNotesList(allNotes);
            updateNotesCount();
        }
    } catch (error) {
        console.error('Error loading notes:', error);
        showToast('Failed to load notes', 'danger');
    }
    showLoading(false);
}

async function saveNote() {
    if (!currentNote) return;
    
    showLoading(true);
    try {
        const noteData = {
            title: elements.noteTitle.value || 'Untitled Note',
            content: elements.noteContent.value,
            tags: elements.tagsInput.value.split(',').map(t => t.trim()).filter(t => t)
        };
        
        const url = currentNote.id ? `/api/notes/${currentNote.id}` : '/api/notes';
        const method = currentNote.id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(noteData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            currentNote = data.note;
            await loadNotes();
            updateLastSaved();
            showToast('Note saved successfully', 'success');
        }
    } catch (error) {
        console.error('Error saving note:', error);
        showToast('Failed to save note', 'danger');
    }
    showLoading(false);
}

async function deleteNote() {
    if (!currentNote || !currentNote.id) return;
    
    if (!confirm('Are you sure you want to delete this note?')) return;
    
    showLoading(true);
    try {
        const response = await fetch(`/api/notes/${currentNote.id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            currentNote = null;
            await loadNotes();
            showEmptyState();
            showToast('Note deleted successfully', 'success');
        }
    } catch (error) {
        console.error('Error deleting note:', error);
        showToast('Failed to delete note', 'danger');
    }
    showLoading(false);
}

async function searchNotes(query) {
    showLoading(true);
    try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        
        if (data.success) {
            renderNotesList(data.notes);
        }
    } catch (error) {
        console.error('Error searching notes:', error);
    }
    showLoading(false);
}

// UI Functions
function renderNotesList(notes) {
    elements.notesList.innerHTML = '';
    
    if (notes.length === 0) {
        elements.notesList.innerHTML = `
            <div style="padding: 2rem; text-align: center; color: var(--text-tertiary);">
                <i class="fas fa-inbox" style="font-size: 2rem; opacity: 0.3; margin-bottom: 0.5rem;"></i>
                <p>No notes found</p>
                <p style="font-size: 0.85rem;">Create your first note to get started</p>
            </div>
        `;
        return;
    }
    
    notes.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    
    notes.forEach(note => {
        const noteItem = document.createElement('div');
        noteItem.className = 'note-item';
        if (currentNote && currentNote.id === note.id) {
            noteItem.classList.add('active');
        }
        
        const preview = note.content.substring(0, 80);
        const date = formatDate(note.updated_at);
        const wordCount = note.content.trim() ? note.content.trim().split(/\s+/).length : 0;
        
        // Generate tags HTML
        let tagsHTML = '';
        if (note.tags && note.tags.length > 0) {
            const displayTags = note.tags.slice(0, 3);
            tagsHTML = `
                <div class="note-item-tags">
                    ${displayTags.map(tag => `<span class="note-tag-small"><i class="fas fa-tag"></i>${escapeHtml(tag)}</span>`).join('')}
                    ${note.tags.length > 3 ? `<span class="note-tag-small">+${note.tags.length - 3} more</span>` : ''}
                </div>
            `;
        }
        
        noteItem.innerHTML = `
            <div class="note-item-title">${escapeHtml(note.title)}</div>
            <div class="note-item-preview">${escapeHtml(preview) || '<em>No content</em>'}</div>
            ${tagsHTML}
            <div class="note-item-date">
                <i class="fas fa-clock"></i> ${date}
                <span style="margin-left: auto;"><i class="fas fa-file-word"></i> ${wordCount} words</span>
            </div>
        `;
        
        noteItem.addEventListener('click', () => loadNote(note));
        elements.notesList.appendChild(noteItem);
    });
}

function loadNote(note) {
    currentNote = note;
    elements.noteTitle.value = note.title;
    elements.noteContent.value = note.content;
    elements.tagsInput.value = note.tags.join(', ');
    
    showNoteEditor();
    updateWordCount();
    updateLastSaved();
    
    // Update active state
    document.querySelectorAll('.note-item').forEach(item => {
        item.classList.remove('active');
    });
    event.currentTarget?.classList.add('active');
}

function createNewNote() {
    currentNote = { title: '', content: '', tags: [] };
    elements.noteTitle.value = '';
    elements.noteContent.value = '';
    elements.tagsInput.value = '';
    
    showNoteEditor();
    elements.noteTitle.focus();
    updateWordCount();
    
    // Clear active state
    document.querySelectorAll('.note-item').forEach(item => {
        item.classList.remove('active');
    });
}

function showNoteEditor() {
    elements.emptyState.style.display = 'none';
    elements.noteEditor.classList.remove('hidden');
}

function showEmptyState() {
    elements.emptyState.style.display = 'flex';
    elements.noteEditor.classList.add('hidden');
}

function updateWordCount() {
    const text = elements.noteContent.value;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    
    elements.wordCount.innerHTML = `<i class="fas fa-file-word"></i> ${words} words`;
    elements.charCount.innerHTML = `<i class="fas fa-keyboard"></i> ${chars} characters`;
    
    // Add visual warning for very long notes
    if (chars > 50000) {
        elements.charCount.classList.add('char-danger');
    } else if (chars > 30000) {
        elements.charCount.classList.add('char-warning');
        elements.charCount.classList.remove('char-danger');
    } else {
        elements.charCount.classList.remove('char-warning', 'char-danger');
    }
}

function updateNotesCount() {
    const count = allNotes.length;
    elements.notesCount.innerHTML = `${count} note${count !== 1 ? 's' : ''}`;
    
    // Update page title
    document.title = count > 0 ? `VoiceNote (${count})` : 'VoiceNote';
}

function updateLastSaved() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    elements.lastSaved.innerHTML = `<i class="fas fa-check-circle" style="color: var(--success-color);"></i> Saved at ${timeStr}`;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString();
}

function showToast(message, type = 'success') {
    elements.toastMessage.textContent = message;
    elements.toast.classList.remove('hidden', 'success', 'error', 'warning', 'info');
    elements.toast.classList.add(type);
    
    // Change icon based on type
    const icon = elements.toast.querySelector('i');
    icon.className = type === 'success' ? 'fas fa-check-circle' :
                     type === 'error' ? 'fas fa-exclamation-circle' :
                     type === 'warning' ? 'fas fa-exclamation-triangle' :
                     'fas fa-info-circle';
    
    setTimeout(() => {
        elements.toast.classList.add('hidden');
    }, 3000);
}

function showLoading(show) {
    if (show) {
        elements.loadingOverlay.classList.remove('hidden');
    } else {
        elements.loadingOverlay.classList.add('hidden');
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    const icon = elements.themeToggle.querySelector('i');
    icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
}

function loadTheme() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
        elements.themeToggle.querySelector('i').className = 'fas fa-sun';
    }
}

// Event Listeners
function attachEventListeners() {
    elements.voiceBtn.addEventListener('click', toggleVoiceRecording);
    elements.newNoteBtn.addEventListener('click', createNewNote);
    elements.themeToggle.addEventListener('click', toggleTheme);
    
    // Save button with feedback
    elements.saveNoteBtn.addEventListener('click', saveNoteWithFeedback);
    
    // Delete button with confirmation
    elements.deleteNoteBtn.addEventListener('click', async () => {
        if (!currentNote || !currentNote.id) return;
        
        const confirmed = confirm(`Are you sure you want to delete "${currentNote.title || 'Untitled Note'}"?\n\nThis action cannot be undone.`);
        if (confirmed) {
            await deleteNote();
        }
    });
    
    // Export and copy buttons
    const exportBtn = document.getElementById('exportNoteBtn');
    const copyBtn = document.getElementById('copyNoteBtn');
    
    if (exportBtn) {
        exportBtn.addEventListener('click', () => exportNote('txt'));
    }
    
    if (copyBtn) {
        copyBtn.addEventListener('click', copyNoteToClipboard);
    }
    
    elements.noteContent.addEventListener('input', updateWordCount);
    
    // Debounced search
    elements.searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        debouncedSearch(query);
    });
    
    elements.languageSelect.addEventListener('change', () => {
        if (recognition && isRecording) {
            recognition.stop();
            setTimeout(() => {
                recognition.lang = elements.languageSelect.value;
                recognition.start();
            }, 100);
        }
    });
    
    // Auto-save on content change
    let saveTimeout;
    const autoSave = () => {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            if (currentNote) {
                saveNote();
            }
        }, 2000);
    };
    
    elements.noteContent.addEventListener('input', autoSave);
    elements.noteTitle.addEventListener('input', autoSave);
    elements.tagsInput.addEventListener('input', autoSave);
}


// Helper function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (currentNote) {
            saveNote();
        }
    }
    
    // Ctrl/Cmd + N for new note
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        createNewNote();
    }
    
    // Ctrl/Cmd + F to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        elements.searchInput.focus();
    }
    
    // Escape to stop recording
    if (e.key === 'Escape' && isRecording) {
        recognition.stop();
    }
});

// Auto-resize textarea
function autoResizeTextarea() {
    elements.noteContent.style.height = 'auto';
    elements.noteContent.style.height = elements.noteContent.scrollHeight + 'px';
}

// Add debounce function for better performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Enhanced search with debouncing
const debouncedSearch = debounce((query) => {
    if (query) {
        searchNotes(query);
    } else {
        loadNotes();
    }
}, 300);

// Export note functionality
function exportNote(format = 'txt') {
    if (!currentNote) {
        showToast('No note selected to export', 'warning');
        return;
    }
    
    const content = `${currentNote.title}\n\n${currentNote.content}\n\nTags: ${currentNote.tags.join(', ')}\nCreated: ${new Date(currentNote.created_at).toLocaleString()}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentNote.title || 'note'}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Note exported successfully', 'success');
}

// Copy note to clipboard
async function copyNoteToClipboard() {
    if (!currentNote) {
        showToast('No note selected', 'warning');
        return;
    }
    
    try {
        await navigator.clipboard.writeText(elements.noteContent.value);
        showToast('Note copied to clipboard', 'success');
    } catch (err) {
        showToast('Failed to copy note', 'error');
    }
}

// Show statistics
function showNoteStatistics() {
    if (!currentNote) return;
    
    const text = elements.noteContent.value;
    const words = text.trim().split(/\s+/).length;
    const characters = text.length;
    const sentences = text.split(/[.!?]+/).length - 1;
    const paragraphs = text.split(/\n\n+/).length;
    const readingTime = Math.ceil(words / 200); // Average reading speed
    
    const stats = `
        Words: ${words}
        Characters: ${characters}
        Sentences: ${sentences}
        Paragraphs: ${paragraphs}
        Estimated reading time: ${readingTime} min
    `;
    
    console.log('Note Statistics:', stats);
    showToast(`${words} words • ${readingTime} min read`, 'info');
}

// Add visual feedback for save button
async function saveNoteWithFeedback() {
    const saveBtn = elements.saveNoteBtn;
    if (!saveBtn) return;
    
    saveBtn.classList.add('btn-loading');
    await saveNote();
    
    setTimeout(() => {
        saveBtn.classList.remove('btn-loading');
    }, 500);
}
