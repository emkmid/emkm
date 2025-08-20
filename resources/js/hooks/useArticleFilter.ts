import { useMemo, useState } from 'react';

interface Article {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    published_at: string;
    author?: string;
    reading_time?: number;
    category?: string;
}

interface UseArticleFilterProps {
    articles: Article[];
    initialCategory?: string;
}

export const useArticleFilter = ({ articles, initialCategory = 'all' }: UseArticleFilterProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');

    // Get unique categories from articles
    const categories = useMemo(() => {
        const uniqueCategories = Array.from(new Set(articles.map((article) => article.category).filter(Boolean))) as string[];
        return ['all', ...uniqueCategories];
    }, [articles]);

    // Filter and sort articles
    const filteredArticles = useMemo(() => {
        let filtered = articles;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(
                (article) =>
                    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    article.author?.toLowerCase().includes(searchTerm.toLowerCase()),
            );
        }

        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter((article) => article.category?.toLowerCase() === selectedCategory.toLowerCase());
        }

        // Sort articles
        switch (sortBy) {
            case 'newest':
                filtered.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
                break;
            case 'oldest':
                filtered.sort((a, b) => new Date(a.published_at).getTime() - new Date(b.published_at).getTime());
                break;
            case 'title':
                filtered.sort((a, b) => a.title.localeCompare(b.title));
                break;
        }

        return filtered;
    }, [articles, searchTerm, selectedCategory, sortBy]);

    // Reset filters
    const resetFilters = () => {
        setSearchTerm('');
        setSelectedCategory('all');
        setSortBy('newest');
    };

    // Search with highlight
    const getHighlightedText = (text: string, highlight: string) => {
        if (!highlight) return text;

        const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
        return parts.map((part, index) => (part.toLowerCase() === highlight.toLowerCase() ? `<mark key=${index}>${part}</mark>` : part)).join('');
    };

    return {
        // State
        searchTerm,
        selectedCategory,
        sortBy,

        // Actions
        setSearchTerm,
        setSelectedCategory,
        setSortBy,
        resetFilters,

        // Computed
        filteredArticles,
        categories,
        getHighlightedText,

        // Stats
        totalArticles: articles.length,
        filteredCount: filteredArticles.length,
        hasActiveFilters: searchTerm !== '' || selectedCategory !== 'all',
    };
};
