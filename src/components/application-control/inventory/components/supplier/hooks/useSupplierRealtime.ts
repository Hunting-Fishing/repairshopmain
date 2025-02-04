import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useSupplierRealtime(supplierId: string, onUpdate: () => void) {
  useEffect(() => {
    // Subscribe to supplier communications changes
    const communicationsChannel = supabase
      .channel('supplier-communications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'supplier_communications',
          filter: `supplier_id=eq.${supplierId}`
        },
        (payload) => {
          console.log('Supplier communication update:', payload);
          toast.info('New supplier message received');
          onUpdate();
        }
      )
      .subscribe();

    // Subscribe to supplier documents changes
    const documentsChannel = supabase
      .channel('supplier-documents')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'supplier_documents',
          filter: `supplier_id=eq.${supplierId}`
        },
        (payload) => {
          console.log('Supplier document update:', payload);
          toast.info('Supplier documents updated');
          onUpdate();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(communicationsChannel);
      supabase.removeChannel(documentsChannel);
    };
  }, [supplierId, onUpdate]);
}