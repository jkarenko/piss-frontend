import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import config from '../config';

const ImageEditModal = ({ isOpen, onRequestClose, onEditSuccess, image }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (image) {
            setTitle(image.title);
            setDescription(image.description);
        }
    }, [image]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!image) return;

        try {
            const response = await fetch(`${config.apiUrl}/api/images/${image.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, description }),
            });

            if (response.ok) {
                const updatedImage = await response.json();
                onEditSuccess(updatedImage);
            } else {
                console.error('Failed to update image');
            }
        } catch (error) {
            console.error('Error updating image:', error);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Edit Image"
            className="modal"
            overlayClassName="overlay"
        >
            <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
                <h2 className="text-2xl font-bold mb-4">Edit Image</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            rows="3"
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onRequestClose}
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default ImageEditModal;
