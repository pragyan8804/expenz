import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export function FaqAccordion() {
  return (
    <>
      <h2 className="text-center text-3xl font-semibold my-10 mx-5">
        Frequently Asked Questions
      </h2>
      <Accordion
        type="single"
        collapsible
        className="max-w-xl mx-auto py-10 px-10"
      >
        {/* FAQ Item 1 */}
        <AccordionItem value="faq-1">
          <AccordionTrigger>What is Expenz?</AccordionTrigger>
          <AccordionContent>
            Expenz is a powerful expense tracking app designed to help you
            manage your finances efficiently by tracking expenses, incomes,
            investments, and even splitting bills among groups.
          </AccordionContent>
        </AccordionItem>

        {/* FAQ Item 2 */}
        <AccordionItem value="faq-2">
          <AccordionTrigger>Is Expenz free to use?</AccordionTrigger>
          <AccordionContent>
            Yes, Expenz is completely free to use. We offer all our basic
            features at no cost. We may add premium features in the future, but
            all essential features will always remain free.
          </AccordionContent>
        </AccordionItem>

        {/* FAQ Item 3 */}
        <AccordionItem value="faq-3">
          <AccordionTrigger>Can I split bills with friends?</AccordionTrigger>
          <AccordionContent>
            Absolutely! Expenz allows you to create groups, add members, and
            split expenses seamlessly. You can track who paid for what and see
            how much each person owes or is owed.
          </AccordionContent>
        </AccordionItem>

        {/* FAQ Item 4 */}
        <AccordionItem value="faq-4">
          <AccordionTrigger>Is my data secure on Expenz?</AccordionTrigger>
          <AccordionContent>
            Yes. We prioritize your privacy and data security. All your data is
            encrypted and securely stored, ensuring only you have access to your
            personal financial information.
          </AccordionContent>
        </AccordionItem>

        {/* FAQ Item 5 */}
        <AccordionItem value="faq-5">
          <AccordionTrigger>
            Can I track multiple income streams?
          </AccordionTrigger>
          <AccordionContent>
            Yes, Expenz allows you to track multiple income sources such as
            salary, freelancing, investments, and more. You can organize them
            into different categories for easy tracking.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  )
}
