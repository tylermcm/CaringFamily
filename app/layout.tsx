import type { Metadata } from 'next';
import { DM_Sans, DM_Serif_Display } from 'next/font/google';
import Link from 'next/link';
import { ArrowUpRight, Phone, MapPin } from 'lucide-react';
import Header from './site-header';
import './globals.css';
import { sitePath } from '../lib/site-path';
const sans = DM_Sans({ variable: '--font-body', subsets: ['latin'] });
const serif = DM_Serif_Display({ variable: '--font-display', weight: '400', style: ['normal','italic'], subsets: ['latin'] });
export const metadata: Metadata = { title: {default:'Caring Family Dentistry | Dr. Jeffrey Moser · Arvada, CO',template:'%s | Caring Family Dentistry'}, description:'Gentle, thoughtful family dentistry with Dr. Jeffrey Moser in Arvada, Colorado. Get to know our approach and call (303) 657-9006 to plan your visit.', robots:{index:false,follow:false} };
export default function RootLayout({children}: Readonly<{children:React.ReactNode}>) {
 return <html lang="en"><body className={`${sans.variable} ${serif.variable}`}><a className="skip-link" href="#main">Skip to content</a><div className="topline"><div className="wrap"><span><MapPin size={13}/> A little more care. Right here in Arvada.</span><a href="tel:+13036579006"><Phone size={13}/> (303) 657-9006</a></div></div><Header/>{children}<footer><div className="wrap footer-main"><Link href={sitePath('/')} className="brand"><img className="brand-logo" src={sitePath('/CFDLogo.png')} alt="Caring Family Dentistry" /></Link><p>Thoughtful dentistry.<br/>Real relationships. Right here in Arvada.</p><div className="footer-links"><Link href={sitePath('/about')}>Meet Dr. Moser</Link><Link href={sitePath('/services')}>Our care</Link><Link href={sitePath('/new-patients')}>New patients</Link><Link href={sitePath('/visit')}>Visit us <ArrowUpRight size={14}/></Link></div></div><div className="wrap footer-bottom"><span>© {new Date().getFullYear()} Caring Family Dentistry</span><a href="https://303magazine.com/2022/02/truth-restoration-and-education-commission/" target="_blank" rel="noreferrer">Landscape: Kody Goodson / Unsplash</a><span>Private design preview · Details subject to confirmation.</span></div></footer></body></html>
}
