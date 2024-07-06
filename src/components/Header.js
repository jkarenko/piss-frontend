import React from 'react';

const Header = () => {
    const title = "Pretty Interesting Sky Sightings";
    const words = title.split(" ");

    return (
        <header className="bg-blue-500 text-white p-4">
            <h1 className="text-2xl font-bold flex items-baseline justify-center">
                {words.map((word, index) => (
                    <span key={index} className="mx-1 inline-flex items-baseline">
                        <span className="text-4xl font-extrabold">{word[0]}</span>
                        <span className="text-xs align-text-top">{word.slice(1)}</span>
                    </span>
                ))}
            </h1>
        </header>
    );
};

export default Header;
