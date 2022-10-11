import React, { useState, useEffect } from 'react';
import fetchGallery from '../services/api';
import ImageGallery from './ImageGallery';
import Searchbar from './Searchbar';
import Button from './Button';
import Loader from './Loader';
import Modal from './Modal';
import { Report } from 'notiflix/build/notiflix-report-aio';
import css from './App.module.css';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [bigImage, setBigImage] = useState('');
  const [visibleButton, setVisibleButton] = useState(false);

  useEffect(() => {
    if (!searchQuery) {
      return;
    }

    setIsLoading(true);
    setVisibleButton(false);

    fetchGallery(searchQuery, page)
      .then(data => {
        setImages(prevImages => {
          return [...prevImages, ...data.hits];
        });

        if (data.totalHits === 0) {
          return Report.warning('Not found!', 'Sorry, Nothing found', 'Close');
        }

        if (data.totalHits <= 12 * page) {
          setVisibleButton(false);
        } else {
          setVisibleButton(true);
        }

        if (page > 1) {
          window.scrollTo({
            top: document.body.clientHeight,
            behavior: 'smooth',
          });
        }
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [searchQuery, page]);

  const handleFormSubmit = data => {
    setSearchQuery(data);
    setImages([]);
    setPage(1);
  };

  const onLoadMore = () => {
    setPage(page + 1);
  };

  const toggleModal = largeImageURL => {
    setShowModal(!showModal);
    setBigImage(largeImageURL);
  };

  return (
    <div className={css.container}>
      <Searchbar onSubmit={handleFormSubmit} />
      {showModal && <Modal image={bigImage} onClickModal={toggleModal} />}

      {images.length !== 0 && <ImageGallery images={images} toggleModal={toggleModal} />}
      {isLoading && <Loader />}
      {visibleButton && <Button onClick={onLoadMore} />}
    </div>
  );
}
