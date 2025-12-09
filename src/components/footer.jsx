import { Search, ShoppingBag, Heart, Menu, X, ChevronRight, Star, Check, ArrowRight, Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer () {
  return (
     <footer className="py-12 border-t bg-[#f7f9fa] mt-[100px]">
        <div className="container px-6 mx-auto">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="mb-6 md:mb-0">
              <div className="mb-4 text-2xl font-light tracking-wider">ELEVÉ</div>
              <p className="text-sm text-gray-500">Cultural Beauty, Modernly Crafted</p>
            </div>
            <div className="flex space-x-6">
              {[Instagram, Facebook, Twitter].map((Icon, index) => (
                <a key={index} href="#" className="transition-colors hover:text-gray-600">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
          <div className="pt-8 mt-8 text-sm text-center text-gray-500 border-t">
            <p>© 2024 ELEVÉ. All formulations preserved.</p>
          </div>
        </div>
      </footer>
  );
};
 
