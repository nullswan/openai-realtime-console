import { Input } from '../../@/components/ui/input';
import { Heart, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../@/components/ui/card';
import Header from '../../components/Header/Header';



export default function Search() {
  const articles = [
    {
      title: 'Prime number discovery',
      description:
        'A former Nvidia employee has discovered the largest known prime number, 2^82,579,841 - 1',
      image: '1.png',
      author: 'esafar',
      likes: '1.1K',
      profile_img:
        'ethan.jpeg',
    },
    {
      title: 'Python ML course',
      description:
        'Python was named after the British comedy troupe Monty Python, not the snake. Its creator, Guido van Rossum...',
      image: '2.png',
      author: 'jperrama',
      likes: '3.4K',
      profile_img:
        'jperrama.jpeg',
    },
    {
      title: 'New planet 9 discovery',
      description:
        'Planet Nine has been hypothesized planet beyond Neptune, by astronomers Konstantin Batygin and Mike Brown...',
      image: '3.png',
      author: 'achatela',
      likes: '7.7K',
      profile_img:
        'achatela.jpeg',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="absolute w-screen h-screen flex flex-col items-center justify-center gap-[3vh] mt-[5vh] mx-auto px-4">
        <div className="flex flex-col items-center justify-center">
          <h1 className="font-semibold text-2xl mb-8 text-gray-900">
            Hello Ethan, what would you like to discover today?
          </h1>
          <div className="w-full max-w-xl relative">
            <Input
              className="bg-gray-50 h-12 pl-6 pr-12 rounded-full text-gray-900 border-0 shadow-sm"
              placeholder="Type your message..."
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-gray-200 rounded-full p-2">
              <ArrowRight className="-rotate-90 h-4 w-4 text-white" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[80%]">
          {articles.map((article, index) => (
            <Card
              key={index}
              className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow rounded-none"
            >
              <CardHeader className="p-0">
                <img
                  src={`img/${article.image}`}
                  alt={article.title}
                  className="w-full h-56 object-cover"
                />
              </CardHeader>
              <CardContent className="p-6 bg-gray-100">
                <h2 className="font-semibold text-lg mb-3 text-gray-900">
                  {article.title}
                </h2>
                <p className="text-sm mb-6 line-clamp-2">
                  {article.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-100 rounded-full overflow-hidden p-1">
                      <img
                        src={`img/${article.profile_img}`}
                        alt={article.title}
                        className="h-5 w-5 object-cover rounded-full"
                      />
                    </div>
                    <span className="text-sm text-gray-600">
                      {article.author}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Heart className="h-4 w-4 stroke-2" />
                    <span className="text-sm font-semibold">
                      {article.likes}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
