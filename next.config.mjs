const nextConfig = {
    typescript: {
      ignoreBuildErrors: true
    },
    images: {
      remotePatterns: [ 
        {
          protocol: 'https',
          hostname: 'lovely-flamingo-139.convex.cloud'
        },
        {
          protocol: 'https',
          hostname: 'sleek-capybara-771.convex.cloud'
        },
        {
          protocol: 'https',
          hostname: 'img.clerk.com'
        },
        {
          protocol: 'https',
          hostname: 'tough-firefly-971.convex.cloud'
        },
        {
          protocol: 'https',
          hostname: 'dashboard.clerk.com'
        },

        
      ]
    }
  };
  
  export default nextConfig;
