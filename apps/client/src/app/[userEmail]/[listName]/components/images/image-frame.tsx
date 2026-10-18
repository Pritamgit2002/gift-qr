import Image from "next/image";

const ImageFrame = ({
  imageUrl,
  imageName,
}: {
  imageUrl: string;
  imageName: string;
}) => {
  return (
    <div className="flex flex-col items-center p-4 border rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-2">{imageName}</h2>
      <Image
        src={imageUrl}
        alt={imageName}
        height={1000}
        width={1000}
        className="rounded-lg max-w-full"
      />
    </div>
  );
};

export default ImageFrame;
