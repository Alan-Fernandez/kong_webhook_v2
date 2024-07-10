// config/fonts.ts

import { Inter, Montserrat_Alternates, Roboto } from 'next/font/google';



// Inter font
export const inter = Inter({ subsets: ['latin'] });


// Montserrat Alternates font for titles
export const titleFont = Montserrat_Alternates({ 
  subsets: ['latin'],
  weight: ['500', '700'],
});

// Roboto font
export const roboto = Roboto({ 
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});
