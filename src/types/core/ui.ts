
import { ReactNode } from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showClose?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  preventScroll?: boolean;
  className?: string;
  overlayClassName?: string;
  modalClassName?: string;
}

export interface TableColumn<T> {
  key: keyof T | string;
  title: string;
  render?: (row: T) => ReactNode;
  sortable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  className?: string;
  headerClassName?: string;
  hidden?: boolean;
  searchable?: boolean;
  filterable?: boolean;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  isLoading?: boolean;
  onRowClick?: (row: T) => void;
  selectedRows?: T[];
  onSelectionChange?: (rows: T[]) => void;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (field: string, direction: 'asc' | 'desc') => void;
  rowClassName?: string | ((row: T) => string);
  emptyMessage?: string;
  loadingMessage?: string;
  showHeader?: boolean;
  stickyHeader?: boolean;
  rowKey?: keyof T | ((row: T) => string);
}

export interface CardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
  footer?: ReactNode;
  onClose?: () => void;
  loading?: boolean;
  error?: string | null;
  headerActions?: ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  bordered?: boolean;
  hoverable?: boolean;
}

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  tooltip?: string;
  href?: string;
  target?: string;
  preventDefaultOnLoading?: boolean;
}

export interface FormState {
  dirty: boolean;
  valid: boolean;
  submitting: boolean;
  touched: Record<string, boolean>;
  errors: Record<string, string[]>;
}

export interface LoadingState {
  isLoading: boolean;
  loadingMessage?: string;
  progress?: number;
  phase?: string;
}

export interface ErrorState {
  hasError: boolean;
  error?: Error | null;
  errorMessage?: string;
  errorCode?: string;
}
