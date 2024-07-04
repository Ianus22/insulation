const Map: React.FC = () => {
    return (
      <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden mt-4 md:mt-0">

        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2659.632836041101!2d16.36377277630086!3d48.194425371249835!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476d078174c8357b%3A0x18beeeef17d907eb!2zUmllbsO2w59sZ2Fzc2UgMywgMTA0MCBXaWVu!5e0!3m2!1sde!2sat!4v1719993239749!5m2!1sde!2sat"
          width="100%"
          height="100%"
          loading="lazy"
          className="map border-none"
        >
        </iframe>

      </div>
    );
  };

  export default Map;
