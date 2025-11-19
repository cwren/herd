"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { uspsCodesRegExp, zipRegExp } from "@/scripts/states"
import { type Address, AddressStatus } from '@/scripts/letter-state.js';
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
const StateSchema = 
  z.string().regex(uspsCodesRegExp, 'State must be a two-letter postal code.');
const AddressSchema = z.object({
  name: z.string().min(1, {
    message: "Please include your name.",
  }),
  street: z.string(),
  line2: z.string(),
  city: z.string(),
  state: StateSchema,
  zipcode: z.string().regex(zipRegExp),
  email: z.string().email("Please include a valid email address so we can contact if there is a problem with your letter."),
  subscribe: z.boolean(),
  
});

type Props = {
  address: Address,
};

export default function AddressForm(props: Props) {
  const address = props.address;
  var message = null;
  const form = useForm<z.infer<typeof AddressSchema>>({
    resolver: zodResolver(AddressSchema),
    mode: 'onChange',
    defaultValues: {
      name:      address.status != AddressStatus.EMPTY ? address.name : "",
      street:    address.status != AddressStatus.EMPTY ? address.street : "",
      line2:    address.status != AddressStatus.EMPTY ? address.line2 : "",
      city:      address.status != AddressStatus.EMPTY ? address.city : "",
      state:     address.status != AddressStatus.EMPTY ? address.state : "",
      zipcode:   address.status != AddressStatus.EMPTY ? address.zipcode : "",
      email:     address.status != AddressStatus.EMPTY ? address.email : "",
      subscribe: address.status != AddressStatus.EMPTY && address.subscribe ? true : false,
    },
  })
  if (address.status != AddressStatus.EMPTY) {
    message = address.notes;
  }
  
  const { isSubmitting, isValid } = form.formState;

  return (
    <div><h2>First step - your contact information for the letters</h2>
    <Form {...form}>
    { address.status == AddressStatus.EMPTY &&
      <div>
        <p>
          Complete the information below to generate letters to your Senators. Herd on the Hill volunteers in DC will print the letter and deliver it to your senators’ D.C. offices, engaging with staff, legislative aides and/or the senator her/himself, if possible. 
        </p>

        <p>
          Need help writing a letter? Please check out our <a href="/tips" target="_blank">FAQs.</a>.
        </p>

        <p>
          Quick tips: Be concise, polite, and personal. Aim for two to three paragraphs, tops. No profanity, insults, or threats.
        </p>

        <p>
          Photos: Personalize your letter and make it stand out with a photo of you, your family, your friends, or your community.
        </p>

        <p>
          Once we get your letter, we'll add it to our next visit to Capitol Hill. While we make every effort to deliver your letter, as a volunteer group we cannot guarantee delivery, or delivery by a certain date. Unfortunately, we cannot confirm whether a delivery is made. 
        </p>

        <p>All fields are required.</p>
      </div>
    }

    { message && 
      <div id="usps-error">
        <p >The post office rejected this address with the following explaination:</p>
        <p className="text-red-600">{message}</p>
        <p>Please try again after following their recommendation.</p>
      </div>
    }

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
              <FormLabel>Address Line 1</FormLabel>
              <FormControl>
                <Input placeholder="123 Main Street" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="line2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address Line 2</FormLabel>
              <FormControl>
                <Input placeholder="Apartment 523" {...field} />
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
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="me@gmail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        <Button data-testid="address-submit" type="submit" id="submit" disabled={!isValid}>
          {isSubmitting && (
            <svg className={"animate-spin h-4 w-4 text-white"} viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          )}
          {!isSubmitting && (
              <span> Next step - write the body of your letter </span>
          )}
        </Button>
      </form>
    </Form>
    </div>
  )
}
