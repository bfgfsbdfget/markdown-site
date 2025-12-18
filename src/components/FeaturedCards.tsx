import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

// Type for featured item from Convex (used for backwards compatibility)
export interface FeaturedItem {
  slug: string;
  type: "post" | "page";
}

// Type for featured data from Convex queries
interface FeaturedData {
  slug: string;
  title: string;
  excerpt: string;
  type: "post" | "page";
}

interface FeaturedCardsProps {
  // Optional: legacy items config (for backwards compatibility)
  items?: FeaturedItem[];
  // New: use Convex queries directly (when items is not provided)
  useFrontmatter?: boolean;
}

// Featured cards component displays posts/pages as cards with excerpts
// Supports two modes:
// 1. items prop: uses hardcoded config (legacy, requires redeploy)
// 2. useFrontmatter: uses featured field from markdown frontmatter (syncs with npm run sync)
export default function FeaturedCards({
  items,
  useFrontmatter = true,
}: FeaturedCardsProps) {
  // Fetch featured posts and pages from Convex
  const featuredPosts = useQuery(api.posts.getFeaturedPosts);
  const featuredPages = useQuery(api.pages.getFeaturedPages);

  // Fetch all posts and pages (for legacy items mode)
  const allPosts = useQuery(api.posts.getAllPosts);
  const allPages = useQuery(api.pages.getAllPages);

  // Build featured data from frontmatter (new mode)
  const getFeaturedFromFrontmatter = (): FeaturedData[] => {
    if (featuredPosts === undefined || featuredPages === undefined) {
      return [];
    }

    // Combine and sort by featuredOrder
    const combined: (FeaturedData & { featuredOrder?: number })[] = [
      ...featuredPosts.map((p) => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt || p.description,
        type: "post" as const,
        featuredOrder: p.featuredOrder,
      })),
      ...featuredPages.map((p) => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt || "",
        type: "page" as const,
        featuredOrder: p.featuredOrder,
      })),
    ];

    // Sort by featuredOrder (lower first)
    return combined.sort((a, b) => {
      const orderA = a.featuredOrder ?? 999;
      const orderB = b.featuredOrder ?? 999;
      return orderA - orderB;
    });
  };

  // Build featured data from items config (legacy mode)
  const getFeaturedFromItems = (): FeaturedData[] => {
    if (!items || allPosts === undefined || allPages === undefined) {
      return [];
    }

    const result: FeaturedData[] = [];

    for (const item of items) {
      if (item.type === "post") {
        const post = allPosts.find((p) => p.slug === item.slug);
        if (post) {
          result.push({
            title: post.title,
            excerpt: post.excerpt || post.description,
            slug: post.slug,
            type: "post",
          });
        }
      }
      if (item.type === "page") {
        const page = allPages.find((p) => p.slug === item.slug);
        if (page) {
          result.push({
            title: page.title,
            excerpt: page.excerpt || "",
            slug: page.slug,
            type: "page",
          });
        }
      }
    }

    return result;
  };

  // Determine which mode to use
  const useItemsMode = items && items.length > 0 && !useFrontmatter;

  // Get featured data based on mode
  const featuredData = useItemsMode
    ? getFeaturedFromItems()
    : getFeaturedFromFrontmatter();

  // Show nothing while loading
  const isLoading = useItemsMode
    ? allPosts === undefined || allPages === undefined
    : featuredPosts === undefined || featuredPages === undefined;

  if (isLoading) {
    return null;
  }

  if (featuredData.length === 0) {
    return null;
  }

  return (
    <div className="featured-cards">
      {featuredData.map((item) => (
        <a key={item.slug} href={`/${item.slug}`} className="featured-card">
          <h3 className="featured-card-title">{item.title}</h3>
          {item.excerpt && (
            <p className="featured-card-excerpt">{item.excerpt}</p>
          )}
        </a>
      ))}
    </div>
  );
}
