'use client';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import CategoryForm from '../category-form';
import { Category } from '@/constants/category';
type CategoryAddModalProps = {
  title: string;
  editId: string;
  initialData?: Category | undefined;
  open: boolean; // Tambahkan ini
  setOpen: (open: boolean) => void; // Tambahkan ini
};

export function CategoryAddModal({
  title,
  editId = 'new',
  initialData,
  open,
  setOpen
}: CategoryAddModalProps) {
  let category = initialData;
  let pageTitle = 'Create New Main Category';

  return (
    <>
      {editId === 'new' && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              className={cn(buttonVariants(), 'text-xs md:text-sm')}
              onClick={() => setOpen(true)}
            >
              <Plus className='mr-2 h-4 w-4' /> Tambah Baru
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[425px]'>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <CategoryForm
              initialData={category}
              pageTitle={pageTitle}
              onOpen={setOpen}
            />
          </DialogContent>
        </Dialog>
      )}
      {editId !== 'new' && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className='sm:max-w-[425px]'>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <CategoryForm
              initialData={category}
              pageTitle={pageTitle}
              onOpen={setOpen}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
