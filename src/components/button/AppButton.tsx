import type { ButtonProps } from 'antd';
import { Button } from 'antd';

export interface AppButtonProps extends ButtonProps {
  label?: string;
}

/**
 * Project button wrapper around **Ant Design `Button`** with shared sizing and styling.
 *
 * ### What it does
 * - Applies consistent Tailwind-friendly defaults for primary actions.
 * - Accepts all Ant Design `Button` props (`type`, `loading`, `htmlType`, etc.).
 * - Supports children or a `label` prop for simple text buttons.
 *
 * @example Submit button
 * ```tsx
 * <AppButton type="primary" htmlType="submit" loading={isSubmitting}>
 *   Save route
 * </AppButton>
 * ```
 *
 * @example Secondary action
 * ```tsx
 * <AppButton label="Cancel" onClick={onCancel} />
 * ```
 */
export function AppButton({ label, children, className, ...props }: AppButtonProps) {
  return (
    <Button className={className} {...props}>
      {children ?? label}
    </Button>
  );
}
