const Map: React.FC = () => {
    return (
      <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden mt-4 md:mt-0">

        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5321.330681100901!2d16.35305997629969!3d48.17453087124765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476da834fda9c125%3A0xa8e12d456e0c897a!2sKn%C3%B6llgasse%2023%2C%201100%20Wien!5e0!3m2!1sde!2sat!4v1719563432082!5m2!1sde!2sat" width="600" height="450" 
            loading="lazy" className="map"></iframe>

      </div>
    );
  };

  export default Map;