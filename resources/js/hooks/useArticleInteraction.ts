import { useEffect, useRef, useState } from 'react';

interface UseArticleInteractionProps {
    initialLikes?: number;
    articleId: number;
    articleSlug: any;
}

export const useArticleInteraction = ({ initialLikes = 0, articleId, articleSlug }: UseArticleInteractionProps) => {
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(initialLikes);
    const [readingProgress, setReadingProgress] = useState(0);
    const [isSticky, setIsSticky] = useState(false);
    const [timeSpent, setTimeSpent] = useState(0);

    // Use ref to store start time to avoid effect restarts
    const startTimeRef = useRef<number>(Date.now());
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        const fetchLikeStatus = async () => {
            try {
                const res = await fetch(`/education/articles/${articleSlug}/like/status`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                    },
                    credentials: 'include',
                });

                if (!res.ok) throw new Error('Failed to fetch like status');

                const data = await res.json();
                setIsLiked(data.liked);
                setLikesCount(data.totalLikes);
            } catch (err) {
                console.log(err);
            }
        };

        fetchLikeStatus();
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
        // Reset start time for new article
        startTimeRef.current = Date.now();
        setTimeSpent(0);

        const updateTimeSpent = () => {
            const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
            setTimeSpent(elapsed);
        };

        // Update immediately
        updateTimeSpent();

        // Then update every second
        intervalRef.current = setInterval(updateTimeSpent, 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }

            // Send analytics data here
            const finalTimeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
            console.log(`Article ${articleId} read for ${finalTimeSpent} seconds`);
        };
    }, [articleId]); // Only depend on articleId

    // Like functionality
    const toggleLike = async () => {
        try {
            const res = await fetch(`/education/articles/${articleSlug}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
                credentials: 'include',
            });

            if (!res.ok) throw new Error('Failed to toggle like');

            const data = await res.json();
            setIsLiked(data.liked);
            setLikesCount(data.totalLikes);
        } catch (err) {
            console.log(err);
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
