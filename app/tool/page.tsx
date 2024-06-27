import React from "react";
import Image from "next/image";
import MyNavbar from "@/components/myNavbar";
import Footer from "@/components/myFooter";

const ImageUploadComponent: React.FC = () => {
  return (
    <>
      <MyNavbar></MyNavbar>
      <div className="flex flex-col items-center w-full max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-md">
        <div className="w-full p-8 mb-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex flex-col items-center justify-center">
          <Image
            src="/images/downloadSign.png"
            alt="download"
            height={120}
            width={120}
          ></Image>
          <p className="text-gray-400 mt-4">
            Drag and drop or click here to upload image
          </p>
        </div>
        <input
          type="text"
          placeholder="Additional prompt"
          className="w-full p-4 mb-8 border border-gray-300 rounded-lg focus:outline-none"
        />
        <button className="w-full py-3 mb-8 bg-[#C5ECE0] text-white rounded-lg hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50">
          Submit
        </button>
        <div className="w-full p-6 border border-gray-300 rounded-lg bg-gray-50">
          <h2 className="text-black text-lg font-semibold mb-4">Result</h2>
          <div className="w-full p-4 border border-gray-300 rounded-lg bg-white">
            <p className="text-gray-400">Returned result</p>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};
export default ImageUploadComponent;
