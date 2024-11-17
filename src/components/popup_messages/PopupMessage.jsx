import React from 'react';
import PropTypes from 'prop-types';
import './PopupMessage.css'; // Assuming you have some CSS file for styling

function Popup({ type, message, onOK, onTryAgain }) {
  return (
    <div className={`popup-message ${type}`}>
      <div className="popup-content">
        <p>{message}</p>
        {type === 'success' && <button className='butPopup' onClick={onOK}>OK</button>}
        {type === 'error' && <button className='butPopup' onClick={onTryAgain}>Try Again</button>}
      </div>
    </div>
  );
};

Popup.propTypes = {
  type: PropTypes.oneOf(['success', 'error']).isRequired,
  message: PropTypes.string.isRequired,
  onOK: PropTypes.func, 
  onTryAgain: PropTypes.func,
};





export default Popup;
