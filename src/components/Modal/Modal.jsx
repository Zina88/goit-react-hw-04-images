import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import css from './Modal.module.css';
import { AiOutlineCloseCircle } from 'react-icons/ai';

const modalRoot = document.querySelector('#modal-root');

export default function Modal({ image, onClickModal }) {
  useEffect(() => {
    const handleKeyDown = e => {
      if (e.code === 'Escape') {
        onClickModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClickModal]);

  const handleBackdropClick = e => {
    if (e.target === e.currentTarget) {
      onClickModal();
    }
  };

  return createPortal(
    <div className={css.overlay} onClick={handleBackdropClick}>
      <div className={css.modal}>
        <img src={image} alt={image.tags} />
      </div>
    </div>,
    modalRoot,
  );
}

Modal.propTypes = {
  image: PropTypes.string.isRequired,
  onClickModal: PropTypes.func.isRequired,
};
