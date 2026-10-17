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
        <div className="bg-b1/10 border border-b2/30 text-b2 px-5 py-3 text-[0.82rem]">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-sand border border-line text-ink px-5 py-3 text-[0.82rem]">
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
          <label className="block text-[0.6rem] text-ink/50 font-montserrat font-semibold uppercase tracking-[0.16em] mb-2">
            Gender
          </label>
          <select
            name="gender"
            value={form.gender ?? ""}
            onChange={handleChange}
            className="w-full bg-white border border-line rounded-none px-4 py-2.5 text-[0.84rem] text-ink font-light font-montserrat outline-none transition-colors duration-200 focus:border-ink/40"
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
        <label className="block text-[0.6rem] text-ink/50 font-montserrat font-semibold uppercase tracking-[0.16em] mb-2">
          Bio
        </label>
        <textarea
          name="bio"
          value={form.bio ?? ""}
          onChange={handleChange}
          rows={4}
          maxLength={500}
          placeholder="Tell others about yourself and your style..."
          className="w-full bg-white border border-line rounded-none px-4 py-2.5 text-[0.84rem] text-ink font-light font-montserrat outline-none transition-colors duration-200 focus:border-ink/40 resize-none"
        />
        <p className="text-[0.7rem] text-ink/40 mt-1">
          {(form.bio ?? "").length}/500
        </p>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-ink text-b8 border border-ink py-3 px-8 rounded-none text-[0.64rem] font-montserrat font-semibold tracking-[0.16em] uppercase transition-colors duration-200 hover:bg-transparent hover:text-ink disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/dashboard/profile")}
          className="bg-transparent border border-line text-ink/55 py-3 px-8 rounded-none text-[0.64rem] font-montserrat font-semibold tracking-[0.16em] uppercase transition-colors duration-200 hover:border-ink/40 hover:text-ink cursor-pointer"
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
      <label className="block text-[0.6rem] text-ink/50 font-montserrat font-semibold uppercase tracking-[0.16em] mb-2">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full bg-white border border-line rounded-none px-4 py-2.5 text-[0.84rem] text-ink font-light font-montserrat outline-none transition-colors duration-200 focus:border-ink/40"
      />
    </div>
  );
}
