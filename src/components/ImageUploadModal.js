import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Modal from 'react-modal';
import config from '../config';

const ImageUploadModal = ({ isOpen, onRequestClose, onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const onDrop = useCallback((acceptedFiles) => {
        const acceptedFile = acceptedFiles[0];
        setFile(acceptedFile);
        setTitle(acceptedFile.name.split('.').slice(0, -1).join('.'));
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'image/*' });

    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        formData.append('description', description);

        try {
            const response = await fetch(`${config.apiUrl}/api/images`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                onUploadSuccess();
                onRequestClose();
            } else {
                console.error('Upload failed');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Upload Image"
            className="modal"
            overlayClassName="overlay"
        >
            <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
                <h2 className="text-2xl font-bold mb-4">Upload New Image</h2>
                {!file ? (
                    <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer">
                        <input {...getInputProps()} />
                        {isDragActive ? (
                            <p>Drop the image here ...</p>
                        ) : (
                            <p>Drag 'n' drop an image here, or click to select an image</p>
                        )}
                    </div>
                ) : (
                    <div className="mb-4">
                        <p className="text-green-600">Image selected: {file.name}</p>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Title"
                            className="w-full p-2 border rounded mt-2"
                        />
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Description"
                            className="w-full p-2 border rounded mt-2"
                            rows="3"
                        />
                    </div>
                )}
                <div className="flex justify-end space-x-4 mt-4">
                    <button
                        onClick={onRequestClose}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpload}
                        disabled={!file}
                        className={`px-4 py-2 text-white rounded transition duration-200 ${file ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'}`}
                    >
                        Upload
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ImageUploadModal;
