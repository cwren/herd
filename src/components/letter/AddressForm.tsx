"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { states } from "@/scripts/states"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
const allStates = Object.keys(states).map(
  (key) => [key, states[key]["name"].toUpperCase()]).flat();
const StateSchema = 
  z.string()
  .refine(
      (state) => allStates.includes(state.toUpperCase()),
      `State must be a two-letter postal code or the full state name`
    );
const AddressSchema = z.object({
  name: z.string().min(1, {
    message: "Please include your name.",
  }),
  street: z.string(),
  city: z.string(),
  state: StateSchema,
  zipcode: z.string().regex(/(^\d{5}$)|(^\d{5}-\d{4}$)/),
});

export default function AddressForm() {
  const form = useForm<z.infer<typeof AddressSchema>>({
    resolver: zodResolver(AddressSchema),
    mode: 'all',
    defaultValues: {
      name: "",
      street: "",
      city: "",
      state: "",
      zipcode: "",
    },
  })

  return (
    <Form {...form}>
      <form method="POST" className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street Address</FormLabel>
              <FormControl>
                <Input placeholder="123 Main Street" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex md:flex-row flex-col">
          <FormField 
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="Springfield" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input placeholder="MA" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="zipcode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ZIP Code</FormLabel>
                <FormControl>
                  <Input placeholder="01101" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          </div>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
