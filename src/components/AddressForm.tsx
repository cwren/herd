"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import states from "@/scripts/states"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"

const state_codes = Object.keys(states);
const AddressSchema = z.object({
  name: z.string().min(2, {
    message: "name must be at least 2 characters.",
  }),
  state: z.enum([state_codes[0], ...state_codes.slice(1)]),  // ew, I hate this
});

export default function AddressForm() {
  const form = useForm<z.infer<typeof AddressSchema>>({
    resolver: zodResolver(AddressSchema),
    defaultValues: {
      name: "",
      state: "MA",
    },
  })

  function onSubmit(data: z.infer<typeof AddressSchema>) {
    console.log(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
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
        {/* see https://github.com/shadcn-ui/ui/issues/1253 */}
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>States</SelectLabel>
                        {Object.entries(states).map(([code, desc]) => (
                          <SelectItem value={code}>{desc["name"]}</SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
