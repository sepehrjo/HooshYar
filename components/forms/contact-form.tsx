"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui";
import type { Locale } from "@/types/locale";

type Status = "idle" | "submitting" | "success" | "error";

const labels = {
  en: {
    name: "Name",
    companyName: "Company Name (optional)",
    email: "Email (optional)",
    phone: "Phone Number",
    service: "Service",
    message: "Project details",
    submit: "Send request",
    submitting: "Sending...",
    success:
      "Request received.",
    error: "Please complete all required fields.",
    services: [
      "AI Services",
      "Automation",
      "Web Development",
      "Custom / Not sure",
    ],
    validation: {
      required: "This field is required",
      email: "Please enter a valid email",
      messageLength: "Message must be at least 20 characters",
    },
  },
  fa: {
    name: "نام",
    companyName: "نام شرکت / سازمان (اختیاری)",
    email: "ایمیل (اختیاری)",
    phone: "شماره تماس",
    service: "خدمت مورد نیاز",
    message: "جزئیات پروژه",
    submit: "ارسال درخواست",
    submitting: "در حال ارسال...",
    success:
      "درخواست دریافت شد",
    error: "لطفاً همه فیلدهای ضروری را تکمیل کنید.",
    services: [
      "خدمات هوش مصنوعی",
      "اتوماسیون",
      "توسعه وب",
      "اختصاصی / هنوز مطمئن نیستم",
    ],
    validation: {
      required: "این فیلد الزامی است",
      email: "ایمیل معتبر وارد کنید",
      messageLength: "پیام باید حداقل ۲۰ کاراکتر باشد",
    },
  },
};

export function ContactForm({ locale }: { locale: Locale }) {
  const copy = labels[locale];
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): Record<string, string> {
    const newErrors: Record<string, string> = {};
    const form = document.getElementById("contact-form") as HTMLFormElement | null;
    if (!form) return newErrors;

    const nameEl = form.elements.namedItem("name") as HTMLInputElement | null;
    const emailEl = form.elements.namedItem("email") as HTMLInputElement | null;
    const messageEl = form.elements.namedItem("message") as HTMLTextAreaElement | null;

    if (nameEl && !nameEl.value.trim()) {
      newErrors.name = copy.validation.required;
    }
    const phoneEl = form.elements.namedItem("phone") as HTMLInputElement | null;
    if (phoneEl && !phoneEl.value.trim()) {
      newErrors.phone = copy.validation.required;
    }
    if (emailEl && emailEl.value.trim()) {
      if (!/\S+@\S+\.\S+/.test(emailEl.value.trim())) {
        newErrors.email = copy.validation.email;
      }
    }
    if (messageEl) {
      if (!messageEl.value.trim()) {
        newErrors.message = copy.validation.required;
      } else if (messageEl.value.trim().length < 20) {
        newErrors.message = copy.validation.messageLength;
      }
    }
    return newErrors;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStatus("submitting");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, locale }),
    });

    if (response.ok) {
      setStatus("success");
      form.reset();
    } else {
      setStatus("error");
    }
  }

  return (
    <form id="contact-form" onSubmit={onSubmit} className="grid gap-4" noValidate>
      <Field label={copy.name} name="name" error={errors.name} />
      <Field label={copy.companyName} name="companyName" error={errors.companyName} />
      <Field label={copy.email} name="email" type="email" error={errors.email} />
      <Field label={copy.phone} name="phone" type="tel" required error={errors.phone} />
      <label className="grid gap-2 text-sm font-medium text-text-primary">
        {copy.service}
        <select
          name="service"
          className="rounded-2xl border border-glass-border bg-bg-void/70 px-4 py-3 text-text-primary outline-none transition focus:border-cyan-primary focus:shadow-cyan-glow motion-reduce:transition-none"
          defaultValue=""
        >
          <option value="" disabled>
            {copy.service}
          </option>
          {copy.services.map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </select>
        {errors.service && (
          <p className="text-xs" style={{ color: "#E63CD8" }}>{errors.service}</p>
        )}
      </label>
      <label className="grid gap-2 text-sm font-medium text-text-primary">
        {copy.message}
        <textarea
          name="message"
          rows={6}
          className="resize-y rounded-2xl border border-glass-border bg-bg-void/70 px-4 py-3 text-text-primary outline-none transition placeholder:text-text-muted focus:border-cyan-primary focus:shadow-cyan-glow motion-reduce:transition-none"
        />
        {errors.message && (
          <p className="text-xs" style={{ color: "#E63CD8" }}>{errors.message}</p>
        )}
      </label>
      <Button type="submit" size="lg" disabled={status === "submitting"}>
        {status === "submitting" ? copy.submitting : copy.submit}
      </Button>
      <div aria-live="polite" aria-atomic="true">
        {status === "success" ? (
          <p className="rounded-2xl border border-cyan-primary/30 bg-cyan-primary/10 p-4 text-sm text-text-primary">
            {copy.success}
          </p>
        ) : null}
        {status === "error" ? (
          <p className="rounded-2xl border border-magenta-glow/30 bg-magenta-glow/10 p-4 text-sm text-text-primary">
            {copy.error}
          </p>
        ) : null}
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-text-primary">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        className="rounded-2xl border border-glass-border bg-bg-void/70 px-4 py-3 text-text-primary outline-none transition placeholder:text-text-muted focus:border-cyan-primary focus:shadow-cyan-glow motion-reduce:transition-none"
      />
      {error && (
        <p className="text-xs" style={{ color: "#E63CD8" }}>{error}</p>
      )}
    </label>
  );
}
