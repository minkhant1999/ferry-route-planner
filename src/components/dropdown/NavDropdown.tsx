import type { ReactNode } from 'react';
import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';

export interface NavDropdownProps {
  label: ReactNode;
  items: MenuProps['items'];
  className?: string;
}

/**
 * Navigation dropdown using **Ant Design `Dropdown`** for header menus (e.g. Explore Services).
 *
 * ### What it does
 * - Renders a clickable trigger with a menu of links or actions.
 * - Uses bottom-left placement suitable for top navigation bars.
 * - Accepts standard Ant Design `MenuProps['items']` for menu entries.
 *
 * @example Explore services menu
 * ```tsx
 * <NavDropdown
 *   label="Explore services"
 *   items={[
 *     { key: 'delivery', label: <Link to="/services/delivery">Delivery</Link> },
 *   ]}
 * />
 * ```
 */
export function NavDropdown({ label, items, className }: NavDropdownProps) {
  return (
    <Dropdown menu={{ items }} placement="bottomLeft" trigger={['click']}>
      <button
        type="button"
        className={
          className ??
          'flex items-center gap-1 rounded-md px-2 py-1.5 text-sm font-medium text-white/90 transition hover:bg-white/10 hover:text-white'
        }
      >
        {label}
        <span aria-hidden className="text-xs opacity-70">
          ▾
        </span>
      </button>
    </Dropdown>
  );
}
