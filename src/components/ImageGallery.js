import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import config from '../config';
import ImageUploadModal from './ImageUploadModal';
import ImageEditModal from './ImageEditModal';

Modal.setAppElement('#root');

const ImageGallery = () => {
    const [images, setImages] = useState([]);
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
    const [imageModalIsOpen, setImageModalIsOpen] = useState(false);
    const [uploadModalIsOpen, setUploadModalIsOpen] = useState(false);
    const [editModalIsOpen, setEditModalIsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageToDelete, setImageToDelete] = useState(null);
    const [imageToEdit, setImageToEdit] = useState(null);


    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const response = await fetch(`${config.apiUrl}/api/images`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setImages(data);
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    };

    const openDeleteModal = (image) => {
        setImageToDelete(image);
        setDeleteModalIsOpen(true);
    };

    const closeDeleteModal = () => {
        setDeleteModalIsOpen(false);
        setImageToDelete(null);
    };

    const openImageModal = (image) => {
        setSelectedImage(image);
        setImageModalIsOpen(true);
    };

    const closeImageModal = () => {
        setImageModalIsOpen(false);
        setSelectedImage(null);
    };

    const openEditModal = (image) => {
        setImageToEdit(image);
        setEditModalIsOpen(true);
    };

    const closeEditModal = () => {
        setEditModalIsOpen(false);
        setImageToEdit(null);
    };

    const handleEditSuccess = (editedImage) => {
        setImages(images.map(img => img.id === editedImage.id ? editedImage : img));
        closeEditModal();
    };

    const deleteImage = async () => {
        if (!imageToDelete) return;

        try {
            const response = await fetch(`${config.apiUrl}/api/images/${imageToDelete.id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setImages(images.filter(image => image.id !== imageToDelete.id));
                closeDeleteModal();
            } else {
                console.error('Failed to delete image');
            }
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };

    const openUploadModal = () => {
        setUploadModalIsOpen(true);
    };

    const closeUploadModal = () => {
        setUploadModalIsOpen(false);
    };

    const handleUploadSuccess = () => {
        fetchImages();
        closeUploadModal();
    };

    return (
        <>
            <div className="mb-4">
                <button
                    onClick={openUploadModal}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                >
                    Upload New Image
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map(image => (
                    <div key={image.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <img
                            src={`${config.apiUrl}${image.url}`}
                            alt={image.title}
                            className="w-full h-48 object-cover cursor-pointer"
                            onClick={() => openImageModal(image)}
                        />
                        <div className="p-4">
                            <h2 className="text-xl font-semibold">{image.title}</h2>
                            <p className="text-gray-600 mt-2">{image.description}</p>
                            <div className="mt-4 flex justify-between">
                                <button
                                    onClick={() => openEditModal(image)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => openDeleteModal(image)}
                                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={deleteModalIsOpen}
                onRequestClose={closeDeleteModal}
                contentLabel="Delete Confirmation"
                className="modal"
                overlayClassName="overlay"
            >
                <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
                    <h2 className="text-2xl font-bold mb-4">Confirm Deletion</h2>
                    <p className="mb-6">Are you sure you want to delete this image?</p>
                    <div className="flex justify-end space-x-4">
                        <button
                            onClick={closeDeleteModal}
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={deleteImage}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Image View Modal */}
            <Modal
                isOpen={imageModalIsOpen}
                onRequestClose={closeImageModal}
                contentLabel="Image View"
                className="image-modal"
                overlayClassName="overlay"
            >
                {selectedImage && (
                    <div className="flex flex-col items-center">
                        <img
                            src={`${config.apiUrl}${selectedImage.url}`}
                            alt={selectedImage.title}
                            className="max-w-full max-h-[80vh] object-contain"
                        />
                        <div className="mt-4 text-center">
                            <h2 className="text-2xl font-bold">{selectedImage.title}</h2>
                            <p className="text-gray-600 mt-2">{selectedImage.description}</p>
                        </div>
                        <button
                            onClick={closeImageModal}
                            className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                        >
                            Close
                        </button>
                    </div>
                )}
            </Modal>

            <ImageUploadModal
                isOpen={uploadModalIsOpen}
                onRequestClose={closeUploadModal}
                onUploadSuccess={handleUploadSuccess}
            />

            <ImageEditModal
                isOpen={editModalIsOpen}
                onRequestClose={closeEditModal}
                onEditSuccess={handleEditSuccess}
                image={imageToEdit}
            />
        </>
    );
};

export default ImageGallery;
