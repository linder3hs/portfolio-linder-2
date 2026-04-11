"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import { Send } from "lucide-react";
import { sendContactEmail } from "@/app/[locale]/actions";

type FormErrors = { name?: string; email?: string; message?: string };

export function Contact() {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});

  // Auto-clear success message after 5 seconds
  useEffect(() => {
    if (status !== "success") return;
    const timer = setTimeout(() => setStatus("idle"), 5000);
    return () => clearTimeout(timer);
  }, [status]);

  const validate = (data: typeof formData): FormErrors => {
    const errors: FormErrors = {};
    if (!data.name.trim() || data.name.trim().length < 2) {
      errors.name = t("error_name");
    }
    if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      errors.email = t("error_email");
    }
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear the field error as the user types
    if (fieldErrors[name as keyof FormErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (status === "error") setStatus("idle");
  };

  return (
    <section id="contact" className="py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-xs font-medium">
              {t("availability")}
            </span>
          </div>

          <h2 className="font-heading text-3xl md:text-4xl font-bold text-gradient mb-4">
            {t("title")}
          </h2>
          <p className="text-white/40 text-sm">{t("subtitle")}</p>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto mt-4" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Form */}
          <motion.form
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1">
              <input
                type="text"
                name="name"
                placeholder={t("name_label")}
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] text-white placeholder:text-white/30 focus:outline-none transition-colors text-sm"
                style={{
                  border: `1px solid ${fieldErrors.name ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.08)"}`,
                }}
              />
              {fieldErrors.name && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-xs px-1"
                >
                  {fieldErrors.name}
                </motion.p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <input
                type="email"
                name="email"
                placeholder={t("email_label")}
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] text-white placeholder:text-white/30 focus:outline-none transition-colors text-sm"
                style={{
                  border: `1px solid ${fieldErrors.email ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.08)"}`,
                }}
              />
              {fieldErrors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-xs px-1"
                >
                  {fieldErrors.email}
                </motion.p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <textarea
                name="message"
                rows={5}
                placeholder={t("message_label")}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] text-white placeholder:text-white/30 focus:outline-none transition-colors text-sm resize-none"
                style={{
                  border: `1px solid ${fieldErrors.message ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.08)"}`,
                }}
              />
              {fieldErrors.message && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-xs px-1"
                >
                  {fieldErrors.message}
                </motion.p>
              )}
            </div>

            {status === "success" && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-emerald-400 text-sm text-center py-3 glass rounded-xl border border-emerald-500/20"
              >
                {t("success")}
              </motion.div>
            )}

            {status === "error" && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm text-center py-3 glass rounded-xl border border-red-500/20"
              >
                {errorMsg}
              </motion.div>
            )}

            {status !== "success" && (
              <button
                type="submit"
                disabled={status === "sending"}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl font-semibold text-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] text-white"
              >
                {status === "sending" ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                    {t("sending")}
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    {t("send")}
                  </>
                )}
              </button>
            )}
          </motion.form>

          {/* Direct contact */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col justify-center gap-4"
          >
            <p className="text-white/40 text-sm mb-2">{t("or")}</p>

            <a
              href="mailto:linderhassinger00@gmail.com"
              className="flex items-center gap-4 p-4 glass rounded-xl transition-all duration-300 hover:border-purple-500/50 group border border-white/[0.08]"
            >
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0 group-hover:bg-purple-500/20 transition-colors">
                <FiMail className="text-purple-400" size={18} />
              </div>
              <div>
                <div className="text-xs text-white/40 mb-0.5">Email</div>
                <div className="text-white/80 text-sm font-medium">
                  linderhassinger00@gmail.com
                </div>
              </div>
            </a>

            <a
              href="https://github.com/linder3hs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 glass rounded-xl transition-all duration-300 hover:border-purple-500/50 group border border-white/[0.08]"
            >
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0 group-hover:bg-purple-500/20 transition-colors">
                <FiGithub className="text-purple-400" size={18} />
              </div>
              <div>
                <div className="text-xs text-white/40 mb-0.5">GitHub</div>
                <div className="text-white/80 text-sm font-medium">
                  github.com/linder3hs
                </div>
              </div>
            </a>

            <a
              href="https://linkedin.com/in/linderhassinger"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 glass rounded-xl transition-all duration-300 hover:border-purple-500/50 group border border-white/[0.08]"
            >
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0 group-hover:bg-purple-500/20 transition-colors">
                <FiLinkedin className="text-purple-400" size={18} />
              </div>
              <div>
                <div className="text-xs text-white/40 mb-0.5">LinkedIn</div>
                <div className="text-white/80 text-sm font-medium">
                  linkedin.com/in/linderhassinger
                </div>
              </div>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
