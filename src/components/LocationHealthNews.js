import React, { useState, useEffect } from 'react';
import { Newspaper, Twitter, AlertCircle, MapPin } from 'lucide-react';

const LocationHealthNews = ({ cityName }) => {
  const [news, setNews] = useState([]);
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentLocation, setCurrentLocation] = useState('Prayagraj'); // Default to Prayagraj

  useEffect(() => {
    // Use provided cityName if available, otherwise use Prayagraj
    setCurrentLocation(cityName || 'Prayagraj');
  }, [cityName]);

  useEffect(() => {
    const fetchTweets = () => {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener('readystatechange', function () {
          if (this.readyState === this.DONE) {
            try {
              const response = JSON.parse(this.responseText);
              resolve(response);
            } catch (error) {
              reject(error);
            }
          }
        });

        // Include both current location and Prayagraj-specific health terms
        const healthTerms = [
          'hospital',
          'healthcare',
          'doctor',
          'medical',
          'health',
          'clinic',
          'AIIMS',
          'medicine'
        ];
        
        const randomTerms = healthTerms
          .sort(() => 0.5 - Math.random())
          .slice(0, 2)
          .join(' ');

        const query = encodeURIComponent(`${randomTerms} ${currentLocation} india healthcare`);
        xhr.open('GET', `https://twitter241.p.rapidapi.com/search?type=Top&count=20&query=${query}`);
        xhr.setRequestHeader('x-rapidapi-key', '6d1abe9edamsh6daae6a50b72ab8p1a01dcjsna66d4b8e8627');
        xhr.setRequestHeader('x-rapidapi-host', 'twitter241.p.rapidapi.com');

        xhr.send(null);
      });
    };

    const fetchNews = async () => {
      // Include specific health-related terms for Prayagraj
      const healthTerms = [
        'healthcare',
        'hospital',
        'medical',
        'health',
        'AIIMS',
        'doctor',
        'clinic',
        'treatment'
      ].join(' OR ');

      const response = await fetch(
        `https://newsapi.org/v2/everything?` +
        `q=(${healthTerms}) AND (${currentLocation} OR Prayagraj OR Allahabad) AND india&` +
        `language=en&` +
        `sortBy=publishedAt&` +
        `apiKey=355559e7eaf1492a87ca25901c6b62de`
      );
      return await response.json();
    };

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const [newsData, twitterData] = await Promise.all([
          fetchNews(),
          fetchTweets()
        ]);
        
        if (newsData.articles?.length === 0 && twitterData?.tweets?.length === 0) {
          // If no data found, force a retry with just Prayagraj
          setCurrentLocation('Prayagraj');
          throw new Error('No data found for the current location');
        }

        setNews(newsData.articles?.slice(0, 6) || []);
        setTweets(twitterData?.tweets?.slice(0, 6) || []);
      } catch (err) {
        setError('Showing health updates from Prayagraj as fallback.');
        console.error('Error fetching data:', err);
        // Don't set loading to false here to allow retry with Prayagraj
        fetchData(); // Retry with Prayagraj
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentLocation]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <div className="flex items-center space-x-2">
          <MapPin className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-800">
            Health Updates for {currentLocation}
            {error && <span className="text-sm text-gray-500 ml-2">(Showing Prayagraj updates)</span>}
          </h2>
        </div>
        {error && (
          <div className="mt-2 text-sm text-gray-600">
            {error}
          </div>
        )}
      </div>

      <div className="space-y-8">
        {/* News Section */}
        <div>
          <div className="flex items-center mb-4">
            <Newspaper className="w-6 h-6 mr-2 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">Latest Health News</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {news.map((article, index) => (
              <div key={index} className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200">
                {article.urlToImage && (
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={article.urlToImage} 
                      alt={article.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="p-4">
                  <h4 className="font-medium text-blue-700 mb-2 line-clamp-2 hover:line-clamp-none">
                    {article.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-3">
                    {article.description}
                  </p>
                  <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                    <span className="font-medium">{article.source.name}</span>
                    <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tweets Section */}
        <div>
          <div className="flex items-center mb-4">
            <Twitter className="w-6 h-6 mr-2 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">Latest Health Updates on Twitter</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tweets.map((tweet, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-start space-x-3 mb-2">
                  {tweet.user?.profile_image_url && (
                    <img 
                      src={tweet.user.profile_image_url} 
                      alt={tweet.user.name}
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{tweet.user?.name || 'Unknown User'}</p>
                    <p className="text-sm text-gray-500">@{tweet.user?.screen_name}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-800 mb-3">{tweet.text}</p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span>♥ {tweet.favorite_count || 0}</span>
                    <span>↺ {tweet.retweet_count || 0}</span>
                  </div>
                  <span>{new Date(tweet.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationHealthNews;