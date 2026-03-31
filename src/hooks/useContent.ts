import { useState, useEffect } from 'react';
import { restaurantService, Restaurant } from '../services/restaurantService';

export interface HeroSlide {
  id: string | number;
  name: string;
  tagline: string;
  desc: string;
  image: string;
  link: string;
}

export interface BlogPost {
  id: string | number;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  date: string;
  slug: string;
  category: string;
  content: string;
}

export const useContent = (lang: string) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(true);

  useEffect(() => {
    const loadAllContent = async () => {
      setIsLoadingContent(true);
      try {
        const [resData, heroData, blogData] = await Promise.all([
          restaurantService.getAll(),
          restaurantService.getHeroSlides(lang),
          restaurantService.getBlogPosts(lang)
        ]);
        setRestaurants(resData as Restaurant[]);
        setHeroSlides(heroData as HeroSlide[]);
        setBlogPosts(blogData as BlogPost[]);
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
