
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Mock data API endpoints
let clients = [
  { id: 1, name: 'John Doe', email: 'john@example.com', age: 28, weight: 85, height: 180, goal: 'Weight loss' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 32, weight: 65, height: 165, goal: 'Muscle gain' },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', age: 45, weight: 92, height: 175, goal: 'General fitness' }
];

// API Routes
app.get('/api/clients', (req, res) => {
  res.json(clients);
});

app.post('/api/clients', (req, res) => {
  const newClient = {
    id: clients.length + 1,
    ...req.body
  };
  clients.push(newClient);
  res.status(201).json(newClient);
});

app.delete('/api/clients/:id', (req, res) => {
  const id = parseInt(req.params.id);
  clients = clients.filter(client => client.id !== id);
  res.status(200).json({ message: 'Client deleted successfully' });
});

app.get('/api/clients/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const client = clients.find(client => client.id === id);
  if (client) {
    res.json(client);
  } else {
    res.status(404).json({ message: 'Client not found' });
  }
});

// Page Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/clients', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'clients.html'));
});

app.get('/client/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'client-details.html'));
});

app.get('/programs', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'programs.html'));
});

app.get('/calendar', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'calendar.html'));
});

app.get('/messages', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'messages.html'));
});

// Default fallback route for any other request
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
