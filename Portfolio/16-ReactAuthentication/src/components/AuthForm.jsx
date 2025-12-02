import React, { useState } from 'react';
import { Button, Form, Card, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';

function AuthForm({ onAuth, mode = 'login' }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {

      const url = mode === 'login'
        ? 'http://localhost:4000/api/login'
        : 'http://localhost:4000/api/signup';
      const res = await axios.post(url, form);
      onAuth(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error');
    }
  };

  return (
    <Card className="mb-4 bg-dark text-light border-0 shadow-sm">
      <Card.Body>
        <Card.Title className="mb-3 text-center">{mode === 'login' ? 'Login' : 'Sign Up'}</Card.Title>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Username"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </Form.Group>
          {error && <Alert variant="danger">{error}</Alert>}
          <Row className="g-2">
            <Col xs={12} className="d-grid">
              <Button type="submit" variant="warning" className="fw-bold">
                {mode === 'login' ? 'Login' : 'Sign Up'}
              </Button>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default AuthForm;
