import Image from 'next/image';
import Link from 'next/link';

interface RestaurantCardProps {
  id: string;
  nome: string;
  descricao: string;
  imagemUrl: string;
  categoria: string;
  endereco: string;
}

export const RestaurantCard = ({
  id,
  nome,
  descricao,
  imagemUrl,
  categoria,
  endereco,
}: RestaurantCardProps) => {
  return (
    <Link href={`/restaurantes/${id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        <div className="relative h-48 w-full">
          <Image
            src={imagemUrl}
            alt={nome}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <div className="inline-block px-2 py-1 mb-2 text-sm bg-gray-100 rounded-full">
            {categoria}
          </div>
          <h3 className="text-xl font-semibold mb-2">{nome}</h3>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{descricao}</p>
          <p className="text-gray-500 text-sm flex items-center">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {endereco}
          </p>
        </div>
      </div>
    </Link>
  );
}; 