import { getProduct } from "@/lib/shopify/server-actions";
import ProductDetail from "@/components/product/ProductDetail";
import { Metadata } from "next";

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { handle: string } }): Promise<Metadata> {
  const { product } = await getProduct(params.handle);
  
  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found."
    };
  }
  
  return {
    title: product.title,
    description: product.description.substring(0, 160),
    openGraph: {
      images: product.images.edges[0] ? [{ url: product.images.edges[0].node.url }] : [],
    },
  };
}

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const { handle } = params;
  
  // Fetch product data server-side
  const { product, error } = await getProduct(handle);
  
  // Pass the data to the client component for rendering
  return (
    <div className="container mx-auto py-8">
      <ProductDetail product={product} error={error} />
    </div>
  );
}
