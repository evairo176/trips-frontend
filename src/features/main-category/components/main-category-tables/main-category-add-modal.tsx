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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Edit, Plus } from 'lucide-react';
import MainCategoryForm from '../main-category-form';
import { useState } from 'react';
import { MainCategory } from '@/constants/main-category';
type MainCategoryAddModalProps = {
  title: string;
  editId: string;
  initialData?: MainCategory | undefined;
  open: boolean; // Tambahkan ini
  setOpen: (open: boolean) => void; // Tambahkan ini
};

export function MainCategoryAddModal({
  title,
  editId = 'new',
  initialData,
  open,
  setOpen
}: MainCategoryAddModalProps) {
  let maincategory = initialData;
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
            <MainCategoryForm
              initialData={maincategory}
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
            <MainCategoryForm
              initialData={maincategory}
              pageTitle={pageTitle}
              onOpen={setOpen}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
