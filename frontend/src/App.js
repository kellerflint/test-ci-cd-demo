import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch(`${API_URL}/api/items`);
      const data = await response.json();
      setItems(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch items');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const response = await fetch(`${API_URL}/api/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      
      if (response.ok) {
        setName('');
        fetchItems();
        setError('');
      } else {
        setError('Failed to create item');
      }
    } catch (err) {
      setError('Failed to create item');
    }
  };

  return (
    <div className="App">
      <h1>Demo App</h1>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter item name"
          data-testid="item-input"
        />
        <button type="submit" data-testid="add-button">Add Item</button>
      </form>

      {error && <p className="error" data-testid="error">{error}</p>}

      <div className="items-list">
        <h2>Items</h2>
        {items.length === 0 ? (
          <p data-testid="no-items">No items yet</p>
        ) : (
          <ul data-testid="items-list">
            {items.map((item) => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
