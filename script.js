// Main JavaScript for Paradise Network Website

// DOM Elements
const mobileNavBtn = document.getElementById('mobileNavBtn');
const mobileNavMenu = document.getElementById('mobileNavMenu');
const mobileNavClose = document.getElementById('mobileNavClose');
const themeToggle = document.getElementById('themeToggle');
const mobileThemeToggle = document.getElementById('mobileThemeToggle');
const addQuoteBtn = document.getElementById('addQuoteBtn');
const quoteModal = document.getElementById('quoteModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const quoteForm = document.getElementById('quoteForm');
const quotesContainer = document.getElementById('quotesContainer');
const emptyQuotes = document.getElementById('emptyQuotes');
const navLinks = document.querySelectorAll('.nav-link');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
const tabContents = document.querySelectorAll('.tab-content');
const logoLink = document.getElementById('logoLink');
const aboutBtn = document.getElementById('aboutBtn');
const aboutModal = document.getElementById('aboutModal');
const closeAboutBtn = document.getElementById('closeAboutBtn');

// Disable right-click
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    alert('Right-click is disabled on this site.');
});

// Disable text selection for most elements (except input/textarea)
document.addEventListener('selectstart', function(e) {
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
    }
});

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('paradise-theme') || 'dark';
    setTheme(savedTheme);
    updateThemeButton(savedTheme);
}

function setTheme(theme) {
    if (theme === 'light') {
        document.body.classList.remove('dark-mode');
        document.body.classList.add('light-mode');
        localStorage.setItem('paradise-theme', 'light');
    } else {
        document.body.classList.remove('light-mode');
        document.body.classList.add('dark-mode');
        localStorage.setItem('paradise-theme', 'dark');
    }
}

function updateThemeButton(theme) {
    const icon = theme === 'dark' ? 'fa-moon' : 'fa-sun';
    const text = theme === 'dark' ? 'Dark Mode' : 'Light Mode';
    
    themeToggle.innerHTML = `<i class="fas ${icon}"></i> ${text}`;
    mobileThemeToggle.innerHTML = `<i class="fas ${icon}"></i> ${text}`;
}

