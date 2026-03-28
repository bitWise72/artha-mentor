"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Target, BarChart3, FileText, Users, Lightbulb, MessageCircle } from "lucide-react";
import Image from "next/image";
import styles from "./Navbar.module.css";

const navItems = [
  { href: "/dashboard/simulate", label: "Play Game Engine", icon: Target },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/goals", label: "FIRE Map", icon: Target },
  { href: "/dashboard/portfolio", label: "Portfolio", icon: BarChart3 },
  { href: "/dashboard/tax", label: "Tax", icon: FileText },
  { href: "/dashboard/family", label: "Family", icon: Users },
  { href: "/dashboard/insights", label: "Insights", icon: Lightbulb },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className={styles.navbar}>
      <Link href="/dashboard" className={styles.logo}>
        <div className={styles.logoIcon}>
          <Image src="/images/artha_logo.png" alt="Artha Logo" width={28} height={28} style={{ mixBlendMode: 'screen', filter: 'contrast(1.2)' }} />
        </div>
        <span className={styles.logoText}>
          Artha AI
          <span className={styles.logoSub}>by Economic Times</span>
        </span>
      </Link>

      <div className={styles.navLinks}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || 
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${isActive ? styles.active : ""}`}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
