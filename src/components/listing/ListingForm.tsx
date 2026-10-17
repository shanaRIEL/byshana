"use client";

import { useState, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { listingCategories, listingSizes, listingConditions } from "@/data";
import { createListingSchema } from "@/lib/validations/listing";
import type { CreateListingInput } from "@/lib/validations/listing";
import { createListingAction } from "@/app/list/actions";
import {
  MAX_IMAGES,
} from "@/lib/upload-constants";

interface UploadedImage {
  url: string;
  publicId: string;
}

interface ImagePreview {
  file: File;
  preview: string;
  status: "pending" | "uploading" | "done" | "error";
  uploaded?: UploadedImage;
  error?: string;
}

const steps = [
  {
    num: "1",
    title: "Photograph",
    desc: "Take clear photos of your item. Natural lighting works best.",
  },
  {
    num: "2",
    title: "Set prices",
    desc: "Choose a daily rental price and an optional buy-now price.",
  },
  {
    num: "3",
    title: "Get paid",
    desc: "Receive earnings after each rental. Keep 90% of the revenue.",
  },
];

export default function ListingForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<ImagePreview[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateListingInput>({
    resolver: zodResolver(createListingSchema),
    defaultValues: {
      title: "",
      category: "",
      size: "",
      rentalPricePerDay: undefined,
      purchasePrice: undefined,
      brand: "",
      condition: "",
      description: "",
      location: "",
      occasion: "",
    },
  });

  const addFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const remaining = MAX_IMAGES;

    setImages((prev) => {
      const available = remaining - prev.length;
      const toAdd = fileArray.slice(0, available);

      return [
        ...prev,
        ...toAdd.map((file) => ({
          file,
          preview: URL.createObjectURL(file),
          status: "pending" as const,
        })),
      ];
    });
  }, []);

  const uploadImages = async (): Promise<UploadedImage[]> => {
    const toUpload = images.filter(
      (img) => img.status === "pending"
    );
    if (toUpload.length === 0) {
      return images
        .filter((img) => img.status === "done" && img.uploaded)
        .map((img) => img.uploaded!);
    }

    const formData = new FormData();
    toUpload.forEach((img) => formData.append("files", img.file));

    setImages((prev) =>
      prev.map((img) =>
        img.status === "pending" ? { ...img, status: "uploading" as const } : img
      )
    );

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setImages((prev) =>
          prev.map((img) =>
            img.status === "uploading"
              ? { ...img, status: "error" as const, error: data.error }
              : img
          )
        );
        return images
          .filter((img) => img.status === "done" && img.uploaded)
          .map((img) => img.uploaded!);
      }

      const uploaded: UploadedImage[] = data.images;
      let uploadIdx = 0;

      setImages((prev) =>
        prev.map((img) => {
          if (img.status === "uploading") {
            const result = uploaded[uploadIdx++];
            return { ...img, status: "done" as const, uploaded: result };
          }
          return img;
        })
      );

      const previousDone = images
        .filter((img) => img.status === "done" && img.uploaded)
        .map((img) => img.uploaded!);

      return [...previousDone, ...uploaded];
    } catch {
      setImages((prev) =>
        prev.map((img) =>
          img.status === "uploading"
            ? { ...img, status: "error" as const, error: "Upload failed" }
            : img
        )
      );
      return images
        .filter((img) => img.status === "done" && img.uploaded)
        .map((img) => img.uploaded!);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const onSubmit = async (data: CreateListingInput) => {
    setServerError(null);
    setIsSubmitting(true);

    try {
      const uploadedUrls = await uploadImages();

      if (images.length > 0 && uploadedUrls.length === 0) {
        setServerError("Failed to upload images. Please try again.");
        return;
      }

      const result = await createListingAction({
        ...data,
        brand: data.brand || undefined,
        occasion: data.occasion || undefined,
        purchasePrice: data.purchasePrice ?? null,
        imageUrls: uploadedUrls.map((u) => u.url),
      });

      if (result.success) {
        router.push(`/item/${result.data?.id}`);
      } else {
        setServerError(result.error ?? "Something went wrong");
      }
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses =
    "py-2.5 px-3.5 border border-line rounded-none font-montserrat text-[0.8rem] text-ink bg-white outline-none transition-colors duration-200 focus:border-ink/40";
  const errorClasses = "text-[0.72rem] text-red-600 mt-1";

  return (
    <div className="px-12 max-[768px]:px-6 py-12">
      <div className="bg-ink px-14 py-16 mb-12 text-center">
        <h1 className="font-great-vibes text-[4.5rem] text-b8 mb-3">Shana</h1>
        <p className="text-[0.88rem] text-b8/55 font-light max-w-[500px] mx-auto">
          List your clothes and start earning. Let others rent or buy items from
          your wardrobe.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-12 max-[768px]:grid-cols-1">
        {steps.map((s) => (
          <div
            key={s.num}
            className="bg-white border border-line py-10 px-6 text-center"
          >
            <div className="w-11 h-11 flex items-center justify-center text-[1rem] font-semibold mx-auto mb-5 font-playfair bg-sand text-ink">
              {s.num}
            </div>
            <h3 className="text-[0.7rem] tracking-[0.12em] uppercase font-montserrat font-semibold text-ink mb-2.5">
              {s.title}
            </h3>
            <p className="text-[0.8rem] text-ink/55 leading-[1.7] font-light">
              {s.desc}
            </p>
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white border border-line p-10 max-w-[700px] mx-auto"
      >
        <h2 className="font-playfair text-[2rem] text-ink mb-1.5">
          List your item
        </h2>
        <p className="text-[0.8rem] text-ink/50 mb-10 font-light">
          Fill in the details below to list your clothes.
        </p>

        {serverError && (
          <div className="bg-b1/10 border border-b2/30 text-b2 px-4 py-3 mb-6 text-[0.82rem]">
            {serverError}
          </div>
        )}

        <div className="grid grid-cols-2 gap-[1.2rem] max-[600px]:grid-cols-1">
          <div className="flex flex-col gap-[0.35rem] col-span-full">
            <label className="text-[0.6rem] font-semibold tracking-[0.16em] uppercase text-ink/50">
              Item name
            </label>
            <input
              type="text"
              {...register("title")}
              placeholder="e.g. Zara Silk Midi Dress"
              className={inputClasses}
            />
            {errors.title && (
              <p className={errorClasses}>{errors.title.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-[0.35rem]">
            <label className="text-[0.6rem] font-semibold tracking-[0.16em] uppercase text-ink/50">
              Category
            </label>
            <select {...register("category")} className={inputClasses}>
              <option value="">Select category</option>
              {listingCategories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className={errorClasses}>{errors.category.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-[0.35rem]">
            <label className="text-[0.6rem] font-semibold tracking-[0.16em] uppercase text-ink/50">
              Size
            </label>
            <select {...register("size")} className={inputClasses}>
              <option value="">Select size</option>
              {listingSizes.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            {errors.size && (
              <p className={errorClasses}>{errors.size.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-[0.35rem]">
            <label className="text-[0.6rem] font-semibold tracking-[0.16em] uppercase text-ink/50">
              Daily rental price
            </label>
            <input
              type="number"
              step="0.01"
              {...register("rentalPricePerDay", { valueAsNumber: true })}
              placeholder="e.g. 15"
              className={inputClasses}
            />
            {errors.rentalPricePerDay && (
              <p className={errorClasses}>{errors.rentalPricePerDay.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-[0.35rem]">
            <label className="text-[0.6rem] font-semibold tracking-[0.16em] uppercase text-ink/50">
              Buy-now price (optional)
            </label>
            <input
              type="number"
              step="0.01"
              {...register("purchasePrice", { valueAsNumber: true })}
              placeholder="e.g. 80"
              className={inputClasses}
            />
            {errors.purchasePrice && (
              <p className={errorClasses}>{errors.purchasePrice.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-[0.35rem]">
            <label className="text-[0.6rem] font-semibold tracking-[0.16em] uppercase text-ink/50">
              Deposit
            </label>
            <input
              type="number"
              step="0.01"
              {...register("deposit", { valueAsNumber: true })}
              placeholder="e.g. 20"
              className={inputClasses}
            />
            {errors.deposit && (
              <p className={errorClasses}>{errors.deposit.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-[0.35rem]">
            <label className="text-[0.6rem] font-semibold tracking-[0.16em] uppercase text-ink/50">
              Brand / Designer
            </label>
            <input
              type="text"
              {...register("brand")}
              placeholder="e.g. Zara, H&M, Gucci"
              className={inputClasses}
            />
            {errors.brand && (
              <p className={errorClasses}>{errors.brand.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-[0.35rem]">
            <label className="text-[0.6rem] font-semibold tracking-[0.16em] uppercase text-ink/50">
              Condition
            </label>
            <select {...register("condition")} className={inputClasses}>
              <option value="">Select condition</option>
              {listingConditions.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            {errors.condition && (
              <p className={errorClasses}>{errors.condition.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-[0.35rem] col-span-full">
            <label className="text-[0.6rem] font-semibold tracking-[0.16em] uppercase text-ink/50">
              Description
            </label>
            <textarea
              {...register("description")}
              placeholder="Describe your item, including any details about fit, material, and occasion..."
              rows={4}
              className={`${inputClasses} resize-vertical min-h-[100px]`}
            />
            {errors.description && (
              <p className={errorClasses}>{errors.description.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-[0.35rem] col-span-full">
            <label className="text-[0.6rem] font-semibold tracking-[0.16em] uppercase text-ink/50">
              Location
            </label>
            <input
              type="text"
              {...register("location")}
              placeholder="e.g. London, UK"
              className={inputClasses}
            />
            {errors.location && (
              <p className={errorClasses}>{errors.location.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-[0.35rem] col-span-full">
            <label className="text-[0.6rem] font-semibold tracking-[0.16em] uppercase text-ink/50">
              Photos ({images.length}/{MAX_IMAGES})
            </label>

            <div className="grid grid-cols-3 gap-3 mb-3 max-[600px]:grid-cols-2">
              {images.map((img, i) => (
                <div
                  key={i}
                  className="relative aspect-square overflow-hidden border border-line group"
                >
                  <Image
                    src={img.preview}
                    alt={`Preview ${i + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />

                  {img.status === "uploading" && (
                    <div className="absolute inset-0 bg-b1/50 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-b8 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}

                  {img.status === "error" && (
                    <div className="absolute inset-0 bg-red-500/80 flex items-center justify-center p-2">
                      <p className="text-white text-[0.65rem] text-center">
                        {img.error}
                      </p>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1.5 right-1.5 w-6 h-6 bg-b1/70 text-b8 rounded-full flex items-center justify-center text-[0.7rem] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {images.length < MAX_IMAGES && (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border border-dashed border-line py-10 text-center bg-sand/60 cursor-pointer hover:border-ink/40 transition-colors duration-200"
              >
                <div className="text-[2rem] mb-1">+</div>
                <div className="text-[0.7rem] tracking-[0.1em] uppercase text-ink/60 font-semibold font-montserrat">
                  Click to add photos
                </div>
                <div className="text-[0.7rem] text-ink/35 mt-[0.2rem]">
                  JPG, PNG, WebP up to 5MB each
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files) addFiles(e.target.files);
                e.target.value = "";
              }}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-ink text-b8 border border-ink py-4 rounded-none text-[0.66rem] font-montserrat font-semibold tracking-[0.18em] uppercase cursor-pointer mt-8 transition-colors duration-200 hover:bg-transparent hover:text-ink disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : "Submit Listing"}
        </button>
      </form>
    </div>
  );
}
