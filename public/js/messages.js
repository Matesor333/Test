
document.addEventListener('DOMContentLoaded', function() {
  // Mock contacts data
  const contacts = [
    { id: 1, name: 'John Doe', lastMessage: 'I completed the workout', unread: 2, lastMessageTime: '10:30 AM' },
    { id: 2, name: 'Jane Smith', lastMessage: 'How was my progress?', unread: 0, lastMessageTime: 'Yesterday' },
    { id: 3, name: 'Mike Johnson', lastMessage: 'Thanks for the meal plan', unread: 1, lastMessageTime: 'Monday' }
  ];

  // Mock messages data
  const mockMessages = {
    1: [
      { id: 1, senderId: 1, text: 'Hi Coach, how are you?', timestamp: '2023-09-10T09:30:00' },
      { id: 2, senderId: 'trainer', text: 'Hi John, I\'m good! How was your workout yesterday?', timestamp: '2023-09-10T09:35:00' },
      { id: 3, senderId: 1, text: 'It was great! I completed all sets of squats.', timestamp: '2023-09-10T09:40:00' },
      { id: 4, senderId: 1, text: 'I completed the workout', timestamp: '2023-09-10T10:30:00' }
    ],
    2: [
      { id: 1, senderId: 2, text: 'Coach, I have a question about my diet plan.', timestamp: '2023-09-09T14:20:00' },
      { id: 2, senderId: 'trainer', text: 'Sure Jane, what would you like to know?', timestamp: '2023-09-09T14:25:00' },
      { id: 3, senderId: 2, text: 'Can I substitute chicken with fish?', timestamp: '2023-09-09T14:30:00' },
      { id: 4, senderId: 'trainer', text: 'Absolutely! Fish is a great protein source.', timestamp: '2023-09-09T14:35:00' },
      { id: 5, senderId: 2, text: 'How was my progress?', timestamp: '2023-09-09T16:45:00' }
    ],
    3: [
      { id: 1, senderId: 'trainer', text: 'Hi Mike, I\'ve uploaded your new meal plan.', timestamp: '2023-09-08T11:10:00' },
      { id: 2, senderId: 3, text: 'Great! I\'ll check it out.', timestamp: '2023-09-08T11:15:00' },
      { id: 3, senderId: 3, text: 'Thanks for the meal plan', timestamp: '2023-09-08T11:20:00' }
    ]
  };

  // Render contacts list
  function renderContacts() {
    const contactsList = document.getElementById('contacts-list');
    contactsList.innerHTML = '';

    contacts.forEach(contact => {
      const contactItem = document.createElement('div');
      contactItem.className = 'contact-item';
      contactItem.dataset.contactId = contact.id;
      
      const unreadBadge = contact.unread > 0 ? `<span class="unread-badge">${contact.unread}</span>` : '';
      
      contactItem.innerHTML = `
        <div class="contact-avatar">
          <i class="fas fa-user-circle"></i>
          ${unreadBadge}
        </div>
        <div class="contact-info">
          <div class="contact-name">${contact.name}</div>
          <div class="last-message">${contact.lastMessage}</div>
        </div>
        <div class="contact-time">${contact.lastMessageTime}</div>
      `;
      
      contactItem.addEventListener('click', () => {
        // Mark as active and display messages
        document.querySelectorAll('.contact-item').forEach(item => {
          item.classList.remove('active');
        });
        contactItem.classList.add('active');
        
        // Reset unread counter
        contact.unread = 0;
        renderContacts();
        
        // Display messages for this contact
        displayMessages(contact.id);
      });
      
      contactsList.appendChild(contactItem);
    });
  }

  // Display messages for a specific contact
  function displayMessages(contactId) {
    const messagesContainer = document.getElementById('messages-container');
    const contact = contacts.find(c => c.id === contactId);
    const messages = mockMessages[contactId] || [];
    
    // Update contact name in message header
    document.getElementById('current-contact-name').textContent = contact.name;
    
    // Enable message input area
    document.getElementById('message-input').disabled = false;
    document.getElementById('send-message-btn').disabled = false;
    
    // Clear no messages placeholder
    messagesContainer.innerHTML = '';
    
    // Display messages
    messages.forEach(message => {
      const messageElem = document.createElement('div');
      messageElem.className = `message ${message.senderId === 'trainer' ? 'sent' : 'received'}`;
      
      const timestamp = new Date(message.timestamp);
      const timeStr = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      messageElem.innerHTML = `
        <div class="message-content">
          <div class="message-text">${message.text}</div>
          <div class="message-time">${timeStr}</div>
        </div>
      `;
      
      messagesContainer.appendChild(messageElem);
    });
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Set up send message functionality for this contact
    setupSendMessage(contactId);
  }

  // Setup send message functionality
  function setupSendMessage(contactId) {
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-message-btn');
    
    // Clear previous event listeners
    const newSendButton = sendButton.cloneNode(true);
    sendButton.parentNode.replaceChild(newSendButton, sendButton);
    
    // Add new event listener
    newSendButton.addEventListener('click', () => {
      const messageText = messageInput.value.trim();
      if (messageText) {
        // Add message to mock data
        const newMessage = {
          id: mockMessages[contactId].length + 1,
          senderId: 'trainer',
          text: messageText,
          timestamp: new Date().toISOString()
        };
        
        mockMessages[contactId].push(newMessage);
        
        // Clear input
        messageInput.value = '';
        
        // Redisplay messages
        displayMessages(contactId);
      }
    });
    
    // Add keypress event for Enter key
    messageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        newSendButton.click();
      }
    });
  }

  // Initialize
  renderContacts();
});
document.addEventListener('DOMContentLoaded', function() {
  // Mock data for contacts
  const contacts = [
    { id: 1, name: 'John Doe', lastMessage: 'Hey, when is our next session?', time: '10:23 AM', unread: true },
    { id: 2, name: 'Jane Smith', lastMessage: 'Thanks for the new meal plan!', time: 'Yesterday', unread: false },
    { id: 3, name: 'Mike Johnson', lastMessage: 'I completed all the exercises', time: 'Yesterday', unread: false },
    { id: 4, name: 'Sarah Williams', lastMessage: 'Looking forward to starting next week', time: 'Monday', unread: true },
    { id: 5, name: 'Chris Brown', lastMessage: 'How should I prepare for the session?', time: '3/15/2023', unread: false }
  ];
  
  // Mock data for messages
  const messagesByContact = {
    1: [
      { sender: 'client', text: 'Hey, when is our next session?', time: '10:23 AM' },
      { sender: 'me', text: 'Hi John! Our next session is scheduled for tomorrow at 5 PM.', time: '10:30 AM' },
      { sender: 'client', text: 'Perfect, thank you!', time: '10:32 AM' },
      { sender: 'me', text: 'Remember to bring your workout log.', time: '10:33 AM' }
    ],
    2: [
      { sender: 'me', text: 'Here\'s your updated meal plan for the next 2 weeks.', time: 'Yesterday, 9:15 AM' },
      { sender: 'client', text: 'Thanks for the new meal plan!', time: 'Yesterday, 12:42 PM' }
    ],
    3: [
      { sender: 'client', text: 'I completed all the exercises you assigned.', time: 'Yesterday, 8:05 PM' }
    ],
    4: [
      { sender: 'client', text: 'I just signed up. Looking forward to starting next week!', time: 'Monday, 2:30 PM' },
      { sender: 'me', text: 'Welcome Sarah! I\'m excited to start working with you. Let me know if you have any questions before our first session.', time: 'Monday, 3:15 PM' }
    ],
    5: [
      { sender: 'client', text: 'How should I prepare for the session?', time: '3/15/2023, 4:20 PM' },
      { sender: 'me', text: 'Just wear comfortable clothes and bring water. Everything else is provided at the gym.', time: '3/15/2023, 5:00 PM' }
    ]
  };
  
  let activeContact = null;
  const contactsList = document.getElementById('contacts-list');
  const messagesContainer = document.getElementById('messages-container');
  const currentContactName = document.getElementById('current-contact-name');
  const messageInput = document.getElementById('message-input');
  const sendMessageBtn = document.getElementById('send-message-btn');
  
  // Render contacts list
  function renderContacts() {
    if (!contactsList) return;
    
    contactsList.innerHTML = '';
    
    contacts.forEach(contact => {
      const contactEl = document.createElement('div');
      contactEl.className = `contact-item ${contact.id === activeContact ? 'active' : ''}`;
      contactEl.dataset.id = contact.id;
      
      contactEl.innerHTML = `
        <div class="contact-avatar">
          <i class="fas fa-user-circle"></i>
        </div>
        <div class="contact-info">
          <div class="contact-name">${contact.name}</div>
          <div class="contact-preview">${contact.lastMessage}</div>
        </div>
        <div class="contact-time">${contact.time}</div>
        ${contact.unread ? '<div class="contact-unread"></div>' : ''}
      `;
      
      contactEl.addEventListener('click', function() {
        activeContact = contact.id;
        renderContacts();
        loadMessages(contact.id);
        
        // Update current contact name
        if (currentContactName) {
          currentContactName.textContent = contact.name;
        }
        
        // Enable message input
        if (messageInput) {
          messageInput.disabled = false;
          messageInput.focus();
        }
        
        // Enable send button
        if (sendMessageBtn) {
          sendMessageBtn.disabled = false;
        }
        
        // Mark as read
        contact.unread = false;
      });
      
      contactsList.appendChild(contactEl);
    });
  }
  
  // Load messages for a contact
  function loadMessages(contactId) {
    if (!messagesContainer) return;
    
    messagesContainer.innerHTML = '';
    
    const messages = messagesByContact[contactId] || [];
    
    if (messages.length === 0) {
      messagesContainer.innerHTML = '<div class="no-messages-placeholder">No messages yet</div>';
      return;
    }
    
    messages.forEach(message => {
      const messageEl = document.createElement('div');
      messageEl.className = `message-bubble message-${message.sender === 'me' ? 'sent' : 'received'}`;
      messageEl.innerHTML = `
        <div class="message-text">${message.text}</div>
        <div class="message-time">${message.time}</div>
      `;
      
      messagesContainer.appendChild(messageEl);
    });
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
  
  // Send new message
  function sendMessage() {
    if (!messageInput || !messagesContainer || !activeContact) return;
    
    const text = messageInput.value.trim();
    if (!text) return;
    
    // Add to messages
    const newMessage = {
      sender: 'me',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    // Add to message list
    if (!messagesByContact[activeContact]) {
      messagesByContact[activeContact] = [];
    }
    messagesByContact[activeContact].push(newMessage);
    
    // Update contacts list with last message
    const contactIndex = contacts.findIndex(c => c.id === activeContact);
    if (contactIndex > -1) {
      contacts[contactIndex].lastMessage = text;
      contacts[contactIndex].time = 'Just now';
    }
    
    // Clear input
    messageInput.value = '';
    
    // Reload messages
    loadMessages(activeContact);
    renderContacts();
  }
  
  // Event listeners
  if (sendMessageBtn) {
    sendMessageBtn.addEventListener('click', sendMessage);
  }
  
  if (messageInput) {
    messageInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }
  
  // Initialize
  renderContacts();
});
