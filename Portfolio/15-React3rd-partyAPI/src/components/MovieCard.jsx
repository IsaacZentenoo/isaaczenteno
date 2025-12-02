import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function MovieCard({ movie }) {
  const navigate = useNavigate();


  const affiliation = movie.best_character?.affiliation?.toLowerCase();
  let avatar = '/images/default-character.png';
  if (affiliation === 'jedi') avatar = '/images/jedi.png';
  else if (affiliation === 'sith') avatar = '/images/sith.png';
  else if (affiliation === 'rebel' || affiliation === 'rebellion') avatar = '/images/rebel.png';
  else if (affiliation === 'empire') avatar = '/images/empire.png';

  return (
    <Card className="mb-4 bg-dark text-light border-0 shadow-sm">
      <div className="d-flex justify-content-center align-items-center pt-3">
        <img
          src={avatar}
          alt={affiliation || 'avatar'}
          style={{ width: 48, height: 48, borderRadius: '50%', background: '#222', objectFit: 'cover', marginBottom: 8 }}
        />
      </div>
      <Card.Img variant="top" src={`/images/${movie.poster}`} style={{ maxHeight: 320, objectFit: 'cover' }} />
      <Card.Body>
        <Card.Title className="text-center">{movie.title} ({movie.year})</Card.Title>
        <Button variant="warning" className="w-100 fw-bold" onClick={() => navigate(`/movie/${movie._id}`)}>
          Details
        </Button>
      </Card.Body>
    </Card>
  );
}

export default MovieCard;
