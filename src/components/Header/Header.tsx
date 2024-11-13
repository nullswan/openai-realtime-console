import { Plus } from 'react-feather';
import { Button } from '../../@/components/ui/button';

export default function Header() {
    return (
      <header className="flex items-center justify-between p-4 px-8">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="Discover logo" />
        </div>
        <div className="flex items-center gap-6">
          <Button variant="ghost" className="text-black">
            My articles
          </Button>
          <Button
            size="sm"
            className="gap-1 bg-black text-white hover:bg-black/90 rounded-full px-3"
          >
            <Plus className="h-4 w-4" />
            New
          </Button>
          <Button
            size="sm"
            className="text-white bg-green-500 hover:bg-green-600 rounded-full"
          >
            ET
          </Button>
        </div>
      </header>
    );
  }