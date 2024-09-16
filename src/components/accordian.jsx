import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  
  export default function FAQAccordion() {
    return (
      <div className="w-full max-w-3xl mx-auto p-8  text-white">
        <h2 className="text-2xl font-bold mb-6">FAQ</h2>
        <Accordion type="single" collapsible className="w-full ">
          <AccordionItem value="item-1">
            <AccordionTrigger>What is a non-fungible token (NFT)?</AccordionTrigger>
            <AccordionContent>
              An NFT is a unique digital asset that represents ownership of a specific item or piece of content on the blockchain. Unlike cryptocurrencies, each NFT is distinct and cannot be exchanged on a like-for-like basis.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>How do I buy an NFT?</AccordionTrigger>
            <AccordionContent>
              To buy an NFT, you typically need to set up a digital wallet, purchase cryptocurrency, connect to an NFT marketplace, browse available NFTs, and make a purchase using your cryptocurrency.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>What is Crypto's NFT Marketplace?</AccordionTrigger>
            <AccordionContent>
              Crypto's NFT Marketplace is a platform where users can buy, sell, and trade NFTs. It provides a space for creators to mint new NFTs and for collectors to discover and purchase unique digital assets.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>How do I sell an NFT?</AccordionTrigger>
            <AccordionContent>
              To sell an NFT, you need to create or own the digital asset, choose an NFT marketplace, connect your digital wallet, list your NFT for sale by setting a price or auction terms, and wait for a buyer to purchase it.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    )
  }