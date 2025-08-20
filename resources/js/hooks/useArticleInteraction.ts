import { useEffect, useState } from 'react';

interface UseArticleInteractionProps {
    initialLikes?: number;
    articleId: number;
}

export const useArticleInteraction = ({ initialLikes = 0, articleId }: UseArticleInteractionProps) => {
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(initialLikes);
    const [readingProgress, setReadingProgress] = useState(0);
    const [isSticky, setIsSticky] = useState(false);
    const [timeSpent, setTimeSpent] = useState(0);

    // Check if article is already liked (from localStorage or API)
    useEffect(() => {
        const likedArticles = JSON.parse(localStorage.getItem('likedArticles') || '[]');
        setIsLiked(likedArticles.includes(articleId));
    }, [articleId]);

    // Track reading progress
    useEffect(() => {
        const updateReadingProgress = () => {
            const article = document.getElementById('article-content');
            if (!article) return;

            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;
            const articleTop = article.offsetTop;
            const articleHeight = article.offsetHeight;

            const progress = Math.min(100, Math.max(0, ((scrollTop - articleTop + windowHeight) / articleHeight) * 100));

            setReadingProgress(progress);
        };

        const handleScroll = () => {
            updateReadingProgress();
            setIsSticky(window.scrollY > 200);
        };

        window.addEventListener('scroll', handleScroll);
        updateReadingProgress();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Track time spent reading
    useEffect(() => {
        const startTime = Date.now();

        const updateTimeSpent = () => {
            setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
        };

        const interval = setInterval(updateTimeSpent, 1000);

        return () => {
            clearInterval(interval);
            // Send analytics data here
            console.log(`Article ${articleId} read for ${timeSpent} seconds`);
        };
    }, [articleId, timeSpent]);

    // Like functionality
    const toggleLike = async () => {
        const newLikedState = !isLiked;
        setIsLiked(newLikedState);
        setLikesCount((prev) => (newLikedState ? prev + 1 : prev - 1));

        // Update localStorage
        const likedArticles = JSON.parse(localStorage.getItem('likedArticles') || '[]');
        if (newLikedState) {
            likedArticles.push(articleId);
        } else {
            const index = likedArticles.indexOf(articleId);
            if (index > -1) likedArticles.splice(index, 1);
        }
        localStorage.setItem('likedArticles', JSON.stringify(likedArticles));

        // TODO: Send to backend API
        try {
            // await fetch(`/api/articles/${articleId}/like`, {
            //     method: newLikedState ? 'POST' : 'DELETE',
            //     headers: { 'Content-Type': 'application/json' }
            // });
        } catch (error) {
            // Revert on error
            setIsLiked(!newLikedState);
            setLikesCount((prev) => (newLikedState ? prev - 1 : prev + 1));
        }
    };

    // Share functionality with multiple options
    const shareArticle = async (method: 'native' | 'copy' | 'twitter' | 'facebook' = 'native') => {
        const url = window.location.href;
        const title = document.title;
        const text = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';

        switch (method) {
            case 'native':
                if (navigator.share) {
                    try {
                        await navigator.share({ title, text, url });
                        return { success: true, method: 'native' };
                    } catch (err) {
                        if (err instanceof Error && err.name !== 'AbortError') {
                            return shareArticle('copy');
                        }
                        return { success: false, error: err };
                    }
                } else {
                    return shareArticle('copy');
                }
                break;

            case 'copy':
                try {
                    await navigator.clipboard.writeText(url);
                    return { success: true, method: 'copy' };
                } catch (err) {
                    return { success: false, error: err };
                }

            case 'twitter':
                const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
                window.open(twitterUrl, '_blank', 'width=550,height=420');
                return { success: true, method: 'twitter' };

            case 'facebook':
                const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                window.open(facebookUrl, '_blank', 'width=550,height=420');
                return { success: true, method: 'facebook' };

            default:
                return { success: false, error: 'Unknown share method' };
        }
    };

    // Print article
    const printArticle = () => {
        // Add print-specific styles temporarily
        const printStyles = document.createElement('style');
        printStyles.textContent = `
            @media print {
                body * { visibility: hidden; }
                #article-content, #article-content * { visibility: visible; }
                #article-content { position: absolute; left: 0; top: 0; width: 100%; }
                .no-print { display: none !important; }
            }
        `;
        document.head.appendChild(printStyles);

        window.print();

        // Remove print styles after printing
        setTimeout(() => {
            document.head.removeChild(printStyles);
        }, 1000);
    };

    // Format reading time
    const formatReadingTime = (seconds: number) => {
        if (seconds < 60) return `${seconds} detik`;
        const minutes = Math.floor(seconds / 60);
        return `${minutes} menit`;
    };

    // Calculate estimated reading completion
    const getReadingCompletion = () => {
        if (readingProgress >= 80) return 'Hampir selesai';
        if (readingProgress >= 50) return 'Setengah jalan';
        if (readingProgress >= 20) return 'Baru mulai';
        return 'Belum mulai';
    };

    return {
        // State
        isLiked,
        likesCount,
        readingProgress,
        isSticky,
        timeSpent,

        // Actions
        toggleLike,
        shareArticle,
        printArticle,

        // Computed
        formattedTimeSpent: formatReadingTime(timeSpent),
        readingCompletion: getReadingCompletion(),

        // Helpers
        formatReadingTime,
    };
};
