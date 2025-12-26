import { useEffect, useRef,useState   } from "react"; // 1. Import useEffect
import { Button } from "@/components/ui/button";
import {
  Menu,
  Bell,
  Plus,
  X
} from "lucide-react";

export function Header({setSidebarOpen, sidebarOpen, handleBellClick, setIsAddDialogOpen}) {
    const headerRef = useRef(null);
    const [headerSize, setHeaderSize] = useState({ width: 0, height: 0 });

    // 2. Add this hook to listen for screen resize
    useEffect(() => {
        const handleResize = () => {
            // Tailwind's 'sm' breakpoint is usually 640px.
            // If screen is smaller than 640px, close the sidebar.
            if (headerSize.width < 640) {
              console.log('Window with ::', window.innerWidth);
                setSidebarOpen(false);
            }
        };

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Cleanup listener on component unmount
        return () => window.removeEventListener('resize', handleResize);
    }, []);


  useEffect(() => {
    if (headerRef.current) {
      // clientWidth/clientHeight includes padding but not borders
      // offsetWidth/offsetHeight includes padding AND borders
      const width = headerRef.current.offsetWidth;
      const height = headerRef.current.offsetHeight;
      
      console.log("Header Width:", width, "Header Height:", height);
      
      setHeaderSize({ width, height });
    }
  }, []); // Empty dependency array runs this once on mount

    return (
        <header ref={headerRef} className="bg-white border-b border-slate-200 px-3 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between gap-2">
                {/* Left side - Menu and Search */}
                <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="shrink-0"
                    >
                        {sidebarOpen ? (
                            <X className="w-5 h-5" />
                        ) : (
                            <Menu className="w-5 h-5" />
                        )}
                    </Button>
                </div>

                {/* Right side - Actions */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative"
                        onClick={handleBellClick}
                    >
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </Button>

                    {/* Desktop button */}
                    <Button
                        onClick={() => setIsAddDialogOpen(true)}
                        className="hidden sm:flex bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Transaction
                    </Button>

                    {/* Mobile button - icon only */}
                    <Button
                        onClick={() => setIsAddDialogOpen(true)}
                        size="icon"
                        className="sm:hidden bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                    >
                        <Plus className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </header>
    );
}