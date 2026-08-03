"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/app/dashboard/profile/actions";
import type { UpdateProfileInput } from "@/lib/validations/profile";

interface ProfileFormProps {
  initialData: {
    name: string | null;
    bio: string | null;
    phone: string | null;
    city: string | null;
    country: string | null;
    gender: string | null;
    dateOfBirth: Date | null;
  };
}

function toDateInputValue(date: Date | null): string {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function ProfileForm({ initialData }: ProfileFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState<UpdateProfileInput>({
    name: initialData.name ?? "",
    bio: initialData.bio ?? "",
    phone: initialData.phone ?? "",
    city: initialData.city ?? "",
    country: initialData.country ?? "",
    gender: initialData.gender ?? "",
    dateOfBirth: toDateInputValue(initialData.dateOfBirth),
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
    setSuccess(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    const result = await updateProfile(form);
    if (result.success) {
      setSuccess(true);
      router.refresh();
    } else {
      setError(result.error ?? "Failed to update profile");
    }
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-3 text-[0.82rem]">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-5 py-3 text-[0.82rem]">
          Profile updated successfully.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <FormField
          label="Display Name"
          name="name"
          value={form.name ?? ""}
          onChange={handleChange}
          required
        />
        <FormField
          label="Phone"
          name="phone"
          type="tel"
          value={form.phone ?? ""}
          onChange={handleChange}
        />
        <FormField
          label="City"
          name="city"
          value={form.city ?? ""}
          onChange={handleChange}
        />
        <FormField
          label="Country"
          name="country"
          value={form.country ?? ""}
          onChange={handleChange}
        />
        <div>
          <label className="block text-[0.72rem] text-b5 font-medium uppercase tracking-wider mb-2">
            Gender
          </label>
          <select
            name="gender"
            value={form.gender ?? ""}
            onChange={handleChange}
            className="w-full bg-b8 border border-b6 rounded-xl px-4 py-3 text-[0.88rem] text-b1 font-light font-montserrat outline-none transition-colors duration-200 focus:border-b4"
          >
            <option value="">Prefer not to say</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="non-binary">Non-binary</option>
            <option value="other">Other</option>
          </select>
        </div>
        <FormField
          label="Date of Birth"
          name="dateOfBirth"
          type="date"
          value={form.dateOfBirth ?? ""}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="block text-[0.72rem] text-b5 font-medium uppercase tracking-wider mb-2">
          Bio
        </label>
        <textarea
          name="bio"
          value={form.bio ?? ""}
          onChange={handleChange}
          rows={4}
          maxLength={500}
          placeholder="Tell others about yourself and your style..."
          className="w-full bg-b8 border border-b6 rounded-xl px-4 py-3 text-[0.88rem] text-b1 font-light font-montserrat outline-none transition-colors duration-200 focus:border-b4 resize-none"
        />
        <p className="text-[0.72rem] text-b5 mt-1">
          {(form.bio ?? "").length}/500
        </p>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-b2 text-b8 border-none py-3 px-8 rounded-xl text-[0.88rem] font-montserrat font-medium transition-colors duration-200 hover:bg-b1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/dashboard/profile")}
          className="bg-transparent border-[1.5px] border-b5 text-b3 py-3 px-8 rounded-xl text-[0.88rem] font-montserrat font-medium transition-all duration-200 hover:bg-b5 hover:text-b1 cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[0.72rem] text-b5 font-medium uppercase tracking-wider mb-2">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full bg-b8 border border-b6 rounded-xl px-4 py-3 text-[0.88rem] text-b1 font-light font-montserrat outline-none transition-colors duration-200 focus:border-b4"
      />
    </div>
  );
}
