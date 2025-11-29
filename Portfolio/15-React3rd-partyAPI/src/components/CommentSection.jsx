import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Form, Button, ListGroup, Row, Col } from 'react-bootstrap';

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
    <Card className="mb-4 bg-dark text-light border-0 shadow-sm">
      <Card.Body>
        <Card.Title className="mb-3">Comments</Card.Title>
        <Form onSubmit={handleSubmit} className="mb-4">
          <Row className="g-2">
            <Col xs={12} md={3}>
              <Form.Control
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
                className="mb-2"
              />
            </Col>
            <Col xs={12} md={7}>
              <Form.Control
                as="textarea"
                rows={1}
                placeholder="Write a comment..."
                value={form.text}
                onChange={e => setForm({ ...form, text: e.target.value })}
                required
                className="mb-2"
              />
            </Col>
            <Col xs={12} md={2} className="d-grid">
              <Button type="submit" variant="warning" className="fw-bold">
                Add
              </Button>
            </Col>
          </Row>
        </Form>
        <ListGroup variant="flush">
          {comments.length === 0 && (
            <ListGroup.Item className="bg-dark text-muted border-0">No comments yet.</ListGroup.Item>
          )}
          {comments.map((c, i) => (
            <ListGroup.Item key={i} className="bg-dark text-light border-0 px-0 py-3">
              <div className="d-flex align-items-center gap-3">
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: '#222',
                  color: '#ffe81f',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '1.2em',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.10)'
                }}>
                  {c.name ? c.name[0].toUpperCase() : '?'}
                </div>
                <div>
                  <div className="fw-bold text-warning mb-1">{c.name || 'Anonymous'}</div>
                  <div style={{ fontSize: '0.98em' }}>{c.text}</div>
                </div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );
}

export default CommentSection;
