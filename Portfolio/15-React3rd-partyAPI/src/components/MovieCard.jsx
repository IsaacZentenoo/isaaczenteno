import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function MovieCard({ movie }) {
  const navigate = useNavigate();

  return (
    <Card className="mb-4">
      <Card.Img variant="top" src={`/images/${movie.poster}`} />
      <Card.Body>
        <Card.Title>{movie.title} ({movie.year})</Card.Title>
        <Button variant="primary" onClick={() => navigate(`/movie/${movie._id}`)}>
          Details
        </Button>
      </Card.Body>
    </Card>
  );
}

export default MovieCard;
