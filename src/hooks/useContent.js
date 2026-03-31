import { useState, useEffect } from 'react';
import { restaurantService } from '../services/restaurantService';

export const useContent = (lang) => {
  const [restaurants, setRestaurants] = useState([]);
  const [heroSlides, setHeroSlides] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoadingContent, setIsLoadingContent] = useState(true);

  useEffect(() => {
    const loadAllContent = async () => {
      setIsLoadingContent(true);
      try {
        const [resData, heroData, blogData] = await Promise.all([
          restaurantService.getAll(),
          restaurantService.getHeroSlides(lang),
          restaurantService.getBlogPosts(lang)
        ]);
        setRestaurants(resData);
        setHeroSlides(heroData);
        setBlogPosts(blogData);
      } catch (err) {
        if (import.meta.env.DEV) console.error('Failed to load content:', err);
      } finally {
        setIsLoadingContent(false);
      }
    };
    loadAllContent();
  }, [lang]);

  return { restaurants, heroSlides, blogPosts, isLoadingContent };
};
