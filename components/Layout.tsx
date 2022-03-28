import Link from "next/link";
import { routes } from "../data/routes";
import styles from '../styles/Layout.module.css';

export default function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.wrapper}>
      <header>
        <nav className={styles.nav}>
          {routes.map((route) => {
            return (
              <Link key={route.name} href={`/articles/${route.path}`}>
                {route.name}
              </Link>
            );
          })}
        </nav>
      </header>

      <main>
        {children}
      </main>
    </div>
  );
}

interface LayoutProps {
  children: JSX.Element | JSX.Element[];
};

