import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CommentSection({ movieId }) {
  const [comments, setComments] = useState([]);
  const [form, setForm] = useState({ name: '', text: '' });

  useEffect(() => {
    axios.get(`http://localhost:4000/api/movies/${movieId}/comments`).then(res => setComments(res.data));
  }, [movieId]);

  const handleSubmit = e => {
    e.preventDefault();
    axios.post(`http://localhost:4000/api/movies/${movieId}/comments`, form)
      .then(res => setComments([...comments, res.data]));
    setForm({ name: '', text: '' });
  };

  return (
    <div>
      <h4>Comments</h4>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          required
        />
        <textarea
          placeholder="Comment"
          value={form.text}
          onChange={e => setForm({ ...form, text: e.target.value })}
          required
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {comments.map((c, i) => (
          <li key={i}><strong>{c.name}:</strong> {c.text}</li>
        ))}
      </ul>
    </div>
  );
}

export default CommentSection;
