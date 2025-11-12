import { Search } from 'lucide-react';
import { useAppDispatch } from '../../store';
import { setSearchOpen } from '../../store/slices/uiSlice';

interface HeaderProps {
  title?: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export function Header({ title, breadcrumbs }: HeaderProps) {
  const dispatch = useAppDispatch();
  
  return (
    <header className="border-b bg-(--color-bg) sticky top-0 z-10" style={{ borderColor: 'var(--color-border)' }}>
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            {breadcrumbs && breadcrumbs.length > 0 && (
              <nav className="flex items-center gap-2 text-sm mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                {breadcrumbs.map((crumb, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {index > 0 && <span>/</span>}
                    {crumb.href ? (
                      <a href={crumb.href} className="hover:text-(--color-accent)">
                        {crumb.label}
                      </a>
                    ) : (
                      <span>{crumb.label}</span>
                    )}
                  </div>
                ))}
              </nav>
            )}
            {title && (
              <h1 className="text-heading-2">{title}</h1>
            )}
          </div>
          
          <button
            onClick={() => dispatch(setSearchOpen(true))}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:border-(--color-accent) transition-all"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
          >
            <Search size={18} />
            <span className="text-sm">Search...</span>
            <kbd className="px-2 py-0.5 text-xs rounded bg-(--color-surface)" style={{ color: 'var(--color-text-muted)' }}>
              /
            </kbd>
          </button>
        </div>
      </div>
    </header>
  );
}