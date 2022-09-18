import Image from "next/image";
import React from "react";

const ProductItem = (product) => {
  return (
    <div className="flex flex-col p-4 space-y-2 transition transform border hover:scale-105 hover:border-black border-black/30">
      <h3 className="text-xl font-semibold truncate">{product.name}</h3>
      <p className="truncate">{product.description}</p>
      <div className="relative aspect-video">
        {product.image && (
          <Image
            src={product.image}
            alt={product.name}
            layout="fill"
            objectFit="cover"
          />
        )}
      </div>
    </div>
  );
};

export default ProductItem;
