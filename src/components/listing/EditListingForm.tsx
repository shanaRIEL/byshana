"use client";

import { useState, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { listingCategories, listingSizes, listingConditions } from "@/data";
import { createListingSchema } from "@/lib/validations/listing";
import type { CreateListingInput } from "@/lib/validations/listing";
import { updateListingAction } from "@/app/list/actions";
import { MAX_IMAGES } from "@/lib/upload-constants";
import { useToast } from "@/components/common/Toast";

interface ExistingImage {
  id: string;
  url: string;
  order: number;
}

interface UploadedImage {
  url: string;
  publicId: string;
}

interface NewImagePreview {
  file: File;
  preview: string;
  status: "pending" | "uploading" | "done" | "error";
  uploaded?: UploadedImage;
  error?: string;
}

interface EditListingFormProps {
  listing: {
    id: string;
    title: string;
    description: string;
    category: string;
    brand: string;
    size: string;
    condition: string;
    rentalPricePerDay: number;
    purchasePrice: number | null;
    deposit: number;
    location: string;
    occasion: string;
    status: string;
    isAvailable: boolean;
    images: ExistingImage[];
  };
}

export default function EditListingForm({ listing }: EditListingFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingImages, setExistingImages] = useState<ExistingImage[]>(
    listing.images
  );
  const [newImages, setNewImages] = useState<NewImagePreview[]>([]);

  const totalImages = existingImages.length + newImages.length;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateListingInput>({
    resolver: zodResolver(createListingSchema),
    defaultValues: {
      title: listing.title,
      category: listing.category,
      size: listing.size,
      rentalPricePerDay: listing.rentalPricePerDay,
      purchasePrice: listing.purchasePrice ?? undefined,
      deposit: listing.deposit,
      brand: listing.brand,
      condition: listing.condition,
      description: listing.description,
      location: listing.location,
      occasion: listing.occasion,
    },
  });

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const remaining = MAX_IMAGES - totalImages;

      setNewImages((prev) => {
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
    },
    [totalImages]
  );

  const uploadNewImages = async (): Promise<UploadedImage[]> => {
    const toUpload = newImages.filter((img) => img.status === "pending");
    if (toUpload.length === 0) {
      return newImages
        .filter((img) => img.status === "done" && img.uploaded)
        .map((img) => img.uploaded!);
    }

    const formData = new FormData();
    toUpload.forEach((img) => formData.append("files", img.file));

    setNewImages((prev) =>
      prev.map((img) =>
        img.status === "pending"
          ? { ...img, status: "uploading" as const }
          : img
      )
    );

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setNewImages((prev) =>
          prev.map((img) =>
            img.status === "uploading"
              ? { ...img, status: "error" as const, error: data.error }
              : img
          )
        );
        return newImages
          .filter((img) => img.status === "done" && img.uploaded)
          .map((img) => img.uploaded!);
      }

      const uploaded: UploadedImage[] = data.images;
      let uploadIdx = 0;

      setNewImages((prev) =>
        prev.map((img) => {
          if (img.status === "uploading") {
            const result = uploaded[uploadIdx++];
            return { ...img, status: "done" as const, uploaded: result };
          }
          return img;
        })
      );

      const previousDone = newImages
        .filter((img) => img.status === "done" && img.uploaded)
        .map((img) => img.uploaded!);

      return [...previousDone, ...uploaded];
    } catch {
      setNewImages((prev) =>
        prev.map((img) =>
          img.status === "uploading"
            ? { ...img, status: "error" as const, error: "Upload failed" }
            : img
        )
      );
      return newImages
        .filter((img) => img.status === "done" && img.uploaded)
        .map((img) => img.uploaded!);
    }
  };

  const removeExistingImage = (imageId: string) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => {
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
      const uploadedUrls = await uploadNewImages();

      if (newImages.length > 0 && uploadedUrls.length === 0) {
        const hasErrors = newImages.some((img) => img.status === "error");
        if (hasErrors) {
          setServerError("Failed to upload some images. Please try again.");
          return;
        }
      }

      const allImageUrls = [
        ...existingImages.map((img) => img.url),
        ...uploadedUrls.map((u) => u.url),
      ];

      if (allImageUrls.length === 0) {
        setServerError("Please keep at least one image.");
        return;
      }

      const result = await updateListingAction(listing.id, {
        title: data.title,
        description: data.description,
        category: data.category,
        brand: data.brand || undefined,
        size: data.size,
        condition: data.condition,
        rentalPricePerDay: data.rentalPricePerDay,
        purchasePrice: data.purchasePrice ?? null,
        deposit: data.deposit,
        location: data.location,
        occasion: data.occasion || undefined,
      });

      if (result.success) {
        showToast("Listing updated");
        router.push("/dashboard/listings");
        router.refresh();
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
    "py-[0.72rem] px-4 border-[1.5px] border-b6 rounded-[12px] font-montserrat text-[0.84rem] text-b1 bg-b7 outline-none transition-colors duration-200 focus:border-b4";
  const errorClasses = "text-[0.72rem] text-red-600 mt-1";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[1.2rem]">
      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-[0.84rem]">
          {serverError}
        </div>
      )}

      <div className="flex flex-col gap-[0.35rem]">
        <label className="text-[0.68rem] font-semibold tracking-[0.1em] uppercase text-b3">
          Item name
        </label>
        <input
          type="text"
          {...register("title")}
          placeholder="e.g. Zara Silk Midi Dress"
          className={inputClasses}
        />
        {errors.title && <p className={errorClasses}>{errors.title.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-[1.2rem] max-[600px]:grid-cols-1">
        <div className="flex flex-col gap-[0.35rem]">
          <label className="text-[0.68rem] font-semibold tracking-[0.1em] uppercase text-b3">
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
          <label className="text-[0.68rem] font-semibold tracking-[0.1em] uppercase text-b3">
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
          {errors.size && <p className={errorClasses}>{errors.size.message}</p>}
        </div>

        <div className="flex flex-col gap-[0.35rem]">
          <label className="text-[0.68rem] font-semibold tracking-[0.1em] uppercase text-b3">
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
          <label className="text-[0.68rem] font-semibold tracking-[0.1em] uppercase text-b3">
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
          <label className="text-[0.68rem] font-semibold tracking-[0.1em] uppercase text-b3">
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
          <label className="text-[0.68rem] font-semibold tracking-[0.1em] uppercase text-b3">
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
          <label className="text-[0.68rem] font-semibold tracking-[0.1em] uppercase text-b3">
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
      </div>

      <div className="flex flex-col gap-[0.35rem]">
        <label className="text-[0.68rem] font-semibold tracking-[0.1em] uppercase text-b3">
          Description
        </label>
        <textarea
          {...register("description")}
          placeholder="Describe your item..."
          rows={4}
          className={`${inputClasses} resize-vertical min-h-[100px]`}
        />
        {errors.description && (
          <p className={errorClasses}>{errors.description.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-[0.35rem]">
        <label className="text-[0.68rem] font-semibold tracking-[0.1em] uppercase text-b3">
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

      <div className="flex flex-col gap-[0.35rem]">
        <label className="text-[0.68rem] font-semibold tracking-[0.1em] uppercase text-b3">
          Photos ({totalImages}/{MAX_IMAGES})
        </label>

        {existingImages.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-3 max-[600px]:grid-cols-2">
            {existingImages.map((img) => (
              <div
                key={img.id}
                className="relative aspect-square rounded-xl overflow-hidden border border-b6 group"
              >
                <Image
                  src={img.url}
                  alt="Existing photo"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(img.id)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 bg-b1/70 text-b8 rounded-full flex items-center justify-center text-[0.7rem] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {newImages.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-3 max-[600px]:grid-cols-2">
            {newImages.map((img, i) => (
              <div
                key={i}
                className="relative aspect-square rounded-xl overflow-hidden border border-b6 group"
              >
                <Image
                  src={img.preview}
                  alt={`New photo ${i + 1}`}
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
                  onClick={() => removeNewImage(i)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 bg-b1/70 text-b8 rounded-full flex items-center justify-center text-[0.7rem] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {totalImages < MAX_IMAGES && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-b5 rounded-[14px] py-8 text-center bg-b7 cursor-pointer hover:border-b4 transition-colors duration-200"
          >
            <div className="text-[2rem] mb-1">+</div>
            <div className="text-[0.84rem] text-b3 font-medium">
              Click to add photos
            </div>
            <div className="text-[0.74rem] text-b5 mt-[0.2rem]">
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

      <div className="flex gap-3 mt-2">
        <button
          type="button"
          onClick={() => router.push("/dashboard/listings")}
          className="flex-1 px-4 py-3 border border-b6 rounded-[12px] text-[0.84rem] font-montserrat font-medium text-b4 hover:border-b4 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-b1 text-b8 border-none py-3 rounded-[12px] text-[0.84rem] font-montserrat font-semibold cursor-pointer transition-colors duration-200 tracking-[0.04em] hover:bg-b2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
