import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function ScrapeForm({ onSubmit }) {
  const form = useForm({
    defaultValues: {
      url: 'https://www.kdcapital.com/cnc-machines/',
      itemSelector: 'li.product',
      titleSelector: '.woocommerce-loop-product__title',
      priceSelector: '.price',
      descriptionSelector: '.content-area p:first-of-type',
      pageOption: 'specific',
      pages: 1
    }
  });

  const pageOption = form.watch('pageOption');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="itemSelector"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Item Selector</FormLabel>
                <FormControl>
                  <Input placeholder="li.product" {...field} />
                </FormControl>
              </FormItem>
            )}
          /> 
          <FormField
            control={form.control}
            name="titleSelector"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title Selector</FormLabel>
                <FormControl>
                  <Input placeholder=".title" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="priceSelector"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price Selector</FormLabel>
                <FormControl>
                  <Input placeholder=".price" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="descriptionSelector"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description Selector</FormLabel>
                <FormControl>
                  <Input placeholder=".description" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="pageOption"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Page Scraping Option</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-4"
                  >
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="specific" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Specific pages
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="all" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        All pages
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
          {pageOption === 'specific' && (
            <FormField
              control={form.control}
              name="pages"
              render={({ field }) => (
                <FormItem className="w-1/4">
                  <FormLabel>Number of Pages</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                  </FormControl>
                </FormItem>
              )}
            />
          )}
        </div>
        <Button type="submit">Scrape</Button>
      </form>
    </Form>
  );
}
