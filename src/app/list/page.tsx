"use client";

import Footer from "@/components/footer/Footer";
import ListingForm from "@/components/listing/ListingForm";
import { listFooterColumns } from "@/data";

export default function ListPage() {
  return (
    <>
      <ListingForm />
      <div className="mt-16">
        <Footer columns={listFooterColumns} />
      </div>
    </>
  );
}
