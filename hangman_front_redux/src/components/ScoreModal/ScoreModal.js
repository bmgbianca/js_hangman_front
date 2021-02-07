import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { selectId } from '../../features/idSlice';
import { useSelector } from 'react-redux';
import { getScore } from '../../services/requestsServices';
import './ScoreModal.css';

Modal.setAppElement('#root');

export default function ScoreModal({ source, message, closeModal }) {
  const [score, setScore] = useState(null);
  const [scoreClass, setScoreClass] = useState('longMessage');
  const id = useSelector(selectId);

  useEffect(() => {
    getFriendScore();
  }, [id]);

  const getFriendScore = async () => {
    const friendScore = await getScore(id);
    setScore(friendScore.data);
    if (typeof friendScore.data === 'number') {
      setScoreClass('shortMessage');
    } else {
      setScoreClass('longMessage');
    }
  };

  const handleClose = (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  };

  return (
    <div onKeyUp={handleClose}>
      <Modal className="modal" isOpen={true}>
        <button className="btn btn-sm closeButton" onClick={closeModal}>
          X
        </button>
        <h1>{message}</h1>
        <div>
          <p className={scoreClass}>{score}</p>
        </div>
        {source && (
          <button className="btn btn-lg refreshButton" onClick={getFriendScore}>
            ATUALIZAR <i className="bi-arrow-clockwise"></i>
          </button>
        )}
      </Modal>
    </div>
  );
}
