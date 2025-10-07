export const StarIcon = ({ isFilled, onClick }) => (
    <button 
        className={`star-icon ${isFilled ? 'filled' : 'empty'}`}
        onClick={onClick}
        aria-label={isFilled ? 'Remove from watchlist' : 'Add to watchlist'}
    >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
    </button>
);