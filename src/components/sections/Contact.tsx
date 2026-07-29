"use client";

import { useEffect, useId, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import { Send } from "lucide-react";
import { sendContactEmail } from "@/app/[locale]/actions";

type FormErrors = { name?: string; email?: string; message?: string };

const inputClass =
  "w-full rounded-xl bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/45 focus-visible:ring-2 focus-visible:ring-purple-400";

const directLinks = [
  {
    Icon: FiMail,
    label: "Email",
    value: "linderhassinger00@gmail.com",
    href: "mailto:linderhassinger00@gmail.com",
    external: false,
  },
  {
    Icon: FiGithub,
    label: "GitHub",
    value: "github.com/linder3hs",
    href: "https://github.com/linder3hs",
    external: true,
  },
  {
    Icon: FiLinkedin,
    label: "LinkedIn",
    value: "linkedin.com/in/linderhassinger",
    href: "https://linkedin.com/in/linderhassinger",
    external: true,
  },
];

export function Contact() {
  const t = useTranslations("contact");
  const formId = useId();
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (status !== "success") return;
    const timer = setTimeout(() => setStatus("idle"), 5000);
    return () => clearTimeout(timer);
  }, [status]);

  const validate = (data: typeof formData): FormErrors => {
    const errors: FormErrors = {};
    if (!data.name.trim() || data.name.trim().length < 2) errors.name = t("error_name");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) errors.email = t("error_email");
    if (!data.message.trim() || data.message.trim().length < 10) {
      errors.message = t("error_message");
    }
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validate(formData);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      // Move focus to the first invalid field so keyboard users land on the problem.
      document.getElementById(`${formId}-${Object.keys(errors)[0]}`)?.focus();
      return;
    }
    setFieldErrors({});
    setStatus("sending");
    setErrorMsg("");

    const result = await sendContactEmail(formData);

    if (result.success) {
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } else {
      setStatus("error");
      setErrorMsg(result.error ?? t("error"));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name as keyof FormErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (status === "error") setStatus("idle");
  };

  /** Label + control + error, wired together for assistive tech. */
  const fieldProps = (name: keyof FormErrors) => {
    const id = `${formId}-${name}`;
    const error = fieldErrors[name];
    return {
      id,
      name,
      value: formData[name],
      onChange: handleChange,
      "aria-invalid": error ? true : undefined,
      "aria-describedby": error ? `${id}-error` : undefined,
      className: inputClass,
      style: {
        border: `1px solid ${error ? "rgba(248,113,113,0.6)" : "rgba(255,255,255,0.1)"}`,
      },
    };
  };

  /** Plain function, not a component: keeps the element type stable across renders. */
  const renderFieldError = (name: keyof FormErrors) => {
    const error = fieldErrors[name];
    if (!error) return null;
    return (
      <motion.p
        id={`${formId}-${name}-error`}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-1 text-xs text-red-300"
      >
        {error}
      </motion.p>
    );
  };

  return (
    <section id="contact" className="px-4 py-24">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <div className="glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
            <span className="text-xs font-medium text-emerald-300">
              {t("availability")}
            </span>
          </div>

          <h2 className="font-heading text-gradient mb-4 text-3xl font-bold md:text-4xl">
            {t("title")}
          </h2>
          <p className="text-sm text-white/60">{t("subtitle")}</p>
          <div
            aria-hidden
            className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-purple-500 to-transparent"
          />
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          <motion.form
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-4"
          >
            {/*
              Labels are visually hidden rather than absent: a placeholder
              disappears on input and is never announced as a name.
            */}
            <div className="flex flex-col gap-1">
              <label htmlFor={`${formId}-name`} className="sr-only">
                {t("name_label")}
              </label>
              <input
                type="text"
                autoComplete="name"
                placeholder={t("name_label")}
                {...fieldProps("name")}
              />
              {renderFieldError("name")}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor={`${formId}-email`} className="sr-only">
                {t("email_label")}
              </label>
              <input
                type="email"
                autoComplete="email"
                placeholder={t("email_label")}
                {...fieldProps("email")}
              />
              {renderFieldError("email")}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor={`${formId}-message`} className="sr-only">
                {t("message_label")}
              </label>
              <textarea
                rows={5}
                placeholder={t("message_label")}
                {...fieldProps("message")}
                className={`${inputClass} resize-none`}
              />
              {renderFieldError("message")}
            </div>

            {/* Submission result is announced, not just shown. */}
            <div role="status" aria-live="polite">
              {status === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass rounded-xl border border-emerald-500/25 py-3 text-center text-sm text-emerald-300"
                >
                  {t("success")}
                </motion.div>
              )}
              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass rounded-xl border border-red-500/25 py-3 text-center text-sm text-red-300"
                >
                  {errorMsg}
                </motion.div>
              )}
            </div>

            {status !== "success" && (
              <button
                type="submit"
                disabled={status === "sending"}
                className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white outline-none transition-all duration-300 hover:bg-violet-500 hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] focus-visible:ring-2 focus-visible:ring-white/70 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "sending" ? (
                  <>
                    <motion.span
                      aria-hidden
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                    />
                    {t("sending")}
                  </>
                ) : (
                  <>
                    <Send size={15} aria-hidden />
                    {t("send")}
                  </>
                )}
              </button>
            )}
          </motion.form>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col justify-center gap-4"
          >
            <p className="mb-2 text-sm text-white/60">{t("or")}</p>

            {directLinks.map(({ Icon, label, value, href, external }) => (
              <a
                key={label}
                href={href}
                {...(external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="glass group flex items-center gap-4 rounded-xl border border-white/[0.08] p-4 outline-none transition-all duration-300 hover:border-purple-400/50 focus-visible:ring-2 focus-visible:ring-purple-400"
              >
                <span
                  aria-hidden
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-purple-400/25 bg-purple-500/10 transition-colors group-hover:bg-purple-500/20"
                >
                  <Icon className="text-purple-300" size={18} />
                </span>
                <span>
                  <span className="mb-0.5 block text-xs text-white/60">{label}</span>
                  <span className="block text-sm font-medium text-white/85">
                    {value}
                  </span>
                </span>
              </a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
