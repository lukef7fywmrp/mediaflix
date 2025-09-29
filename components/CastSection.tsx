import React from 'react';

interface Actor {
  name: string;
  character?: string;
  profile_path?: string;
}

interface CastSectionProps {
  actors: Actor[];
}

const CastSection: React.FC<CastSectionProps> = ({ actors }) => {
  const getInitials = (name: string): string => {
    const words = name.trim().split(' ');
    if (words.length === 0) return '';
    
    // Get first character of first word
    const firstInitial = words[0].charAt(0).toUpperCase();
    
    // Get first character of second word if it exists, otherwise first character of first word
    const secondInitial = words.length > 1 
      ? words[1].charAt(0).toUpperCase()
      : words[0].charAt(1) || words[0].charAt(0).toUpperCase();
    
    return firstInitial + secondInitial;
  };

  return (
    <div className="cast-section">
      <h3>Cast</h3>
      <div className="cast-grid">
        {actors.map((actor, index) => (
          <div key={index} className="actor-card">
            <div className="actor-avatar">
              {actor.profile_path ? (
                <img 
                  src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                  alt={actor.name}
                  onError={(e) => {
                    // Fallback to initials if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const initialsDiv = target.nextElementSibling as HTMLElement;
                    if (initialsDiv) {
                      initialsDiv.style.display = 'flex';
                    }
                  }}
                />
              ) : null}
              <div 
                className="avatar-fallback"
                style={{ display: actor.profile_path ? 'none' : 'flex' }}
              >
                {getInitials(actor.name)}
              </div>
            </div>
            <div className="actor-info">
              <div className="actor-name">{actor.name}</div>
              {actor.character && (
                <div className="actor-character">{actor.character}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CastSection;