themeToggle.addEventListener('click', function() {
    const currentTheme = localStorage.getItem('paradise-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    setTheme(newTheme);
    updateThemeButton(newTheme);
});

mobileThemeToggle.addEventListener('click', function() {
    const currentTheme = localStorage.getItem('paradise-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    setTheme(newTheme);
    updateThemeButton(newTheme);
});

// Mobile Navigation
mobileNavBtn.addEventListener('click', function() {
    mobileNavMenu.classList.add('active');
});

mobileNavClose.addEventListener('click', function() {
    mobileNavMenu.classList.remove('active');
});

// Tab Navigation
function switchTab(tabId) {
    // Update active tab button
    navLinks.forEach(link => {
        if (link.dataset.tab === tabId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    mobileNavLinks.forEach(link => {
        if (link.dataset.tab === tabId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Show active tab content
    tabContents.forEach(tab => {
        if (tab.id === tabId) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    // Close mobile menu if open
    mobileNavMenu.classList.remove('active');
}

// Add click event to all tab buttons
navLinks.forEach(link => {
    link.addEventListener('click', function() {
        switchTab(this.dataset.tab);
    });
});

mobileNavLinks.forEach(link => {
    link.addEventListener('click', function() {
        switchTab(this.dataset.tab);
    });
});

// Logo link goes to quotes tab
logoLink.addEventListener('click', function(e) {
    e.preventDefault();
    switchTab('quotes-tab');
});

// Quote Modal
addQuoteBtn.addEventListener('click', function() {
    quoteModal.classList.add('active');
    document.getElementById('quoteText').focus();
});

closeModalBtn.addEventListener('click', function() {
    quoteModal.classList.remove('active');
    quoteForm.reset();
});

// About Modal
aboutBtn.addEventListener('click', function() {
    aboutModal.classList.add('active');
});

closeAboutBtn.addEventListener('click', function() {
    aboutModal.classList.remove('active');
});

// Close modals when clicking outside
quoteModal.addEventListener('click', function(e) {
    if (e.target === quoteModal) {
        quoteModal.classList.remove('active');
        quoteForm.reset();
    }
});

aboutModal.addEventListener('click', function(e) {
    if (e.target === aboutModal) {
        aboutModal.classList.remove('active');
    }
});

// Quote Management
function loadQuotes() {
    const quotes = JSON.parse(localStorage.getItem('paradise-quotes')) || [];
    
    if (quotes.length === 0) {
        quotesContainer.innerHTML = '';
        emptyQuotes.style.display = 'block';
        return;
    }
    
    emptyQuotes.style.display = 'none';
    quotesContainer.innerHTML = '';
    
    // Sort quotes by date (newest first)
    quotes.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Display quotes
    quotes.forEach((quote) => {
        const quoteCard = document.createElement('div');
        quoteCard.className = 'quote-card';
        quoteCard.dataset.id = quote.id;
        
        // Format date
        const date = new Date(quote.timestamp);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        quoteCard.innerHTML = `
            <div class="quote-text">${escapeHtml(quote.text)}</div>
            <div class="quote-meta">
                <div>
                    <span class="quote-author">@${escapeHtml(quote.author)}</span>
                    <span class="quote-date">${formattedDate}</span>
                </div>
                <div style="display: flex; align-items: center;">
                    <button class="like-btn" data-id="${quote.id}">
                        <i class="heart-icon ${quote.liked ? 'fas' : 'far'} fa-heart"></i>
                        <span class="like-count">${quote.likes}</span>
                    </button>
                    <button class="delete-btn" data-id="${quote.id}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
        
        quotesContainer.appendChild(quoteCard);
    });
    
    // Add event listeners to like buttons
    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            toggleLike(this.dataset.id);
        });
    });
    
    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this quote?')) {
                deleteQuote(this.dataset.id);
            }
        });
    });
}

function saveQuote(text, author) {
    const quotes = JSON.parse(localStorage.getItem('paradise-quotes')) || [];
    
    const newQuote = {
        id: Date.now().toString(),
        text: text,
        author: author || 'Unknown Author',
        timestamp: new Date().toISOString(),
        likes: 0,
        liked: false
    };
    
    quotes.push(newQuote);
    localStorage.setItem('paradise-quotes', JSON.stringify(quotes));
    
    loadQuotes();
}

function toggleLike(quoteId) {
    const quotes = JSON.parse(localStorage.getItem('paradise-quotes')) || [];
    const quoteIndex = quotes.findIndex(q => q.id === quoteId);
    
    if (quoteIndex !== -1) {
        if (quotes[quoteIndex].liked) {
            quotes[quoteIndex].likes -= 1;
            quotes[quoteIndex].liked = false;
        } else {
            quotes[quoteIndex].likes += 1;
            quotes[quoteIndex].liked = true;
        }
        
        localStorage.setItem('paradise-quotes', JSON.stringify(quotes));
        loadQuotes();
    }
}

function deleteQuote(quoteId) {
    let quotes = JSON.parse(localStorage.getItem('paradise-quotes')) || [];
    quotes = quotes.filter(q => q.id !== quoteId);
    localStorage.setItem('paradise-quotes', JSON.stringify(quotes));
    loadQuotes();
}

// Helper function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Form Submission
quoteForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const quoteText = document.getElementById('quoteText').value.trim();
    const authorName = document.getElementById('authorName').value.trim();
    
    if (!quoteText) {
        alert('Please write a quote before submitting.');
        return;
    }
    
    if (quoteText.length > 500) {
        alert('Quote is too long! Maximum 500 characters.');
        return;
    }
    
    saveQuote(quoteText, authorName);
    
    // Close modal and reset form
    quoteModal.classList.remove('active');
    quoteForm.reset();
    
    // Switch to quotes tab if not already there
    switchTab('quotes-tab');
    
    // Show success message
    showNotification('Your quote has been published successfully!', 'success');
});

// Notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
    `;
    
    if (type === 'success') {
        notification.style.background = 'linear-gradient(90deg, #1dd1a1, #6a11cb)';
    } else if (type === 'error') {
        notification.style.background = 'linear-gradient(90deg, #ff4757, #ff3838)';
    } else {
        notification.style.background = 'linear-gradient(90deg, #6a11cb, #2575fc)';
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS for notifications
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyle);

// Initialize the page
function initPage() {
    // Check if there are existing quotes in localStorage
    let quotes = JSON.parse(localStorage.getItem('paradise-quotes'));
    
    // If no quotes exist, add some sample quotes
    if (!quotes || quotes.length === 0) {
        const sampleQuotes = [
            {
                id: '1',
                text: 'කවියන්ගේ ප්රේම කවි ♡\nහදේ සියුමැලි ගැඹුරු තැනකට වදන් පිහිතුඩු කෙමෙන් බස්සන\nහිතේ සංකා තැවුල් මත්තට සුමුදු මල් වැහි හෙමින් වස්සන\nඉරී ගිය හදවතේ බෝ තැන් ආදරේ නූලකින් මස්සන\nහිතවතුනි කවියෙකුයි දන්නේ අත් නොවිඳි ප්රේමයක ලස්සන ❤️🩹❗',
                author: '1008',
                timestamp: '2025-11-03T09:02:00',
                likes: 5,
                liked: false
            },
            {
                id: '2',
                text: 'මහ මෙරක් තරම් ආදරේ කරත්\nඑයාව මට නැති වෙයි කියන බය නැති වෙන්නෑ\nමහ සයුර තරම් මේ ලෝකේ කදුලු ඉවසුවත්\nඑයාව මටම හම්බෙයි කියන විශ්වාසෙත් මට නෑ',
                author: 'Jung_Iyoo',
                timestamp: '2025-10-30T22:23:00',
                likes: 3,
                liked: false
            },
            {
                id: '3',
                text: 'Doubt kills more dreams than failure ever will.',
                author: 'Gishankrishka',
                timestamp: '2025-10-24T13:25:00',
                likes: 7,
                liked: false
            },
            {
                id: '4',
                text: 'සමහර අයට අපේ වටිනාකම තෙරෙන්න නම් එයාලට අපිව අහිමි වෙන්න ඕනේ...!🤍✨️',
                author: 'Noaah',
                timestamp: '2025-10-29T07:07:00',
                likes: 4,
                liked: false
            }
        ];
        
        localStorage.setItem('paradise-quotes', JSON.stringify(sampleQuotes));
    }
    
    // Load quotes and initialize theme
    loadQuotes();
    initTheme();
    
    // Set up footer links
    document.querySelectorAll('.footer-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            if (this.dataset.tab) {
                switchTab(this.dataset.tab);
            }
        });
    });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initPage);

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl+Enter to submit quote form
    if (e.ctrlKey && e.key === 'Enter' && quoteModal.classList.contains('active')) {
        document.getElementById('quoteForm').dispatchEvent(new Event('submit'));
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        if (quoteModal.classList.contains('active')) {
            quoteModal.classList.remove('active');
            quoteForm.reset();
        }
        if (aboutModal.classList.contains('active')) {
            aboutModal.classList.remove('active');
        }
    }
    
    // Ctrl+Q to open quote modal
    if (e.ctrlKey && e.key === 'q') {
        e.preventDefault();
        addQuoteBtn.click();
    }
    
    // Ctrl+I to open about modal
    if (e.ctrlKey && e.key === 'i') {
        e.preventDefault();
        aboutBtn.click();
    }
});

// Export quotes function (for project documentation)
function exportQuotes() {
    const quotes = JSON.parse(localStorage.getItem('paradise-quotes')) || [];
    const dataStr = JSON.stringify(quotes, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'paradise-quotes.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// Import quotes function
function importQuotes(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const quotes = JSON.parse(e.target.result);
            if (Array.isArray(quotes)) {
                localStorage.setItem('paradise-quotes', JSON.stringify(quotes));
                loadQuotes();
                showNotification('Quotes imported successfully!', 'success');
            } else {
                showNotification('Invalid file format', 'error');
            }
        } catch (error) {
            showNotification('Error importing quotes', 'error');
        }
    };
    reader.readAsText(file);
}

// Add export/import functionality (for project management)
if (document.querySelector('#adminPanel')) {
    document.querySelector('#exportBtn').addEventListener('click', exportQuotes);
    document.querySelector('#importBtn').addEventListener('change', importQuotes);
}