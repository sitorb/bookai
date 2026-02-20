import React, { useState } from 'react';

const Discovery = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [books, setBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        if (!searchTerm.trim()) return;

        setIsLoading(true);
        console.log("🚀 Отправка запроса к AI:", searchTerm);

        try {
            const response = await fetch('http://127.0.0.1:8000/api/recommend/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Если у тебя включена авторизация в Django, добавь токен:
                    // 'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ query: searchTerm }),
            });

            if (!response.ok) {
                throw new Error('Ошибка сервера');
            }

            const data = await response.json();
            console.log("📚 Получены книги от бэкенда:", data);
            setBooks(data);
        } catch (error) {
            console.error("❌ Ошибка при поиске:", error);
            alert("Не удалось получить рекомендации. Проверь терминал Django.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDF6E3] p-8 text-[#5D4037] flex flex-col items-center">            {/* Заголовок в осеннем стиле */}
            <header className="text-center mb-12">
                <h1 className="text-5xl font-serif mb-4">
                    The <span className="italic text-[#AF5F3C]">Autumn</span> Librarian
                </h1>
                <p className="text-lg italic opacity-80">
                    “Books are a uniquely portable magic.”
                </p>
            </header>

            {/* Поле поиска */}
            <div className="max-w-3xl mx-auto mb-16">
                <div className="relative group">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="I feel sad and i want a book to cheer me up..."
                        className="w-full p-5 rounded-full border-2 border-[#D7CCC8] bg-white/50 
                                   focus:outline-none focus:border-[#AF5F3C] transition-all
                                   text-lg shadow-sm group-hover:shadow-md"
                    />
                    <button
                        onClick={handleSearch}
                        disabled={isLoading}
                        className="absolute right-2 top-2 bottom-2 px-8 bg-[#8D6E63] text-white 
                                   rounded-full hover:bg-[#5D4037] transition-colors uppercase font-bold text-sm"
                    >
                        {isLoading ? 'Thinking...' : 'Consult Archives'}
                    </button>
                </div>
            </div>

            {/* Список результатов */}
            <div className="max-w-4xl mx-auto space-y-12">
                {books.length > 0 ? (
                    books.map((book) => (
                        <div key={book.id} className="border-b border-[#D7CCC8] pb-8 animate-fadeIn">
                            <h2 className="text-2xl font-bold mb-1">{book.title}</h2>
                            <p className="text-[#AF5F3C] italic mb-4">By {book.author || 'Unknown Author'}</p>
                            <p className="leading-relaxed text-justify opacity-90">
                                {book.summary || book.description || 'No description available for this ancient scroll.'}
                            </p>
                        </div>
                    ))
                ) : (
                    !isLoading && (
                        <div className="text-center opacity-50 italic">
                            {searchTerm ? "The archives are silent on this matter..." : "Tell the Librarian how you feel today."}
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default Discovery;