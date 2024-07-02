const Map: React.FC = () => {
    return (
      <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden mt-4 md:mt-0">
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2956.0851061202925!2d24.349553875961185!3d42.19124777120912!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14acb00c1e58a919%3A0xbb2fdeed0c47bf13!2z0JjQt9GC0L7Quiwg0YPQuy4g4oCe0JPQsNGA0LjQsdCw0LvQtNC44oCcIDI0LCA0NDAxINCf0LDQt9Cw0YDQtNC20LjQuiwg0JHRitC70LPQsNGA0LjRjw!5e0!3m2!1sbg!2sat!4v1719914115368!5m2!1sbg!2sat" width="600" height="450" 
            loading="lazy" className="map">
        </iframe>
      </div>
    );
  };

  export default Map;
