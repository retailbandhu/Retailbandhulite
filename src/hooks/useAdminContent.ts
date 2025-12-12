import { useState, useEffect } from 'react';
import {
  getLandingPageContent,
  getFeatures,
  getTestimonials,
  getPricingPlans,
  refreshAllContent,
} from '../utils/adminContent';

/**
 * Hook to fetch and use landing page content from CMS
 */
export function useLandingPageContent() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    const data = await getLandingPageContent();
    setContent(data);
    setLoading(false);
  };

  const refresh = () => {
    loadContent();
  };

  return { content, loading, refresh };
}

/**
 * Hook to fetch and use features from CMS
 */
export function useFeatures() {
  const [features, setFeatures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeatures();
  }, []);

  const loadFeatures = async () => {
    setLoading(true);
    const data = await getFeatures();
    setFeatures(data);
    setLoading(false);
  };

  const refresh = () => {
    loadFeatures();
  };

  return { features, loading, refresh };
}

/**
 * Hook to fetch and use testimonials from CMS
 */
export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    setLoading(true);
    const data = await getTestimonials();
    setTestimonials(data);
    setLoading(false);
  };

  const refresh = () => {
    loadTestimonials();
  };

  return { testimonials, loading, refresh };
}

/**
 * Hook to fetch and use pricing plans from CMS
 */
export function usePricingPlans() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    setLoading(true);
    const data = await getPricingPlans();
    setPlans(data);
    setLoading(false);
  };

  const refresh = () => {
    loadPlans();
  };

  return { plans, loading, refresh };
}

/**
 * Hook to use all admin content at once
 */
export function useAllAdminContent() {
  const landingPage = useLandingPageContent();
  const features = useFeatures();
  const testimonials = useTestimonials();
  const pricing = usePricingPlans();

  const loading = landingPage.loading || features.loading || testimonials.loading || pricing.loading;

  const refresh = async () => {
    await refreshAllContent();
    landingPage.refresh();
    features.refresh();
    testimonials.refresh();
    pricing.refresh();
  };

  return {
    landingPage: landingPage.content,
    features: features.features,
    testimonials: testimonials.testimonials,
    pricing: pricing.plans,
    loading,
    refresh,
  };
}
