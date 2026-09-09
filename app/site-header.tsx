'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
export default function Header(){const [open,setOpen]=useState(false);const path=usePathname();return <header className="site-header"><div className="wrap header-inner"><Link href="/" className="brand" onClick={()=>setOpen(false)} aria-label="Caring Family Dentistry home"><img className="brand-logo" src="/CFDLogo.png" alt="Caring Family Dentistry" /></Link><button className="menu-button" onClick={()=>setOpen(!open)} aria-expanded={open} aria-controls="main-nav" aria-label={open?'Close navigation':'Open navigation'}>{open?<X/>:<Menu/>}</button><nav id="main-nav" className={open?'nav open':'nav'} aria-label="Main navigation">{[['/about','Meet Dr. Moser'],['/services','Our Care'],['/new-patients','New Patients'],['/visit','Visit Us']].map(([href,label])=><Link key={href} href={href} aria-current={path===href?'page':undefined} onClick={()=>setOpen(false)}>{label}</Link>)}<a href="tel:+13036579006" className="button nav-call">Let’s get you scheduled <ArrowUpRight size={16}/></a></nav></div></header>}
