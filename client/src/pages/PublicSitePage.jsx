import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import TemplateRenderer from '../components/TemplateRenderer';
import { AlertTriangle, Globe } from 'lucide-react';

export default function PublicSitePage() {
  const { slug } = useParams();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchSiteData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/public/site/${slug}`);
        const data = await response.json();

        if (data.success) {
          setBusiness(data.data);
          
          // Dynamically Update SEO Tags
          const seo = data.data.seo || {};
          document.title = seo.title || `${data.data.businessName} - Generated Website`;
          
          // Update Meta Description
          let metaDesc = document.querySelector('meta[name="description"]');
          if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
          }
          metaDesc.setAttribute('content', seo.metaDescription || `Explore services and book directly at ${data.data.businessName}`);

          // Update Meta Keywords
          let metaKeywords = document.querySelector('meta[name="keywords"]');
          if (!metaKeywords) {
            metaKeywords = document.createElement('meta');
            metaKeywords.setAttribute('name', 'keywords');
            document.head.appendChild(metaKeywords);
          }
          if (seo.keywords && seo.keywords.length > 0) {
            metaKeywords.setAttribute('content', seo.keywords.join(', '));
          }

        } else {
          setErrorMsg(data.message || 'Website not found');
        }
      } catch (err) {
        console.error(err);
        setErrorMsg('Error loading website content');
      } finally {
        setLoading(false);
      }
    };

    fetchSiteData();

    // Cleanup page title on unmount
    return () => {
      document.title = 'Build It All - Website Builder';
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4">
        <span className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
        <span className="text-sm text-slate-400">Loading website elements...</span>
      </div>
    );
  }

  if (errorMsg || !business) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="w-16 h-16 bg-pink-500/10 text-pink-500 rounded-full flex items-center justify-center border border-pink-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
          <AlertTriangle size={32} />
        </div>
        <div className="space-y-2 max-w-sm">
          <h2 className="text-2xl font-bold text-white">404 - Site Not Found</h2>
          <p className="text-slate-400 text-sm">
            We couldn't locate a generated local business website matching the path <span className="font-mono text-pink-400">/site/{slug}</span>.
          </p>
        </div>
        <Link 
          to="/" 
          className="px-6 py-3 bg-white text-black font-bold text-sm rounded-xl hover:bg-slate-200 transition flex items-center gap-2 shadow-lg"
        >
          <Globe size={16} />
          Go to Platform Home
        </Link>
      </div>
    );
  }

  return <TemplateRenderer business={business} isPreview={false} />;
}
